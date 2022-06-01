import { rest } from 'msw'
import { getMetricsTypes, IMetrics } from 'src/modules/Metriics/Metrics'
import { METRICS_API, MetricTargets } from 'src/modules/Metriics/metricsHook'
import { SnakeCasedPropertiesDeep } from 'type-fest'

/**
 * Metrics mock.
 */
export var TEST_METRICS: SnakeCasedPropertiesDeep<IMetrics> = [
    {
        target: MetricTargets.NRLINK_CONSUMPTION_METRICS,
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
    {
        target: MetricTargets.ENEDIS_CONSUMPTION_METRICS,
        datapoints: [
            [22, 1609459261],
            [13, 1609545661],
            [35, 1609632061],
            [33, 1609718461],
            [27, 1609804861],
            [56, 1609891261],
            [67, 1609977661],
            [32, 1610064061],
            [52, 1610150461],
            [28, 1610236861],
        ],
        nrlink_consent: true,
        enedis_consent: true,
    },
]

// eslint-disable-next-line jsdoc/require-jsdoc
export const metricsEndpoints = [
    // Get meters metrics
    rest.post<SnakeCasedPropertiesDeep<getMetricsTypes>>(METRICS_API, (req, res, ctx) => {
        const { interval, range, targets } = req.body

        if (interval && range && targets) {
            return res(ctx.status(200), ctx.delay(2000), ctx.json(TEST_METRICS))
        }
    }),
]
