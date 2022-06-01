/**
 * Metric Targets.
 */
export type MetricTargets =
    | 'nrlink_consumption_metrics'
    | 'enedis_consumption_metrics'
    | 'enphase_consumption_metrics'
    | 'enphase_production_metrics'
    | 'external_temperature_metrics'
    | 'nrlink_internal_temperature_metrics'

/**
 * Metric model.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type IMetrics = {
    /**
     * Metric target.
     */
    target: MetricTargets
    /**
     * Metric Datapoints.
     */
    datapoints: Array<Array<number>>
    /**
     * Nrlink consent.
     */
    nrlink_consent: boolean
    /**
     * Enedis consent.
     */
    enedis_consent: boolean
}[]

/**
 * Information to be passed to body when getting metrics.
 */
//eslint-disable-next-line jsdoc/require-jsdoc
export type getMetricsTypes = {
    /**
     * Range of time.
     */
    //eslint-disable-next-line jsdoc/require-jsdoc
    range: {
        /**
         *
         */
        from: string
        /**
         *
         */
        to: string
    }
    /**
     * Interval of time.
     */
    interval: '1min' | '1d' | '1m'
    /**
     * Metrics targets.
     */
    targets: [
        /**
         *
         */
        {
            /**
             * Single metric target.
             */
            target: MetricTargets
            /**
             * Metric type.
             */
            type: 'timeseries'
        },
    ]
}
