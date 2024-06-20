import { rest } from 'msw'
import { SnakeCasedPropertiesDeep } from 'type-fest'
import { ALL_EQUIPMENTS_API } from 'src/modules/MyHouse/components/Installation/installationHook'
import {
    equipmentNameType,
    equipmentType,
    equipmentMeterType,
    postEquipmentInputType,
    IEquipmentMeter,
    addEquipmentType,
} from 'src/modules/MyHouse/components/Installation/InstallationType.d'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { measurementStatusEnum } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgress.d'

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
export const TEST_MEASUREMENT_ERROR = 'measurement error'
// eslint-disable-next-line jsdoc/require-jsdoc
export const TEST_MEASUREMENT_RESULT_EXIST = 'measurement result exist'
// eslint-disable-next-line jsdoc/require-jsdoc
export const TEST_RESULT_VALUE = 25
// eslint-disable-next-line jsdoc/require-jsdoc
export const TEST_STATUS_PENDING = 'statusPending'
// eslint-disable-next-line jsdoc/require-jsdoc
export const TEST_STATUS_IN_PROGRESS = 'statusInProgress'
// eslint-disable-next-line jsdoc/require-jsdoc
export const TEST_STATUS_SUCCESS = 'statusSuccess'
// eslint-disable-next-line jsdoc/require-jsdoc
export const TEST_STATUS_FAILED = 'statusFailed'

// eslint-disable-next-line jsdoc/require-jsdoc
export const CREATED_AT_DATA = '2021-12-15T14:07:38.138000'

/**
 * Mock of customers/clients list data.
 */
export var TEST_EQUIPMENTS: SnakeCasedPropertiesDeep<equipmentType>[] = [
    {
        name: 'heater' as equipmentNameType,
        id: 1,
        allowed_type: ['other', 'collective', 'individual'],
    },
    {
        name: 'hotplate' as equipmentNameType,
        id: 2,
        allowed_type: ['other', 'vitroceramic', 'induction', 'electricity'],
    },
    {
        name: 'television' as equipmentNameType,
        id: 3,
        allowed_type: ['electricity'],
    },
    {
        name: 'vacuum' as equipmentNameType,
        id: 4,
        allowed_type: ['electricity'],
    },
    {
        name: 'oven' as equipmentNameType,
        id: 5,
        allowed_type: ['electricity'],
    },
    {
        name: 'microwave' as equipmentNameType,
        id: 6,
        allowed_type: ['electricity'],
    },
    {
        name: 'fridge' as equipmentNameType,
        id: 7,
        allowed_type: ['electricity'],
    },
    {
        name: 'dishwasher' as equipmentNameType,
        id: 8,
        allowed_type: ['electricity'],
    },
    {
        name: 'washingmachine' as equipmentNameType,
        id: 9,
        allowed_type: ['electricity'],
    },
    {
        name: 'dryer' as equipmentNameType,
        id: 10,
        allowed_type: ['electricity'],
    },
    {
        name: 'laptop' as equipmentNameType,
        id: 11,
        allowed_type: ['electricity'],
    },
    {
        name: 'desktopcomputer' as equipmentNameType,
        id: 12,
        allowed_type: ['electricity'],
    },
    {
        name: 'sanitary' as equipmentNameType,
        id: 13,
        allowed_type: ['other', 'collective', 'individual'],
    },
    {
        name: 'solarpanel' as equipmentNameType,
        id: 14,
        allowed_type: ['existant', 'nonexistant', 'possibly'],
    },
]

/**
 * TEST SUCCESS CUSTOM EQUIPMENT.
 */
export const TEST_SUCCESS_CUSTOM_EQUIPMENT = {
    id: 1000,
    name: 'test_custom_equipment',
    allowed_type: ['electricity'],
}

/**
 * TEST ERROR CUSTOM EQUIPMENT.
 */
export const TEST_ERROR_CUSTOM_EQUIPMENT = {
    id: 1000,
    name: 'error_equipment_name',
    allowed_type: ['not_allowed_type'],
}

/**
 * Mock of customers/clients list data.
 */
export var TEST_HOUSING_EQUIPMENTS: SnakeCasedPropertiesDeep<IEquipmentMeter>[] = [
    {
        id: 10,
        equipment_id: 1,
        equipment_number: 1,
        equipment: {
            name: 'heater' as equipmentNameType,
            id: 1,
            allowed_type: ['other', 'collective', 'individual'],
        },
        equipment_brand: 'brand1',
        equipment_model: 'model1',
        year_of_purchase: 2021,
    },
    {
        id: 11,
        equipment_id: 2,
        equipment_number: 0,
        equipment: {
            id: 2,
            name: 'sanitary' as equipmentNameType,
            allowed_type: ['electricity', 'other'],
        },
        equipment_brand: 'brand2',
        equipment_model: 'model2',
        year_of_purchase: 2022,
    },
    {
        equipment_id: 3,
        equipment_number: 0,
        equipment_type: 'vitroceramic',
        equipment: {
            name: 'hotplate' as equipmentNameType,
            id: 2,
            allowed_type: ['other', 'vitroceramic', 'induction', 'electricity'],
        },
        equipment_brand: 'brand3',
        equipment_model: 'model3',
        year_of_purchase: 2023,
    },
    {
        id: 12,
        equipment_id: 3,
        equipment_number: 1,
        equipment: {
            name: 'tv' as equipmentNameType,
            id: 3,
            allowed_type: ['electricity'],
        },
    },
    {
        id: 13,
        equipment_id: 4,
        equipment_number: 3,
        equipment_type: 'electricity',
        equipment: {
            id: 4,
            name: 'desktopcomputer' as equipmentNameType,
            allowed_type: [],
        },
        equipment_brand: 'brand4',
        equipment_model: 'model4',
        year_of_purchase: 2024,
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
        equipment_brand: 'brand5',
        equipment_model: 'model5',
        year_of_purchase: 2025,
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
            allowed_type: ['electricity'],
        },
    },
    {
        id: 14,
        equipment_id: 5,
        equipment_number: 1,
        equipment_type: 'electricity',
        equipment: {
            name: 'oven' as equipmentNameType,
            id: 5,
            allowed_type: ['electricity'],
        },
    },
    {
        id: 15,
        equipment_id: 6,
        equipment_number: 1,
        equipment_type: 'electricity',
        equipment: {
            name: 'microwave' as equipmentNameType,
            id: 6,
            allowed_type: ['electricity'],
        },
    },
    {
        id: 16,
        equipment_id: 7,
        equipment_number: 1,
        equipment_type: 'electricity',
        equipment: {
            name: 'fridge' as equipmentNameType,
            id: 7,
            allowed_type: ['electricity'],
        },
    },
    {
        id: 17,
        equipment_id: 8,
        equipment_number: 1,
        equipment_type: 'electricity',
        equipment: {
            name: 'dishwasher' as equipmentNameType,
            id: 8,
            allowed_type: ['electricity'],
        },
    },
    {
        id: 18,
        equipment_id: 9,
        equipment_number: 1,
        equipment_type: 'electricity',
        equipment: {
            name: 'washingmachine' as equipmentNameType,
            id: 9,
            allowed_type: ['electricity'],
        },
    },
    {
        id: 19,
        equipment_id: 10,
        equipment_number: 1,
        equipment_type: 'electricity',
        equipment: {
            name: 'dryer' as equipmentNameType,
            id: 10,
            allowed_type: ['electricity'],
        },
    },
    {
        id: 20,
        equipment_id: 11,
        equipment_number: 1,
        equipment_type: 'electricity',
        equipment: {
            name: 'laptop' as equipmentNameType,
            id: 11,
            allowed_type: ['electricity'],
        },
    },
    {
        id: 21,
        equipment_id: 12,
        equipment_number: 1,
        equipment_type: 'electricity',
        equipment: {
            name: 'desktopcomputer' as equipmentNameType,
            id: 12,
            allowed_type: ['electricity'],
        },
    },
    {
        id: 22,
        equipment_id: 13,
        equipment_number: 1,
        equipment_type: 'electricity',
        equipment: {
            name: 'sanitary' as equipmentNameType,
            id: 13,
            allowed_type: ['other', 'collective', 'individual'],
        },
    },
    {
        id: 23,
        equipment_id: 14,
        equipment_number: 1,
        equipment_type: 'existant',
        equipment: {
            name: 'solarpanel' as equipmentNameType,
            id: 14,
            allowed_type: ['existant', 'nonexistant', 'possibly'],
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

    // Add custom equipment
    rest.post<SnakeCasedPropertiesDeep<addEquipmentType>>(`${ALL_EQUIPMENTS_API}`, (req, res, ctx) => {
        if (req.body.name === 'error_equipment_name') {
            return res(
                ctx.status(400),
                ctx.delay(1000),
                ctx.json({
                    detail: 'Cette équipement est déjà existant dans la liste des équipements.',
                }),
            )
        }

        return res(ctx.status(201), ctx.delay(1000), ctx.json(TEST_SUCCESS_CUSTOM_EQUIPMENT))
    }),

    // Get the result of the measurement
    rest.get(
        `${HOUSING_API}/equipments/:housingEquipmentId/measurement/:measurementMode/result/:equipmentNumber`,
        (req, res, ctx) => {
            const authorization = req.headers.get('authorization')
            if (authorization) {
                if (authorization === TEST_MEASUREMENT_RESULT_EXIST)
                    return res(
                        ctx.status(200),
                        ctx.delay(1000),
                        ctx.json({
                            value: TEST_RESULT_VALUE,
                        }),
                    )
                if (authorization === TEST_MEASUREMENT_ERROR)
                    return res(
                        ctx.status(400),
                        ctx.delay(1000),
                        ctx.json({
                            detail: 'Error in getting measurement result',
                        }),
                    )
            }
            return res(
                ctx.status(200),
                ctx.delay(1000),
                ctx.json({
                    value: null,
                }),
            )
        },
    ),

    // Get the status of the measurement process
    rest.get(
        `${HOUSING_API}/equipments/:housingEquipmentId/measurement/:measurementMode/status/:equipmentNumber`,
        (req, res, ctx) => {
            const authorization = req.headers.get('authorization')
            if (authorization && authorization === TEST_STATUS_PENDING)
                return res(
                    ctx.status(200),
                    ctx.delay(1000),
                    ctx.json({
                        status: measurementStatusEnum.PENDING,
                    }),
                )
            if (authorization && authorization === TEST_STATUS_IN_PROGRESS)
                return res(
                    ctx.status(200),
                    ctx.delay(1000),
                    ctx.json({
                        status: measurementStatusEnum.IN_PROGRESS,
                    }),
                )
            if (authorization && authorization === TEST_STATUS_SUCCESS)
                return res(
                    ctx.status(200),
                    ctx.delay(1000),
                    ctx.json({
                        status: measurementStatusEnum.SUCCESS,
                    }),
                )
            if (authorization && authorization === TEST_STATUS_FAILED)
                return res(
                    ctx.status(200),
                    ctx.delay(1000),
                    ctx.json({
                        status: measurementStatusEnum.FAILED,
                    }),
                )
            return res(
                ctx.status(404),
                ctx.delay(1000),
                ctx.json({
                    detail: "L'équipement du logement n'existe pas !",
                }),
            )
        },
    ),

    // Start the measurement process for an equipment
    rest.post(`${HOUSING_API}/equipments/:housingEquipmentId/measurement/:measurementMode`, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        if (authorization && authorization !== TEST_STATUS_PENDING && authorization !== TEST_STATUS_IN_PROGRESS)
            return res(ctx.status(200), ctx.delay(1000))
        return res(
            ctx.status(400),
            ctx.delay(1000),
            ctx.json({
                detail: "Une mesure est en cours, veuillez patienter jusqu'à ce qu'elle soit terminée !",
            }),
        )
    }),
]
