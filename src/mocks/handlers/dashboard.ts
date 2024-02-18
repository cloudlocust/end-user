import { rest } from 'msw'
import { API_RESOURCES_URL } from 'src/configs'
import { IPricePerKwhDataType } from 'src/modules/Alerts/components/ConsumptionAlert/consumptionAlert'
import { INrlinkMetrics } from 'src/modules/Dashboard/StatusWrapper/nrlinkPower'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { SnakeCasedPropertiesDeep } from 'type-fest'

// export const SUCCESS_NRLINK_POWER_DATA =

// eslint-disable-next-line jsdoc/require-jsdoc
export const nrlinkPowerData: SnakeCasedPropertiesDeep<INrlinkMetrics> = {
    last_power: {
        value: 55,
        timestamp: '2023-12-15T14:07:38.138000',
    },
    last_temperature: {
        value: 12,
        timestamp: '2023-12-15T14:07:38.138000',
    },
}

/**
 * Price per kwh.
 */
export const MOCK_PRICE_PER_KWH = 0.174

/**
 * Mock Internal server error message.
 */
export const MOCK_INTERNAL_ERROR_MESSAGE = 'internal server error'

/**
 * Mock of nrlink power data.
 */
export const DashboardEndpoints = [
    rest.get(`${API_RESOURCES_URL}/nrlink-last-metrics/:housingId`, (req, res, ctx) => {
        const { housingId } = req.params
        if (housingId === -1) {
            return res(ctx.delay(1000), ctx.status(400))
        } else {
            return res(ctx.delay(1000), ctx.status(200), ctx.json(nrlinkPowerData))
        }
    }),
    rest.get<IPricePerKwhDataType>(`${HOUSING_API}/:housingId/instant-price-per-kwh`, (req, res, ctx) => {
        const { housingId } = req.params

        // to test catch function with default message error
        if (parseInt(housingId) === -1) {
            return res(ctx.status(500), ctx.delay(1000))
        }

        // to test catch function with error message from back
        if (parseInt(housingId) === -2) {
            return res(ctx.status(500), ctx.delay(1000), ctx.json({ detail: MOCK_INTERNAL_ERROR_MESSAGE }))
        }

        return res(ctx.status(200), ctx.json({ price_per_kwh: MOCK_PRICE_PER_KWH }))
    }),
]
