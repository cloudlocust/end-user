import { rest } from 'msw'
import { ECOGESTES_ENDPOINT } from 'src/modules/Ecogestes/'
import { getPaginationFromElementList } from 'src/mocks/utils'

// const MOCK_ECOGESTES_ENDPOINT = `${ECOGESTES_ENDPOINT}`
const MOCK_ECOGESTES_BY_CATEGORY_ENDPOINT = `${ECOGESTES_ENDPOINT}/byCategory/:categoryId`

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
]

/**
 * Ecogeste and categories of ecogeste endpoints.
 */
export const ecogestesEndpoints = [
    rest.get<any>(MOCK_ECOGESTES_BY_CATEGORY_ENDPOINT, (req, res, ctx) => {
        const ECOGESTE_RESPONSE = getPaginationFromElementList(req, TEST_ECOGESTES as [])

        return res(ctx.status(200), ctx.delay(1000), ctx.json(ECOGESTE_RESPONSE))
    }),
]
