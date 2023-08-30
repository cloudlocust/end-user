/**
 * Metric Targets.
 */
export type metricTargetType =
    | 'consumption_metrics'
    | '__euros__consumption_metrics'
    | 'external_temperature_metrics'
    | 'nrlink_internal_temperature_metrics'
    | 'enedis_max_power'
    | 'auto_consumption_metrics'
    | 'enphase_production_metrics'
    | 'production_metrics'
    | 'idle_consumption'
    | 'subscription_prices'
    | 'base_consumption_metrics'
    | 'hp_consumption_metrics'
    | 'hc_consumption_metrics'

/**
 * Enum representing the metricTarget without exposing the backend naming.
 */
export enum metricTargetsEnum {
    /**
     * Enum value for consumption_metrics.
     */
    consumption = 'consumption_metrics',
    /**
     * Enum value for eurosConsumption.
     */
    eurosConsumption = '__euros__consumption_metrics',
    /**
     * Enum value for nrlink_internal_temperature_metrics.
     */
    internalTemperature = 'nrlink_internal_temperature_metrics',
    /**
     * Enum value for external_temperature_metrics.
     */
    externalTemperature = 'external_temperature_metrics',
    /**
     * Enum value for enedis_max_power.
     */
    pMax = 'enedis_max_power',
    /**
     * Enum value for target of Autoconsommation.
     */
    autoconsumption = 'auto_consumption_metrics',
    /**
     * Enum value for enphase_production_metrics.
     */
    totalProduction = 'enphase_production_metrics',
    /**
     * Enum value for production_metrics.
     */
    injectedProduction = 'production_metrics',
    /**
     * Eneum value for consommation de veille.
     */
    idleConsumption = 'idle_consumption',
    /**
     * Enum value for abonnement.
     */
    subscriptionPrices = 'subscription_prices',
    /**
     * Enum value for heure pleine.
     */
    peakHourConsumption = 'hp_consumption_metrics',
    /**
     * Enum for heure creuse.
     */
    offPeakHourConsumption = 'hc_consumption_metrics',
    /**
     * Base conssumption metrics (according to Tariff de base).
     */
    baseConsumption = 'base_consumption_metrics',
}
/**
 * Metrics intervals.
 */
export type metricIntervalType = '1m' | '1d' | '1M' | '30m'

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
    type: 'timeserie'
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
    interval: metricIntervalType
    /**
     * Metrics targets.
     */
    targets: metricTargetsType
    /**
     * Metric filters.
     */
    filters?: metricFiltersType
}

/**
 * Params of getMetricsWithParamsType hook function.
 */
//eslint-disable-next-line jsdoc/require-jsdoc
export type getMetricsWithParamsType = {
    /**
     * Range.
     */
    range: metricRangeType
    /**
     * Metric interval.
     */
    interval: metricIntervalType
    /**
     * Metrics targets.
     */
    targets: metricTargetType[]
    /**
     * Metric filters.
     */
    filters: metricFiltersType
}

/**
 * Type of ApexAxisChartSerie.
 */
declare type ApexAxisChartSerie = ApexAxisChartSeries[0]
