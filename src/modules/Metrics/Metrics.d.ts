/**
 * Metric Targets.
 */
export type metricTargetType =
    | 'consumption_metrics'
    | 'external_temperature_metrics'
    | 'nrlink_internal_temperature_metrics'

/**
 * Enum representing the metricTarget without exposing the backend naming.
 */
export enum metricTargetsEnum {
    /**
     * Enum value for consumption_metrics.
     */
    consumption = 'consumption_metrics',
    /**
     * Enum value for nrlink_internal_temperature_metrics.
     */
    internalTemperatur = 'nrlink_internal_temperature_metrics',
    /**
     * Enum value for external_temperature_metrics.
     */
    externalTemperatur = 'external_temperature_metrics',
}
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
    target: metricTargetType
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
export type IMetric = {
    /**
     * Metric target.
     */
    target: metricTargetType
    /**
     * Metric Datapoints.
     */
    datapoints: number[][]
}

/**
 * Information to be passed to body when getting metrics.
 */
//eslint-disable-next-line jsdoc/require-jsdoc
export type getMetricType = {
    /**
     * Range of time.
     */
    //eslint-disable-next-line jsdoc/require-jsdoc
    range: metricRangeType
    /**
     * Metric interval of time.
     */
    interval: metricIntervals
    /**
     * Metrics targets.
     */
    targets: metricTargetsType
    /**
     * Metric filters.
     */
    filters?: metricFiltersType
}
