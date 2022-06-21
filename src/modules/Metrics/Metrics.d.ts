/**
 * Metric Targets.
 */
export type metricTargetType =
    | 'nrlink_consumption_metrics'
    | 'enedis_consumption_metrics'
    | 'enphase_consumption_metrics'
    | 'enphase_production_metrics'
    | 'external_temperature_metrics'
    | 'nrlink_internal_temperature_metrics'

/**
 * Metrics intervals.
 */
export type metricIntervalType = '1min' | '1d' | '1m'

/**
 * Metric range.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type metricRangeType = {
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
 * Metrics filter.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type metricTargetsType = {
    /**
     * Single metric target.
     */
    target: metricTarget
    /**
     * Metric type.
     */
    type: 'timeseries'
}[]

/**
 * Metric Filters.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type metricFiltersType = {
    /**
     * Key. Default is: "meter_guid".
     */
    key: 'meter_guid'
    /**
     * Operator.
     */
    operator: '='
    /**
     * Value of the meter_guid.
     */
    value: string
}[]

/**
 * Metric model.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type IMetrics = {
    /**
     * Metric target.
     */
    target: metricTarget
    /**
     * Metric Datapoints.
     */
    datapoints: number[][]
}[]

/**
 * Information to be passed to body when getting metrics.
 */
//eslint-disable-next-line jsdoc/require-jsdoc
export type getMetricType = {
    /**
     * Range of time.
     */
    //eslint-disable-next-line jsdoc/require-jsdoc
    range: metricRange
    /**
     * Metric interval of time.
     */
    interval: metricIntervals
    /**
     * Metrics targets.
     */
    targets: metricTargets
    /**
     * Metric filters.
     */
    filters?: metricFilters
}

/**
 * Range value type.
 *
 */
type periodValueType = 1 | 7 | 30 | 365
