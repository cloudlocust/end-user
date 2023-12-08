import { rest } from 'msw'
import { INrlinkMetrics } from 'src/modules/Dashboard/StatusWrapper/nrlinkPower'
import { SnakeCasedPropertiesDeep } from 'type-fest'

const MOCK_NRLINK_POWER_ENDPOINT = 'nrlink_power_data/:housingId'

const nrlinkPowerData: SnakeCasedPropertiesDeep<INrlinkMetrics> = {
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
 * Mock of nrlink power data.
 */
export const DashboardHandlers = [
    rest.get(MOCK_NRLINK_POWER_ENDPOINT, (_req, res, ctx) => {
        return res(ctx.delay(1000), ctx.status(200), ctx.json(nrlinkPowerData))
    }),
]
