import { rest } from 'msw'
import { SnakeCasedPropertiesDeep } from 'type-fest'
import { EQUIPMENTS_API } from 'src/modules/Profile/components/Equipments/equipmentHooks'
import {
    equipmentNameType,
    IEquipment,
    meterEquipmentType,
    postEquipmentInputType,
} from 'src/modules/Profile/components/Equipments/EquipmentsType'
/**
 * Mock for meter data to be added.
 */
export const TEST_SAVE_EQUIPMENT: SnakeCasedPropertiesDeep<meterEquipmentType> = {
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
        equipment_name: 'heater' as equipmentNameType,
        equipment_allowed_type: ['electricity', 'other'],
        // meter_equipment: null,
        meter_equipment: null,
    },
    {
        id: 2,
        equipment_name: 'hotplate' as equipmentNameType,
        equipment_allowed_type: ['vitroceramic', 'induction', 'other'],
        meter_equipment: null,
    },
    {
        id: 3,
        equipment_name: 'computerdesktop' as equipmentNameType,
        equipment_allowed_type: [],
        meter_equipment: null,
    },
    {
        id: 4,
        equipment_name: 'laptop' as equipmentNameType,
        equipment_allowed_type: [],
        meter_equipment: null,
    },
    {
        id: 5,
        equipment_name: 'tv' as equipmentNameType,
        equipment_allowed_type: [],
        meter_equipment: null,
    },
    {
        id: 6,
        equipment_name: 'vacuum' as equipmentNameType,
        equipment_allowed_type: [],
        meter_equipment: null,
    },
    {
        id: 7,
        equipment_name: 'oven' as equipmentNameType,
        equipment_allowed_type: [],
        meter_equipment: null,
    },
    {
        id: 8,
        equipment_name: 'microwave' as equipmentNameType,
        equipment_allowed_type: [],
        meter_equipment: null,
    },
    {
        id: 9,
        equipment_name: 'fridge' as equipmentNameType,
        equipment_allowed_type: [],
        meter_equipment: null,
    },
    {
        id: 10,
        equipment_name: 'dishwasher' as equipmentNameType,
        equipment_allowed_type: [],
        meter_equipment: null,
    },
    {
        id: 11,
        equipment_name: 'washingmachine' as equipmentNameType,
        equipment_allowed_type: [],
        meter_equipment: null,
    },
    {
        id: 12,
        equipment_name: 'dryer' as equipmentNameType,
        equipment_allowed_type: [],
        meter_equipment: null,
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
            TEST_EQUIPMENTS[0].meter_equipment = [TEST_SAVE_EQUIPMENT]
            TEST_EQUIPMENTS[1].meter_equipment = [{ ...TEST_SAVE_EQUIPMENT, equipment_type: 'induction' }]
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
