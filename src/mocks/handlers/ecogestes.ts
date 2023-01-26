import { rest } from 'msw'
import { ECOGESTES_ENDPOINT } from 'src/modules/Ecogestes/'
import { getPaginationFromElementList } from 'src/mocks/utils'

// const MOCK_ECOGESTES_ENDPOINT = `${ECOGESTES_ENDPOINT}`
const MOCK_ECOGESTES_BY_CATEGORY_ENDPOINT = `${ECOGESTES_ENDPOINT}/by-category/:categoryId`

const TEST_ECOGESTES = [
    {
        title: 'bob',
        description: 'A description',
        shortdescription: 'A short description',
    },
    {
        title: 'Installer des rideaux aux fenêtres',
        shortdescription: 'J’installe des rideaux épais et/ou des volets à toutes les fenêtres des pièces chauffées.',
        description:
            'Un volet fermé pendant la nuit peut réduire la déperdition de chaleur de la fenêtre jusqu’à 60 %. Le soir, fermez les rideaux et les volets. À l’inverse, en journée pendant l’hiver, favorisez au maximum les apports solaires. La sensation de confort sera améliorée, et vous pourrez alors baisser votre température intérieure d’un degré. Les volets et protections solaires conservent le logement frais en été et chaud en hiver.',
        savings: 15,
    },
    {
        title: 'Régler son thermostat',
        shortdescription: 'Je règle le thermostat en fonction de mes besoins.',
        description:
            'Le corps a besoin d’environ une semaine pour s’acclimater à une nouvelle température : alors, ne vous précipitez pas sur le chauffage dès la première baisse de température mais attendez plutôt de voir si vous vous habituez. L’humidité et les infiltrations d’air peuvent aussi amplifier la sensation d’inconfort. Avec un thermostat à 20 °C, vous pouvez avoir un ressenti de 17 °C si la maison est humide, que l’air s’infiltre ou que la température n’est pas la même partout (effet paroi froide). Des solutions de rénovation existent pour améliorer votre confort.',
        savings: 8,
    },
    {
        title: 'Couper l’eau pendant le savonnage',
        shortdescription: 'Je coupe l’eau de la douche pendant le savonnage	',
        description: 'Couper l’eau pendant le savonnage permet de réaliser une économie sur votre consommation.',
        savings: 37,
    },
    {
        title: 'Ouvrir en journée',
        shortdescription: 'J’ouvre les rideaux et les volets en journée	',
        description:
            'Privilégiez toujours les apports de l’éclairage naturel : la lumière du jour est la meilleure pour l’oeil humain.',
        savings: 1,
    },
]

/**
 * Ecogeste and categories of ecogeste endpoints.
 */
export const ecogestesEndpoints = [
    rest.get<any>(MOCK_ECOGESTES_BY_CATEGORY_ENDPOINT, (req, res, ctx) => {
        if (req.params.categoryId < 0) throw new Error('WRONG BAD')
        const ECOGESTE_RESPONSE = getPaginationFromElementList(req, TEST_ECOGESTES as [])

        return res(ctx.status(200), ctx.delay(1000), ctx.json(ECOGESTE_RESPONSE))
    }),
]
