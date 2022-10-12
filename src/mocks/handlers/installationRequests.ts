import { rest } from 'msw'
import { getPaginationFromElementList } from 'src/mocks/utils'
import {
    createInstallationRequestType,
    IInstallationRequest,
    IInstallationRequests,
    updateInstallationRequestType,
} from 'src/modules/InstallationRequests/installationRequests'
import { INSTALLATION_REQUESTS_API } from 'src/modules/InstallationRequests/installationRequestsHooks'
import { SnakeCasedPropertiesDeep } from 'type-fest'

const CREATED_AT_DATA = '2021-12-15T14:07:38.138000'

/**
 * Mocked data for Installation Requests.
 */
export var TEST_INSTALLATION_REQUESTS: SnakeCasedPropertiesDeep<IInstallationRequest[]> = [
    {
        id: 1,
        budget: 1000.0,
        equipment_brand: 'Inspirion',
        status: 'NEW',
        comment: 'Besoin urgent',
        created_at: CREATED_AT_DATA,
        updated_at: CREATED_AT_DATA,
        equipment_type: 'SOLAR',
        equipment_model: 'AZS',
    },
    {
        id: 10,
        budget: 260.0,
        equipment_brand: 'Inspirion',
        status: 'NEW',
        comment:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eleifend, ante id hendrerit efficitur, ligula arcu laoreet mi, vel sagittis diam felis sed tellus. Mauris congu',
        created_at: CREATED_AT_DATA,
        updated_at: CREATED_AT_DATA,
        equipment_type: 'SOLAR',
        equipment_model: 'AZS',
    },
    {
        id: 20,
        budget: 1010.0,
        equipment_brand: 'Azero',
        status: 'CLOSED',
        comment: 'je recherche une installation rapide.',
        created_at: CREATED_AT_DATA,
        updated_at: CREATED_AT_DATA,
        equipment_type: 'OTHER',
        equipment_model: 'P90X',
    },
    {
        id: 8,
        budget: 430.0,
        equipment_brand: 'Brand',
        status: 'CANCELED',
        comment: '',
        created_at: CREATED_AT_DATA,
        updated_at: CREATED_AT_DATA,
        equipment_type: 'DEMOTIC',
        equipment_model: 'BSZ',
    },
    {
        id: 11,
        budget: 2000.0,
        equipment_brand: 'T-invert8',
        status: 'PENDING',
        comment: '',
        created_at: CREATED_AT_DATA,
        updated_at: CREATED_AT_DATA,
        equipment_type: 'INVERTER',
        equipment_model: 'T-C',
    },
    {
        id: 12,
        budget: 19879.0,
        equipment_brand: 'T-invert8',
        status: 'NEW',
        comment: 'Qualité exigée',
        created_at: CREATED_AT_DATA,
        updated_at: CREATED_AT_DATA,
        equipment_type: 'INVERTER',
        equipment_model: 'ref',
    },
    {
        id: 13,
        budget: 888.0,
        equipment_brand: 'axionz',
        status: 'CANCELED',
        comment: '',
        created_at: CREATED_AT_DATA,
        updated_at: CREATED_AT_DATA,
        equipment_type: 'OTHER',
        equipment_model: 'axxa12',
    },
    {
        id: 6,
        budget: 1000.0,
        equipment_brand: 'axionz',
        status: 'NEW',
        comment: 'new demand',
        created_at: CREATED_AT_DATA,
        updated_at: CREATED_AT_DATA,
        equipment_type: 'DEMOTIC',
        equipment_model: 'axdemo12',
    },
    {
        id: 7,
        budget: 999999.0,
        equipment_brand: 'Nami',
        status: 'NEW',
        comment: 'Site panneau solaire',
        created_at: CREATED_AT_DATA,
        updated_at: CREATED_AT_DATA,
        equipment_type: 'SOLAR',
        equipment_model: 'TESLA',
    },
    {
        id: 5,
        budget: 12000.0,
        equipment_brand: 'Nami-Dem23',
        status: 'NEW',
        comment: 'Demotic site',
        created_at: CREATED_AT_DATA,
        updated_at: CREATED_AT_DATA,
        equipment_type: 'DEMOTIC',
        equipment_model: 'TESLA',
    },
    {
        id: 19,
        budget: 3600.0,
        equipment_brand: 'brand',
        status: 'NEW',
        comment: 'comment',
        created_at: CREATED_AT_DATA,
        updated_at: CREATED_AT_DATA,
        equipment_type: 'SOLAR',
        equipment_model: 'AZS',
    },
    {
        id: 15,
        budget: 15000.0,
        equipment_brand: 'Teski',
        status: 'NEW',
        comment: '',
        created_at: CREATED_AT_DATA,
        updated_at: CREATED_AT_DATA,
        equipment_type: 'INVERTER',
        equipment_model: 'Teskinv',
    },
    {
        id: 16,
        budget: 1000.0,
        equipment_brand: 'Brand',
        status: 'NEW',
        comment: 'comment',
        created_at: CREATED_AT_DATA,
        updated_at: CREATED_AT_DATA,
        equipment_type: 'OTHER',
        equipment_model: 'SZA',
    },
]

/**
 * Installation request api requests.
 */
export const installationRequestsEndpoints = [
    // Get all the installation requests.
    rest.get(INSTALLATION_REQUESTS_API, (req, res, ctx) => {
        const TEST_INSTALLATIONS_REQUESTS_RESPONSE = getPaginationFromElementList<
            SnakeCasedPropertiesDeep<IInstallationRequests>
        >(req, TEST_INSTALLATION_REQUESTS as [])
        return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_INSTALLATIONS_REQUESTS_RESPONSE))
    }),

    // UPDATE one installation request.
    rest.put<updateInstallationRequestType>(`${INSTALLATION_REQUESTS_API}/:id`, (req, res, ctx) => {
        if (parseInt(req.params.id) !== -1) {
            return res(ctx.status(200), ctx.delay(1000), ctx.json(req.body))
        }

        return res(ctx.status(400), ctx.delay(1000))
    }),

    // CREATE one installation request.
    // eslint-disable-next-line sonarjs/no-identical-functions
    rest.post<createInstallationRequestType>(INSTALLATION_REQUESTS_API, (req, res, ctx) => {
        if (req.body) {
            return res(ctx.status(200), ctx.delay(1000), ctx.json(req.body))
        }

        return res(ctx.status(400), ctx.delay(1000))
    }),
]
