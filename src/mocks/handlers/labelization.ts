import { rest } from 'msw'
import {
    addActivityRequestBodyType,
    ConsumptionLabelDataType,
} from 'src/modules/MyConsumption/components/LabelizationContainer/labelizaitonTypes.types'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { SnakeCasedPropertiesDeep } from 'type-fest'

/**
 * Mocked data for activities.
 */
export var TEST_ACTIVITIES: SnakeCasedPropertiesDeep<ConsumptionLabelDataType[]> = [
    {
        id: 1,
        start_date: `2024-01-19T08:00:00.000Z`,
        end_date: `2024-01-19T09:00:00.000Z`,
        consumption: 400,
        consumption_price: 17,
        use_type: "exemple du type d'usage d'un Micro-onde",
        housing_equipment: {
            equipment_id: 6,
            equipment_type: 'electricity',
            equipment_number: 1,
            id: 93,
            equipment: {
                id: 6,
                name: 'microwave',
                allowed_type: ['electricity'],
                customer_id: null,
                measurement_duration: '2m',
                measurement_modes: ['Standard', 'Grill'],
            },
        },
    },
    {
        id: 2,
        start_date: `2024-02-01T08:00:00.000Z`,
        end_date: `2024-02-01T14:00:00.000Z`,
        consumption: 1200,
        consumption_price: 50,
        use_type: null,
        housing_equipment: {
            equipment_id: 7,
            equipment_type: 'electricity',
            equipment_number: 1,
            id: 177,
            equipment: {
                id: 7,
                name: 'fridge',
                allowed_type: ['electricity'],
                customer_id: null,
                measurement_duration: null,
                measurement_modes: null,
            },
        },
    },
    {
        id: 3,
        start_date: `2024-02-04T15:00:00.000Z`,
        end_date: `2024-02-04T15:30:00.000Z`,
        consumption: 230,
        consumption_price: 10,
        use_type: null,
        housing_equipment: {
            equipment_id: 6,
            equipment_type: 'electricity',
            equipment_number: 1,
            id: 93,
            equipment: {
                id: 6,
                name: 'microwave',
                allowed_type: ['electricity'],
                customer_id: null,
                measurement_duration: '2m',
                measurement_modes: ['Standard', 'Grill'],
            },
        },
    },
]

/**
 * Backend error message for get activities.
 */
export const TEST_GET_ACTIVITIES_BACKEND_ERROR_MESSAGE = 'Erreur backend lors du chargement de vos labels'
/**
 * Backend error message for add activity.
 */
export const TEST_ADD_ACTIVITY_BACKEND_ERROR_MESSAGE = "Erreur backend lors de l'enregistrement du label"
/**
 * Backend error message for delete activity.
 */
export const TEST_DELETE_ACTIVITY_BACKEND_ERROR_MESSAGE = 'Erreur backend lors de la suppression du label'
/**
 * Failed request authorization.
 */
export const FAILED_REQ_AUTHORIZATION = 'Failed'
/**
 * Failed with error message request authorization.
 */
export const FAILED_WITH_MSG_REQ_AUTHORIZATION = 'Failed with message error'

/**
 * Activities api requests.
 */
export const activitiesEndpoints = [
    // Get all the activities.
    rest.get(`${HOUSING_API}/:id/activities`, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        if (authorization && authorization === FAILED_REQ_AUTHORIZATION) {
            return res(ctx.status(404), ctx.delay(1000))
        }
        if (authorization && authorization === FAILED_WITH_MSG_REQ_AUTHORIZATION) {
            return res(
                ctx.status(404),
                ctx.delay(1000),
                ctx.json({
                    detail: TEST_GET_ACTIVITIES_BACKEND_ERROR_MESSAGE,
                }),
            )
        }
        const activityDate = req.url.searchParams.get('activity_date')
        if (activityDate) {
            return res(ctx.status(200), ctx.delay(1000), ctx.json([TEST_ACTIVITIES[0]]))
        }
        return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_ACTIVITIES))
    }),

    // Create an activity.
    rest.post<addActivityRequestBodyType>(`${HOUSING_API}/:id/activities`, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        if (authorization && authorization === FAILED_REQ_AUTHORIZATION) {
            return res(ctx.status(404), ctx.delay(1000))
        }
        if (authorization && authorization === FAILED_WITH_MSG_REQ_AUTHORIZATION) {
            return res(
                ctx.status(404),
                ctx.delay(1000),
                ctx.json({
                    detail: TEST_ADD_ACTIVITY_BACKEND_ERROR_MESSAGE,
                }),
            )
        }
        return res(ctx.status(201), ctx.delay(1000), ctx.json(TEST_ACTIVITIES[0]))
    }),

    // Delete an activity.
    rest.delete(`${HOUSING_API}/:id/activities/:activityId`, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        if (authorization && authorization === FAILED_REQ_AUTHORIZATION) {
            return res(ctx.status(404), ctx.delay(1000))
        }
        if (authorization && authorization === FAILED_WITH_MSG_REQ_AUTHORIZATION) {
            return res(
                ctx.status(404),
                ctx.delay(1000),
                ctx.json({
                    detail: TEST_DELETE_ACTIVITY_BACKEND_ERROR_MESSAGE,
                }),
            )
        }
        return res(ctx.status(200), ctx.delay(1000))
    }),
]
