import { rest } from 'msw'
import { SnakeCasedPropertiesDeep } from 'type-fest'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import {
    ConsumptionAlertData,
    IConsumptionAlert,
    IPricePerKwhDataType,
} from 'src/modules/Layout/Toolbar/components/Alerts/ConsumptionAlert/consumptionAlert'

/**
 * Consumption Alerts Endpoint.
 */
const MOCK_CONSUMPTION_ALERTS_ENDPOINT = `${HOUSING_API}/:houseId/consumption-alerts`

/**
 * Mock Internal server error message.
 */
export const MOCK_INTERNAL_ERROR_MESSAGE = 'internal server error'

/**
 * Price per kwh.
 */
export const MOCK_PRICE_PER_KWH = 0.174

/**
 * MOCK Success Add Contract Object.
 */
export const TEST_CONSUMPTION_ALERTS: SnakeCasedPropertiesDeep<IConsumptionAlert>[] = [
    {
        interval: 'day',
        consumption: 5,
        price: 0.175,
    },
    {
        interval: 'week',
        consumption: null,
        price: null,
    },
]

/**
 * Consumption Alerts endpoints.
 */
export const consumptionAlertsEndpoints = [
    // Get All Consumption Alerts
    rest.get<IConsumptionAlert[]>(MOCK_CONSUMPTION_ALERTS_ENDPOINT, (req, res, ctx) => {
        const { houseId } = req.params

        // to test catch function with default message error
        if (parseInt(houseId) === -1) {
            return res(ctx.status(500), ctx.delay(1000))
        }

        // to test catch function with error message from back
        if (parseInt(houseId) === -2) {
            return res(ctx.status(500), ctx.delay(1000), ctx.json({ detail: MOCK_INTERNAL_ERROR_MESSAGE }))
        }

        return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_CONSUMPTION_ALERTS))
    }),

    // Get Price per kwh
    rest.get<IPricePerKwhDataType>(`${MOCK_CONSUMPTION_ALERTS_ENDPOINT}/price-per-kwh`, (req, res, ctx) => {
        const { houseId } = req.params

        // to test catch function with default message error
        if (parseInt(houseId) === -1) {
            return res(ctx.status(500), ctx.delay(1000))
        }

        // to test catch function with error message from back
        if (parseInt(houseId) === -2) {
            return res(ctx.status(500), ctx.delay(1000), ctx.json({ detail: MOCK_INTERNAL_ERROR_MESSAGE }))
        }

        return res(ctx.status(200), ctx.json({ price_per_kwh: MOCK_PRICE_PER_KWH }))
    }),

    // Save consumption alerts ( act like a post and update at the same time )
    rest.post<SnakeCasedPropertiesDeep<ConsumptionAlertData>>(
        `${MOCK_CONSUMPTION_ALERTS_ENDPOINT}/:interval`,
        (req, res, ctx) => {
            const { interval, houseId } = req.params
            const { price, consumption } = req.body
            let isUpdate = false

            // to test catch function with default message error
            if (parseInt(houseId) === -1) {
                return res(ctx.status(500), ctx.delay(1000))
            }

            // to test catch function with error message from back
            if (parseInt(houseId) === -2) {
                return res(ctx.status(500), ctx.delay(1000), ctx.json({ detail: MOCK_INTERNAL_ERROR_MESSAGE }))
            }

            // can't save both of them
            if (price && consumption) {
                return res(
                    ctx.status(400),
                    ctx.delay(1000),
                    ctx.json({
                        errorMessage: 'veuillez renseigner soit le prix ou la consommation !',
                    }),
                )
            }

            // search, if found update
            TEST_CONSUMPTION_ALERTS.map((alert) => {
                if (alert.interval === interval) {
                    alert.price = price
                    alert.consumption = consumption
                    // set that we updated the element.
                    isUpdate = true
                }
                return {}
            })

            if (isUpdate) {
                return res(ctx.status(400), ctx.delay(1000))
            }

            // if not found, then it's a create
            TEST_CONSUMPTION_ALERTS.push({
                interval,
                price,
                consumption,
            })

            return res(ctx.status(200))
        },
    ),
]
