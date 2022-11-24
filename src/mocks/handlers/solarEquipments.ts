import { SnakeCasedPropertiesDeep } from 'type-fest'
import { rest } from 'msw'
import { getPaginationFromElementList } from 'src/mocks/utils'
import { ISolarEquipment, solarEquipmentInputType } from 'src/modules/SolarEquipments/solarEquipments'
import { SOLAR_EQUIPMENTS_API } from 'src/modules/SolarEquipments/solarEquipmentsHook'
import dayjs from 'dayjs'

const CREATED_AT_DATA = '2021-12-15T14:07:38.138000'

/**
 * Mocked data for Installation Requests.
 */
export var TEST_SOLAR_EQUIPMENTS: SnakeCasedPropertiesDeep<ISolarEquipment[]> = [
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
export const solarEquipmentsEndpoints = [
    rest.get(SOLAR_EQUIPMENTS_API, (req, res, ctx) => {
        const TEST_SOLAR_EQUIPMENTS_RESPONSE = getPaginationFromElementList<SnakeCasedPropertiesDeep<ISolarEquipment>>(
            req,
            TEST_SOLAR_EQUIPMENTS as [],
        )
        return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_SOLAR_EQUIPMENTS_RESPONSE))
    }),

    rest.post<solarEquipmentInputType>(SOLAR_EQUIPMENTS_API, (req, res, ctx) => {
        const { brand, installedAt, reference, type } = req.body
        if (Object.values(req.body)) {
            const newId = TEST_SOLAR_EQUIPMENTS.length + 1
            const newEquipmentRequest: SnakeCasedPropertiesDeep<solarEquipmentInputType> = {
                brand,
                installed_at: dayjs(installedAt).toISOString(),
                reference,
                type,
            }
            TEST_SOLAR_EQUIPMENTS.push({ id: newId, ...newEquipmentRequest })
            return res(ctx.status(201), ctx.delay(1000), ctx.json(req.body))
        }
        return res(ctx.status(400), ctx.delay(1000))
    }),

    rest.put<solarEquipmentInputType>(`${SOLAR_EQUIPMENTS_API}/:id`, (req, res, ctx) => {
        if (parseInt(req.params.id) !== -1) {
            return res(ctx.status(200), ctx.delay(1000), ctx.json(req.body))
        }

        return res(ctx.status(400), ctx.delay(1000))
    }),

    rest.delete(`${SOLAR_EQUIPMENTS_API}/:id`, (req, res, ctx) => {
        const { id: solarEquipment } = req.params
        if (parseInt(solarEquipment) !== -1) {
            return res(ctx.status(200), ctx.delay(1000))
        }

        return res(ctx.status(400), ctx.delay(1000))
    }),
]
