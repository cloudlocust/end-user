import { rest } from 'msw'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { installationInfosType } from 'src/modules/MyHouse/components/Installation/InstallationType.d'
import { SnakeCasedPropertiesDeep } from 'type-fest'

/**
 * Mocked data for installation informations.
 */
export const TEST_INSTALLATION: SnakeCasedPropertiesDeep<installationInfosType> = {
    housing_equipments: [
        {
            equipment_id: 1,
            equipment_type: 'other',
            equipment_number: 1,
        },
        {
            equipment_id: 2,
            equipment_type: 'other',
            equipment_number: 1,
        },
        {
            equipment_id: 13,
            equipment_type: 'other',
            equipment_number: 1,
        },
        {
            equipment_id: 14,
            equipment_type: 'existant',
            equipment_number: 1,
        },
    ],
    solar_installation: {
        title: 'Installation solaire',
        installation_date: '2024-02-01T08:00:00.000Z',
        solar_panel_type: 'Monocristallin',
        orientation: 0,
        power: 100,
        inverter_brand: 'SolarEdge',
        inclination: 20,
        has_resale_contract: true,
        resale_tariff: 0.2,
        status_when_wanting_solar_panel: 'Propriétaire',
    },
}

/**
 * Mocked data for the new installation informations.
 */
export const TEST_NEW_INSTALLATION: SnakeCasedPropertiesDeep<installationInfosType> = {
    housing_equipments: [
        {
            equipment_id: 1,
            equipment_type: 'individual',
            equipment_number: 1,
        },
        {
            equipment_id: 2,
            equipment_type: 'induction',
            equipment_number: 1,
        },
        {
            equipment_id: 13,
            equipment_type: 'collective',
            equipment_number: 1,
        },
        {
            equipment_id: 14,
            equipment_type: 'nonexistant',
            equipment_number: 1,
        },
    ],
}

/**
 * Backend error message for getting the installation.
 */
export const TEST_GET_INSTALLATION_BACKEND_ERROR_MESSAGE = "Erreur backend lors du chargement des infos d'installation"
/**
 * Backend error message for adding or updating the installation.
 */
export const TEST_ADD_UPDATE_INSTALLATION_BACKEND_ERROR_MESSAGE =
    "Erreur backend lors de l'enregistrement des infos d'installation"

/**
 * Installation api requests.
 */
export const installationEndpoints = [
    // Get the installation informations of a housing.
    rest.get(`${HOUSING_API}/:id/installation`, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        if (authorization && authorization === 'failed') {
            return res(ctx.status(400), ctx.delay(1000))
        }
        if (authorization && authorization === 'failed with message') {
            return res(
                ctx.status(400),
                ctx.delay(1000),
                ctx.json({
                    detail: TEST_GET_INSTALLATION_BACKEND_ERROR_MESSAGE,
                }),
            )
        }
        return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_INSTALLATION))
    }),

    // Create or update the installation informations of a housing.
    rest.post<installationInfosType>(`${HOUSING_API}/:id/installation`, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        if (authorization && authorization === 'failed') {
            return res(ctx.status(400), ctx.delay(1000))
        }
        if (authorization && authorization === 'failed with message') {
            return res(
                ctx.status(400),
                ctx.delay(1000),
                ctx.json({
                    detail: TEST_ADD_UPDATE_INSTALLATION_BACKEND_ERROR_MESSAGE,
                }),
            )
        }
        return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_NEW_INSTALLATION))
    }),
]
