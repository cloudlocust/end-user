import { rest } from 'msw'
import { getPaginationFromElementList } from 'src/mocks/utils'
import {
    ECOGESTES_ENDPOINT,
    ECOGESTES_POLES_ENDPOINT,
    ECOGESTES_ROOMS_ENDPOINT,
} from 'src/modules/Ecogestes/EcogestesConfig'
import { IEcogeste, IEcogestCategory } from 'src/modules/Ecogestes/components/ecogeste'
import { SnakeCasedPropertiesDeep } from 'type-fest'

/**
 * Path used for mock icons.
 */
export const EXAMPLE_ICON = 'https://drive.google.com/uc?export=download&id=1K4K5jLP6ucnqqfsO3zOayulCYMmYTWYb'
/**
 * Object holding a bunch of mocked ecogests.
 */
export const TEST_ECOGESTES: SnakeCasedPropertiesDeep<IEcogeste>[] = [
    {
        id: 1,
        title: 'A viewed Ecogest',
        description: 'This is an ecogest that the customer has already seen.',
        infos: 'This is an ecogest that the customer has already seen.',
        percentage_saved: '10%',
        url_icon: EXAMPLE_ICON,
        seen_by_customer: true,
        highlighted: true,
    },
    {
        id: 2,
        title: 'Installer des rideaux aux fenêtres',
        description:
            'Un volet fermé pendant la nuit peut réduire la déperdition de chaleur de la fenêtre jusqu’à 60 %. Le soir, fermez les rideaux et les volets. À l’inverse, en journée pendant l’hiver, favorisez au maximum les apports solaires. La sensation de confort sera améliorée, et vous pourrez alors baisser votre température intérieure d’un degré. Les volets et protections solaires conservent le logement frais en été et chaud en hiver.',
        infos: 'An extended_description1',
        percentage_saved: '15%',
        url_icon: EXAMPLE_ICON,
        seen_by_customer: false,
        highlighted: true,
    },
    {
        id: 3,
        title: 'Régler son thermostat',
        description:
            'Le corps a besoin d’environ une semaine pour s’acclimater à une nouvelle température : alors, ne vous précipitez pas sur le chauffage dès la première baisse de température mais attendez plutôt de voir si vous vous habituez. L’humidité et les infiltrations d’air peuvent aussi amplifier la sensation d’inconfort. Avec un thermostat à 20 °C, vous pouvez avoir un ressenti de 17 °C si la maison est humide, que l’air s’infiltre ou que la température n’est pas la même partout (effet paroi froide). Des solutions de rénovation existent pour améliorer votre confort.',
        infos: 'An extended_description2',
        percentage_saved: '++',
        url_icon: EXAMPLE_ICON,
        seen_by_customer: false,
        highlighted: true,
    },
    {
        id: 4,
        title: 'Couper l’eau pendant le savonnage',
        description: 'Couper l’eau pendant le savonnage permet de réaliser une économie sur votre consommation.',
        infos: 'An extended_description3',
        percentage_saved: '-',
        url_icon: EXAMPLE_ICON,
        seen_by_customer: false,
        highlighted: false,
    },
    {
        id: 5,
        title: 'Ecogest which should fail when view status changes',
        description:
            'Privilégiez toujours les apports de l’éclairage naturel : la lumière du jour est la meilleure pour l’oeil humain.',
        infos: 'An extended_description4',
        percentage_saved: '',
        url_icon: EXAMPLE_ICON,
        seen_by_customer: true,
        highlighted: false,
    },
]

/**
 * Mock list of Consumption Poles.
 */
export const TEST_ECOGESTES_POLES_CATEGORY: IEcogestCategory[] = [
    {
        id: 1,
        name: 'Chauffage',
        nbEcogeste: 2,
        icon: EXAMPLE_ICON,
    },
    {
        id: 2,
        name: 'Electricité',
        nbEcogeste: 1,
        icon: EXAMPLE_ICON,
    },
]

/**
 * Mock list of Consumption Poles.
 */
export const TEST_ECOGESTES_ROOMS_CATEGORY: IEcogestCategory[] = [
    {
        id: 1,
        name: 'Salon',
        nbEcogeste: 2,
        icon: EXAMPLE_ICON,
    },
    {
        id: 2,
        name: 'Cuisine',
        nbEcogeste: 1,
        icon: EXAMPLE_ICON,
    },
    {
        id: 3,
        name: 'Cave',
        nbEcogeste: 42,
        icon: EXAMPLE_ICON,
    },
]

/**
 * Ecogeste and categories of ecogeste endpoints.
 */
export const ecogestesEndpoints = [
    rest.get(ECOGESTES_ENDPOINT, (req, res, ctx) => {
        if (req.params.categoryId < 0) throw new Error('WRONG BAD')
        let gests = TEST_ECOGESTES
        const tag_id = req.url.searchParams.get('tag_id')
        if (tag_id !== null) {
            switch (tag_id) {
                case '1':
                    gests = gests.slice(0, 2)
                    break
                case '2':
                    gests = gests.slice(2, 3)
                    break
                default:
                    gests = []
                    break
            }
        }
        const viewed = req.url.searchParams.get('viewed')
        if (viewed !== null) {
            gests = gests.filter((gest) => gest.seen_by_customer === (viewed === 'true'))
        }

        if (req.url.searchParams.get('highlighted') === 'true')
            gests = gests.filter((gest) => gest.highlighted === true)

        const ECOGESTE_RESPONSE = getPaginationFromElementList(req, gests as [any])
        return res(ctx.status(200), ctx.delay(1000), ctx.json(ECOGESTE_RESPONSE))
    }),
    rest.patch(`${ECOGESTES_ENDPOINT}/:gestId`, (req, res, ctx) => {
        const { gestId } = req.params
        if (gestId === '5' || req.headers.get('X-TEST') === 'bad-patch') {
            return res(ctx.status(400), ctx.delay(1000))
        }
        return res(ctx.status(200), ctx.delay(1000))
    }),
    rest.get(`${ECOGESTES_POLES_ENDPOINT}`, (req, res, ctx) => {
        const tag_response = getPaginationFromElementList(req, TEST_ECOGESTES_POLES_CATEGORY)
        return res(ctx.status(200), ctx.delay(1000), ctx.json(tag_response))
    }),
    rest.get(`${ECOGESTES_ROOMS_ENDPOINT}`, (req, res, ctx) => {
        const tag_response = getPaginationFromElementList(req, TEST_ECOGESTES_ROOMS_CATEGORY)
        return res(ctx.status(200), ctx.delay(1000), ctx.json(tag_response))
    }),
]
