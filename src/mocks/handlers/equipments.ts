import { rest } from 'msw'
import { SnakeCasedPropertiesDeep } from 'type-fest'
import { EQUIPMENTS_API } from 'src/modules/MyHouse/components/Equipments/equipmentHooks'
import {
    equipmentNameType,
    IEquipment,
    equipmentMetersType,
    postEquipmentInputType,
} from 'src/modules/MyHouse/components/Equipments/EquipmentsType'
/**
 * Mock for meter data to be added.
 */
export const TEST_SAVE_EQUIPMENT: SnakeCasedPropertiesDeep<equipmentMetersType> = {
    equipment_id: 1,
    equipment_type: 'electricity',
}

// eslint-disable-next-line jsdoc/require-jsdoc
export const TEST_ERROR_SAVE_EQUIPMENT_ID = -1

// eslint-disable-next-line jsdoc/require-jsdoc
export const CREATED_AT_DATA = '2021-12-15T14:07:38.138000'

/**
 * Mock of customers/clients list data.
 */
export var TEST_EQUIPMENTS: SnakeCasedPropertiesDeep<IEquipment>[] = [
    {
        id: 1,
        name: 'heater' as equipmentNameType,
        allowed_type: ['electricity', 'other'],
        // equipment_meters: null,
        equipment_meters: null,
    },
    {
        id: 2,
        name: 'hotplate' as equipmentNameType,
        allowed_type: ['vitroceramic', 'induction', 'other'],
        equipment_meters: null,
    },
    {
        id: 3,
        name: 'computerdesktop' as equipmentNameType,
        allowed_type: [],
        equipment_meters: null,
    },
    {
        id: 4,
        name: 'laptop' as equipmentNameType,
        allowed_type: [],
        equipment_meters: null,
    },
    {
        id: 5,
        name: 'tv' as equipmentNameType,
        allowed_type: [],
        equipment_meters: null,
    },
    {
        id: 6,
        name: 'vacuum' as equipmentNameType,
        allowed_type: [],
        equipment_meters: null,
    },
    {
        id: 7,
        name: 'oven' as equipmentNameType,
        allowed_type: [],
        equipment_meters: null,
    },
    {
        id: 8,
        name: 'microwave' as equipmentNameType,
        allowed_type: [],
        equipment_meters: null,
    },
    {
        id: 9,
        name: 'fridge' as equipmentNameType,
        allowed_type: [],
        equipment_meters: null,
    },
    {
        id: 10,
        name: 'dishwasher' as equipmentNameType,
        allowed_type: [],
        equipment_meters: null,
    },
    {
        id: 11,
        name: 'washingmachine' as equipmentNameType,
        allowed_type: [],
        equipment_meters: null,
    },
    {
        id: 12,
        name: 'dryer' as equipmentNameType,
        allowed_type: [],
        equipment_meters: null,
    },
]

// eslint-disable-next-line jsdoc/require-jsdoc
export const equipmentsEndpoints = [
    // Get All Equipments
    rest.get(EQUIPMENTS_API(1), (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        if (authorization) return res(ctx.status(404), ctx.delay(1000), ctx.json('error'))
        return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_EQUIPMENTS))
    }),

    // Save Equipment Post request
    rest.post<SnakeCasedPropertiesDeep<postEquipmentInputType>>(EQUIPMENTS_API(1), (req, res, ctx) => {
        // Success
        if (req.body[0].equipment_id === TEST_SAVE_EQUIPMENT.equipment_id) {
            TEST_EQUIPMENTS[0].equipment_meters = [TEST_SAVE_EQUIPMENT]
            TEST_EQUIPMENTS[1].equipment_meters = [{ ...TEST_SAVE_EQUIPMENT, equipment_type: 'induction' }]
            return res(ctx.status(200), ctx.delay(1000), ctx.json([TEST_SAVE_EQUIPMENT]))
        } else if (req.body[0].equipment_id === TEST_ERROR_SAVE_EQUIPMENT_ID) {
            // Message error
            return res(ctx.status(400), ctx.delay(1000), ctx.json({ detail: 'Erreur backend' }))
        } else {
            // Other error
            return res(ctx.status(401), ctx.delay(1000))
        }
    }),
]
