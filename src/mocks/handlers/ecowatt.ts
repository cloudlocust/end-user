import { rest } from 'msw'
import { IEcowattData } from 'src/modules/Ecowatt/ecowatt'
import { ECOWATT_ENDPOINT } from 'src/modules/Ecowatt/EcowattHook'
import { SnakeCasedPropertiesDeep } from 'type-fest'

/**
 * Test error case of Ecowatt.
 */
export const TEST_ECOWATT_EROOR = 'error'

/**
 * Ecowatt test data.
 */
export const TEST_ECOWATT_DATA: SnakeCasedPropertiesDeep<IEcowattData> = [
    {
        reading_at: '2022-11-30T14:38:22.000Z',
        reading: 1,
        hourly_values: [
            {
                pas: 0,
                value: 1,
            },

            {
                pas: 1,

                value: 1,
            },

            {
                pas: 2,

                value: 1,
            },

            {
                pas: 3,

                value: 1,
            },

            {
                pas: 4,

                value: 1,
            },

            {
                pas: 5,

                value: 1,
            },

            {
                pas: 6,

                value: 2,
            },

            {
                pas: 7,

                value: 1,
            },

            {
                pas: 8,

                value: 2,
            },

            {
                pas: 9,

                value: 2,
            },

            {
                pas: 10,

                value: 1,
            },

            {
                pas: 11,

                value: 1,
            },

            {
                pas: 12,

                value: 1,
            },

            {
                pas: 13,

                value: 1,
            },

            {
                pas: 14,

                value: 2,
            },

            {
                pas: 15,

                value: 2,
            },

            {
                pas: 16,

                value: 1,
            },

            {
                pas: 17,

                value: 1,
            },

            {
                pas: 18,

                value: 2,
            },
            {
                pas: 19,

                value: 2,
            },

            {
                pas: 20,

                value: 2,
            },

            {
                pas: 21,

                value: 2,
            },

            {
                pas: 22,

                value: 3,
            },

            {
                pas: 23,

                value: 3,
            },
        ],
    },
    {
        reading_at: '2022-12-01T14:38:22.000Z',
        reading: 2,
        hourly_values: [
            {
                pas: 0,
                value: 1,
            },

            {
                pas: 1,

                value: 1,
            },

            {
                pas: 2,

                value: 1,
            },

            {
                pas: 3,

                value: 1,
            },

            {
                pas: 4,

                value: 1,
            },

            {
                pas: 5,

                value: 1,
            },

            {
                pas: 6,

                value: 1,
            },

            {
                pas: 7,

                value: 2,
            },

            {
                pas: 8,

                value: 2,
            },

            {
                pas: 9,

                value: 1,
            },

            {
                pas: 10,

                value: 1,
            },

            {
                pas: 11,

                value: 1,
            },

            {
                pas: 12,

                value: 2,
            },

            {
                pas: 13,

                value: 2,
            },

            {
                pas: 14,

                value: 1,
            },

            {
                pas: 15,

                value: 1,
            },

            {
                pas: 16,

                value: 1,
            },

            {
                pas: 17,

                value: 1,
            },

            {
                pas: 18,

                value: 3,
            },

            {
                pas: 19,

                value: 3,
            },

            {
                pas: 20,

                value: 2,
            },

            {
                pas: 21,

                value: 2,
            },

            {
                pas: 22,

                value: 1,
            },

            {
                pas: 23,

                value: 2,
            },
        ],
    },
    {
        reading_at: '2022-12-02T14:38:22.000Z',
        reading: 1,
        hourly_values: [
            {
                pas: 0,
                value: 1,
            },

            {
                pas: 1,

                value: 1,
            },

            {
                pas: 2,

                value: 1,
            },

            {
                pas: 3,

                value: 1,
            },

            {
                pas: 4,

                value: 1,
            },

            {
                pas: 5,

                value: 1,
            },

            {
                pas: 6,

                value: 1,
            },

            {
                pas: 7,

                value: 2,
            },

            {
                pas: 8,

                value: 2,
            },

            {
                pas: 9,

                value: 1,
            },

            {
                pas: 10,

                value: 1,
            },

            {
                pas: 11,

                value: 1,
            },

            {
                pas: 12,

                value: 2,
            },

            {
                pas: 13,

                value: 2,
            },

            {
                pas: 14,

                value: 1,
            },

            {
                pas: 15,

                value: 1,
            },

            {
                pas: 16,

                value: 1,
            },

            {
                pas: 17,

                value: 1,
            },

            {
                pas: 18,

                value: 3,
            },

            {
                pas: 19,

                value: 3,
            },

            {
                pas: 20,

                value: 2,
            },

            {
                pas: 21,

                value: 2,
            },

            {
                pas: 22,

                value: 1,
            },

            {
                pas: 23,

                value: 2,
            },
        ],
    },
    {
        reading_at: '2022-12-03T14:38:22.000Z',
        reading: 3,
        hourly_values: [
            {
                pas: 0,
                value: 1,
            },

            {
                pas: 1,

                value: 1,
            },

            {
                pas: 2,

                value: 1,
            },

            {
                pas: 3,

                value: 3,
            },

            {
                pas: 4,

                value: 3,
            },

            {
                pas: 5,

                value: 3,
            },

            {
                pas: 6,

                value: 3,
            },

            {
                pas: 7,

                value: 2,
            },

            {
                pas: 8,

                value: 2,
            },

            {
                pas: 9,

                value: 3,
            },

            {
                pas: 10,

                value: 2,
            },

            {
                pas: 11,

                value: 2,
            },

            {
                pas: 12,

                value: 2,
            },

            {
                pas: 13,

                value: 2,
            },

            {
                pas: 14,

                value: 3,
            },

            {
                pas: 15,

                value: 3,
            },

            {
                pas: 16,

                value: 1,
            },

            {
                pas: 17,

                value: 1,
            },

            {
                pas: 18,

                value: 3,
            },

            {
                pas: 19,

                value: 3,
            },

            {
                pas: 20,

                value: 2,
            },

            {
                pas: 21,

                value: 2,
            },

            {
                pas: 22,

                value: 1,
            },

            {
                pas: 23,

                value: 2,
            },
        ],
    },
]

/**
 * Ecowatt endpoints.
 */
export const ecowattEndpoints = [
    rest.get<SnakeCasedPropertiesDeep<IEcowattData>>(ECOWATT_ENDPOINT, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        if (authorization === TEST_ECOWATT_EROOR) {
            return res(ctx.status(400), ctx.delay(1000))
        } else {
            return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_ECOWATT_DATA))
        }
    }),
]
