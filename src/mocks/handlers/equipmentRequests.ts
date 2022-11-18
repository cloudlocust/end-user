import { IEquipmentRequest } from 'src/modules/EquipmentRequests/equipmentRequests'
import { SnakeCasedPropertiesDeep } from 'type-fest'
import { rest } from 'msw'
import { getPaginationFromElementList } from 'src/mocks/utils'
import { EQUIPMENTS_REQUESTS_API } from 'src/modules/EquipmentRequests/EquipmentRequestsHook'

const CREATED_AT_DATA = '2021-12-15T14:07:38.138000'

/**
 * Mocked data for Installation Requests.
 */
export var TEST_EQUIPMENT_REQUESTS: SnakeCasedPropertiesDeep<IEquipmentRequest[]> = [
    {
        id: 1,
        brand: 'brand1',
        installed_at: CREATED_AT_DATA,
        reference: 'refrence1',
        type: 'DEMOTIC',
    },
    {
        id: 2,
        brand: 'brand2',
        installed_at: CREATED_AT_DATA,
        reference: 'refrence2',
        type: 'INVERTER',
    },
    {
        id: 3,
        brand: 'brand3',
        installed_at: CREATED_AT_DATA,
        reference: 'refrence3',
        type: 'OTHER',
    },
    {
        id: 4,
        brand: 'brand4',
        installed_at: CREATED_AT_DATA,
        reference: 'refrence4',
        type: 'INVERTER',
    },
    {
        id: 5,
        brand: 'brand5',
        installed_at: CREATED_AT_DATA,
        reference: 'refrence5',
        type: 'SOLAR',
    },
]

/**
 * Equipment requests endpoints.
 */
export const equipmentRequestsEndpoints = [
    rest.get(EQUIPMENTS_REQUESTS_API, (req, res, ctx) => {
        const TEST_EQUIPMENT_REQUESTS_RESPONSE = getPaginationFromElementList<
            SnakeCasedPropertiesDeep<IEquipmentRequest>
        >(req, TEST_EQUIPMENT_REQUESTS as [])
        return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_EQUIPMENT_REQUESTS_RESPONSE))
    }),
]
