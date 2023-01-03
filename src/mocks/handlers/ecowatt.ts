import { rest } from 'msw'
import { IEcowattAlerts, IEcowattSignalsData } from 'src/modules/Ecowatt/ecowatt.d'
import { ECOWATT_SIGNALS_ENDPOINT } from 'src/modules/Ecowatt/EcowattHook'
import { SnakeCasedPropertiesDeep } from 'type-fest'

/**
 * Test error case of Ecowatt.
 */
export const TEST_ECOWATT_EROOR = 'error'

const MOCK_ECOWATT_ALERTS_ENDPOINT = '/housings/:housing_id/ecowatt-alerts'

/**
 * Ecowatt signal test data.
 */
export const TEST_ECOWATT_SIGNAL_DATA: SnakeCasedPropertiesDeep<IEcowattSignalsData> = [
    {
        reading_at: '2022-11-30T01:00:48+0000',
        reading: 1,
        hourly_values: [
            {
                reading_at: 0,
                reading: 1,
            },

            {
                reading_at: 1,

                reading: 1,
            },

            {
                reading_at: 2,

                reading: 1,
            },

            {
                reading_at: 3,

                reading: 1,
            },

            {
                reading_at: 4,

                reading: 1,
            },

            {
                reading_at: 5,

                reading: 1,
            },

            {
                reading_at: 6,

                reading: 2,
            },

            {
                reading_at: 7,

                reading: 1,
            },

            {
                reading_at: 8,

                reading: 2,
            },

            {
                reading_at: 9,

                reading: 2,
            },

            {
                reading_at: 10,

                reading: 1,
            },

            {
                reading_at: 11,

                reading: 1,
            },

            {
                reading_at: 12,

                reading: 1,
            },

            {
                reading_at: 13,

                reading: 1,
            },

            {
                reading_at: 14,

                reading: 2,
            },

            {
                reading_at: 15,

                reading: 2,
            },

            {
                reading_at: 16,

                reading: 1,
            },

            {
                reading_at: 17,

                reading: 1,
            },

            {
                reading_at: 18,

                reading: 2,
            },
            {
                reading_at: 19,

                reading: 2,
            },

            {
                reading_at: 20,

                reading: 2,
            },

            {
                reading_at: 21,

                reading: 2,
            },

            {
                reading_at: 22,

                reading: 3,
            },

            {
                reading_at: 23,

                reading: 3,
            },
        ],
    },
    {
        reading_at: '2022-12-01T01:00:48+0000',
        reading: 2,
        hourly_values: [
            {
                reading_at: 0,
                reading: 1,
            },

            {
                reading_at: 1,

                reading: 1,
            },

            {
                reading_at: 2,

                reading: 1,
            },

            {
                reading_at: 3,

                reading: 1,
            },

            {
                reading_at: 4,

                reading: 1,
            },

            {
                reading_at: 5,

                reading: 1,
            },

            {
                reading_at: 6,

                reading: 1,
            },

            {
                reading_at: 7,

                reading: 2,
            },

            {
                reading_at: 8,

                reading: 2,
            },

            {
                reading_at: 9,

                reading: 1,
            },

            {
                reading_at: 10,

                reading: 1,
            },

            {
                reading_at: 11,

                reading: 1,
            },

            {
                reading_at: 12,

                reading: 2,
            },

            {
                reading_at: 13,

                reading: 2,
            },

            {
                reading_at: 14,

                reading: 1,
            },

            {
                reading_at: 15,

                reading: 1,
            },

            {
                reading_at: 16,

                reading: 1,
            },

            {
                reading_at: 17,

                reading: 1,
            },

            {
                reading_at: 18,

                reading: 3,
            },

            {
                reading_at: 19,

                reading: 3,
            },

            {
                reading_at: 20,

                reading: 2,
            },

            {
                reading_at: 21,

                reading: 2,
            },

            {
                reading_at: 22,

                reading: 1,
            },

            {
                reading_at: 23,

                reading: 2,
            },
        ],
    },
    {
        reading_at: '2022-12-02T01:00:48+0000',
        reading: 1,
        hourly_values: [
            {
                reading_at: 0,
                reading: 1,
            },

            {
                reading_at: 1,

                reading: 1,
            },

            {
                reading_at: 2,

                reading: 1,
            },

            {
                reading_at: 3,

                reading: 1,
            },

            {
                reading_at: 4,

                reading: 1,
            },

            {
                reading_at: 5,

                reading: 1,
            },

            {
                reading_at: 6,

                reading: 1,
            },

            {
                reading_at: 7,

                reading: 2,
            },

            {
                reading_at: 8,

                reading: 2,
            },

            {
                reading_at: 9,

                reading: 1,
            },

            {
                reading_at: 10,

                reading: 1,
            },

            {
                reading_at: 11,

                reading: 1,
            },

            {
                reading_at: 12,

                reading: 2,
            },

            {
                reading_at: 13,

                reading: 2,
            },

            {
                reading_at: 14,

                reading: 1,
            },

            {
                reading_at: 15,

                reading: 1,
            },

            {
                reading_at: 16,

                reading: 1,
            },

            {
                reading_at: 17,

                reading: 1,
            },

            {
                reading_at: 18,

                reading: 3,
            },

            {
                reading_at: 19,

                reading: 3,
            },

            {
                reading_at: 20,

                reading: 2,
            },

            {
                reading_at: 21,

                reading: 2,
            },

            {
                reading_at: 22,

                reading: 1,
            },

            {
                reading_at: 23,

                reading: 2,
            },
        ],
    },
    {
        reading_at: '2022-12-03T01:00:48+0000',
        reading: 3,
        hourly_values: [
            {
                reading_at: 0,
                reading: 1,
            },

            {
                reading_at: 1,

                reading: 1,
            },

            {
                reading_at: 2,

                reading: 1,
            },

            {
                reading_at: 3,

                reading: 3,
            },

            {
                reading_at: 4,

                reading: 3,
            },

            {
                reading_at: 5,

                reading: 3,
            },

            {
                reading_at: 6,

                reading: 3,
            },

            {
                reading_at: 7,

                reading: 2,
            },

            {
                reading_at: 8,

                reading: 2,
            },

            {
                reading_at: 9,

                reading: 3,
            },

            {
                reading_at: 10,

                reading: 2,
            },

            {
                reading_at: 11,

                reading: 2,
            },

            {
                reading_at: 12,

                reading: 2,
            },

            {
                reading_at: 13,

                reading: 2,
            },

            {
                reading_at: 14,

                reading: 3,
            },

            {
                reading_at: 15,

                reading: 3,
            },

            {
                reading_at: 16,

                reading: 1,
            },

            {
                reading_at: 17,

                reading: 1,
            },

            {
                reading_at: 18,

                reading: 3,
            },

            {
                reading_at: 19,

                reading: 3,
            },

            {
                reading_at: 20,

                reading: 2,
            },

            {
                reading_at: 21,

                reading: 2,
            },

            {
                reading_at: 22,

                reading: 1,
            },

            {
                reading_at: 23,

                reading: 2,
            },
        ],
    },
]

/**
 * Ecowatt alerts test data.
 */
export const TEST_ECOWATT_ALERTS_DATA: SnakeCasedPropertiesDeep<IEcowattAlerts> = {
    is_email_signal_one_day: true,
    is_email_signal_three_days: true,
    is_push_signal_one_day: true,
    is_push_signal_three_days: true,
}

/**
 * Ecowatt endpoints.
 */
export const ecowattEndpoints = [
    rest.get<IEcowattSignalsData>(ECOWATT_SIGNALS_ENDPOINT, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        if (authorization === TEST_ECOWATT_EROOR) {
            return res(ctx.status(400), ctx.delay(1000))
        } else {
            return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_ECOWATT_SIGNAL_DATA))
        }
    }),
    rest.get<IEcowattAlerts>(MOCK_ECOWATT_ALERTS_ENDPOINT, (req, res, ctx) => {
        const houseId = req.params.housing_id
        if (!houseId) return res(ctx.status(400), ctx.delay(1000))
        return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_ECOWATT_ALERTS_DATA))
    }),
    // eslint-disable-next-line sonarjs/no-identical-functions
    rest.post<IEcowattAlerts>(MOCK_ECOWATT_ALERTS_ENDPOINT, (req, res, ctx) => {
        const houseId = req.params.housing_id
        if (!houseId) return res(ctx.status(400), ctx.delay(1000))
        return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_ECOWATT_ALERTS_DATA))
    }),
]
