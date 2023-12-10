import { rest } from 'msw'
import { API_RESOURCES_URL } from 'src/configs'
import { INrlinkMetrics } from 'src/modules/Dashboard/StatusWrapper/nrlinkPower'
import { SnakeCasedPropertiesDeep } from 'type-fest'

// export const SUCCESS_NRLINK_POWER_DATA =

// eslint-disable-next-line jsdoc/require-jsdoc
export const nrlinkPowerData: SnakeCasedPropertiesDeep<INrlinkMetrics> = {
    last_power: {
        value: -55,
        timestamp: '2023-12-15T14:07:38.138000',
    },
    last_temperature: {
        value: 12,
        timestamp: '2023-12-15T14:07:38.138000',
    },
}

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
]
