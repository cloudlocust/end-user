import { rest } from 'msw'
import { getMetricType, IMetrics } from 'src/modules/Metriics/Metrics'
import { METRICS_API } from 'src/modules/Metriics/metricsHook'
import { SnakeCasedPropertiesDeep } from 'type-fest'

/**
 * Metrics mock.
 */
export var TEST_METRICS: SnakeCasedPropertiesDeep<IMetrics> = [
    {
        target: 'nrlink_consumption_metrics',
        datapoints: [
            [33, 1609459261],
            [34, 1609545661],
            [41, 1609632061],
            [38, 1609718461],
            [45, 1609804861],
            [62, 1609891261],
            [42, 1609977661],
            [54, 1610064061],
            [62, 1610150461],
            [48, 1610236861],
        ],
        nrlink_consent: true,
        enedis_consent: true,
    },
]

// eslint-disable-next-line jsdoc/require-jsdoc
export const metricsEndpoints = [
    // Get meters metrics
    rest.post<getMetricType>(METRICS_API, (req, res, ctx) => {
        const body = req.body
        if (body) {
            return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_METRICS))
        }
    }),
]
