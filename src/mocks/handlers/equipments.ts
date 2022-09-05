import { rest } from 'msw'
import { SnakeCasedPropertiesDeep } from 'type-fest'
import { ALL_EQUIPMENTS_API } from 'src/modules/MyHouse/components/Equipments/equipmentHooks'
import {
    equipmentNameType,
    equipmentType,
    equipmentMeterType,
    postEquipmentInputType,
    IEquipmentMeter,
} from 'src/modules/MyHouse/components/Equipments/EquipmentsType'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
/**
 * Mock for meter data to be added.
 */
export const TEST_SAVE_EQUIPMENT: SnakeCasedPropertiesDeep<equipmentMeterType> = {
    equipment_id: 1,
    equipment_type: 'electricity',
}

// eslint-disable-next-line jsdoc/require-jsdoc
export const TEST_ERROR_SAVE_EQUIPMENT_ID = -1

// eslint-disable-next-line jsdoc/require-jsdoc
export const TEST_AUTHORIZATION_LOAD_EMPTY_METER_EQUIPEMENTS = 'empty meter equipments'
// eslint-disable-next-line jsdoc/require-jsdoc
export const TEST_LOAD_ERROR_METER_EQUIPMENT = 'errorMeter'
// eslint-disable-next-line jsdoc/require-jsdoc
export const TEST_LOAD_ERROR_EQUIPMENT = 'errorEquipment'

// eslint-disable-next-line jsdoc/require-jsdoc
export const CREATED_AT_DATA = '2021-12-15T14:07:38.138000'

/**
 * Mock of customers/clients list data.
 */
export var TEST_EQUIPMENTS: SnakeCasedPropertiesDeep<equipmentType>[] = [
    {
        id: 1,
        name: 'heater' as equipmentNameType,
        allowed_type: ['electricity', 'other'],
    },
    {
        id: 2,
        name: 'sanitary' as equipmentNameType,
        allowed_type: ['electricity', 'gaz', 'other'],
    },
    {
        id: 3,
        name: 'hotplate' as equipmentNameType,
        allowed_type: ['vitroceramic', 'induction', 'other'],
    },
    {
        id: 4,
        name: 'desktopcomputer' as equipmentNameType,
        allowed_type: [],
    },
    {
        id: 5,
        name: 'laptop' as equipmentNameType,
        allowed_type: [],
    },
    {
        id: 6,
        name: 'tv' as equipmentNameType,
        allowed_type: [],
    },
    {
        id: 7,
        name: 'vacuum' as equipmentNameType,
        allowed_type: [],
    },
    {
        id: 8,
        name: 'oven' as equipmentNameType,
        allowed_type: [],
    },
    {
        id: 9,
        name: 'microwave' as equipmentNameType,
        allowed_type: [],
    },
    {
        id: 10,
        name: 'fridge' as equipmentNameType,
        allowed_type: [],
    },
    {
        id: 11,
        name: 'dishwasher' as equipmentNameType,
        allowed_type: [],
    },
    {
        id: 12,
        name: 'washingmachine' as equipmentNameType,
        allowed_type: [],
    },
    {
        id: 13,
        name: 'dryer' as equipmentNameType,
        allowed_type: [],
    },
]

/**
 * Mock of customers/clients list data.
 */
export var TEST_HOUSING_EQUIPMENTS: SnakeCasedPropertiesDeep<IEquipmentMeter>[] = [
    {
        equipment_id: 1,
        equipment_number: 0,
        equipment: {
            id: 1,
            name: 'heater' as equipmentNameType,
            allowed_type: ['electricity', 'other'],
        },
    },
    {
        equipment_id: 2,
        equipment_number: 0,
        equipment: {
            id: 2,
            name: 'sanitary' as equipmentNameType,
            allowed_type: ['electricity', 'other'],
        },
    },
    {
        equipment_id: 3,
        equipment_number: 0,
        equipment_type: 'vitroceramic',
        equipment: {
            id: 3,
            name: 'hotplate' as equipmentNameType,
            allowed_type: ['vitroceramic', 'induction', 'other'],
        },
    },
    {
        equipment_id: 4,
        equipment_number: 3,
        equipment_type: 'electricity',
        equipment: {
            id: 4,
            name: 'desktopcomputer' as equipmentNameType,
            allowed_type: [],
        },
    },
    {
        equipment_id: 5,
        equipment_number: 0,
        equipment_type: 'electricity',
        equipment: {
            id: 5,
            name: 'laptop' as equipmentNameType,
            allowed_type: [],
        },
    },
    {
        equipment_id: 6,
        equipment_number: 0,
        equipment_type: 'electricity',
        equipment: {
            id: 6,
            name: 'tv' as equipmentNameType,
            allowed_type: [],
        },
    },
    {
        equipment_id: 7,
        equipment_number: 0,
        equipment_type: 'electricity',
        equipment: {
            id: 7,
            name: 'vacuum' as equipmentNameType,
            allowed_type: [],
        },
    },
    {
        equipment_id: 8,
        equipment_number: 0,
        equipment_type: 'electricity',
        equipment: {
            id: 8,
            name: 'oven' as equipmentNameType,
            allowed_type: [],
        },
    },
    {
        equipment_id: 9,
        equipment_number: 0,
        equipment_type: 'electricity',
        equipment: {
            id: 9,
            name: 'microwave' as equipmentNameType,
            allowed_type: [],
        },
    },
    {
        equipment_id: 10,
        equipment_number: 0,
        equipment_type: 'electricity',
        equipment: {
            id: 10,
            name: 'fridge' as equipmentNameType,
            allowed_type: [],
        },
    },
    {
        equipment_id: 11,
        equipment_number: 0,
        equipment_type: 'electricity',
        equipment: {
            id: 11,
            name: 'dishwasher' as equipmentNameType,
            allowed_type: [],
        },
    },
    {
        equipment_id: 12,
        equipment_number: 0,
        equipment_type: 'electricity',
        equipment: {
            id: 12,
            name: 'washingmachine' as equipmentNameType,
            allowed_type: [],
        },
    },
    {
        equipment_id: 13,
        equipment_number: 0,
        equipment_type: 'electricity',
        equipment: {
            id: 13,
            name: 'dryer' as equipmentNameType,
            allowed_type: [],
        },
    },
]

// eslint-disable-next-line jsdoc/require-jsdoc
export const equipmentsEndpoints = [
    // Get All Equipments of Meter
    rest.get(ALL_EQUIPMENTS_API, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        if (authorization && authorization === TEST_LOAD_ERROR_METER_EQUIPMENT)
            return res(ctx.status(404), ctx.delay(1000), ctx.json('error'))
        return res(ctx.status(200), ctx.json(TEST_EQUIPMENTS))
    }),

    // Get All Equipments of Meter
    rest.get(`${HOUSING_API}/:id/equipments`, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        if (authorization && authorization === TEST_LOAD_ERROR_EQUIPMENT)
            return res(ctx.status(404), ctx.delay(1000), ctx.json('error'))
        else if (authorization && authorization === TEST_AUTHORIZATION_LOAD_EMPTY_METER_EQUIPEMENTS)
            return res(ctx.status(200), ctx.delay(1000), ctx.json([]))
        return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_HOUSING_EQUIPMENTS))
    }),

    // Save Equipment Post request
    rest.post<SnakeCasedPropertiesDeep<postEquipmentInputType>>(`${HOUSING_API}/:id/equipments`, (req, res, ctx) => {
        // Success
        if (req.body[0].equipment_id === TEST_SAVE_EQUIPMENT.equipment_id) {
            TEST_HOUSING_EQUIPMENTS[0] = { ...TEST_SAVE_EQUIPMENT, ...TEST_HOUSING_EQUIPMENTS[0] }
            TEST_HOUSING_EQUIPMENTS[2] = {
                ...TEST_SAVE_EQUIPMENT,
                equipment_type: 'induction',
                ...TEST_HOUSING_EQUIPMENTS[0],
            }
            return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_SAVE_EQUIPMENT))
        } else if (req.body[0].equipment_id === TEST_ERROR_SAVE_EQUIPMENT_ID) {
            // Message error
            return res(ctx.status(400), ctx.delay(1000), ctx.json({ detail: 'Erreur backend' }))
        } else {
            // Other error
            return res(ctx.status(401), ctx.delay(1000))
        }
    }),
]
