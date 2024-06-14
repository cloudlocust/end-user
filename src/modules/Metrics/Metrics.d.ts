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
    | '__euros__base_consumption_metrics'
    | '__euros__hp_consumption_metrics'
    | '__euros__hc_consumption_metrics'
    | '__euros__idle_consumption_metrics'
    // FRONT END PURPOSES TARGETS
    // 'off_idle_consumption_metrics' target is made for front purposes, it doesn't exist on the back
    // To show a chart with the total off-idle consumption.
    // It'll be calculated based on 'consumption_metrics' and 'idle_consumption_metrics'
    | 'off_idle_consumption_metrics'
    | 'total_idle_consumption_metrics'
    | 'total__euros__idle_consumption_metrics'
    | '__euros__off_idle_consumption_metrics'
    | 'only_consumption_metrics'
    | 'only_euro_consumption_metrics'
    | 'consumption_metrics_by_tariff_component'
    | '__euros__consumption_metrics_by_tariff_component'
    | 'hp_jour_bleu_consumption_metrics'
    | 'hc_jour_bleu_consumption_metrics'
    | 'hp_jour_rouge_consumption_metrics'
    | 'hc_jour_rouge_consumption_metrics'
    | 'hp_jour_blanc_consumption_metrics'
    | 'hc_jour_blanc_consumption_metrics'
    | '__euros__hp_jour_bleu_consumption_metrics'
    | '__euros__hc_jour_bleu_consumption_metrics'
    | '__euros__hp_jour_rouge_consumption_metrics'
    | '__euros__hc_jour_rouge_consumption_metrics'
    | '__euros__hp_jour_blanc_consumption_metrics'
    | '__euros__hc_jour_blanc_consumption_metrics'

/**
 * Metric History Targets.
 */
export type metricHistoryTargetType =
    | 'consumption_metrics_history'
    | '__euros__consumption_metrics_history'
    | 'idle_consumption_history'
    | 'consumption_metrics_history_by_tariff_component'
    | '__euros__consumption_metrics_history_by_tariff_component'

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
    /**
     * Euro consumption for heure pleine.
     */
    euroPeakHourConsumption = '__euros__hp_consumption_metrics',
    /**
     * Euro consumption for heure creuse.
     */
    euroOffPeakConsumption = '__euros__hc_consumption_metrics',
    /**
     * Base euro consumption (according to Tariff de base).
     */
    baseEuroConsumption = '__euros__base_consumption_metrics',
    /**
     * Eneum value for Euros Idle Consumption.
     */
    eurosIdleConsumption = '__euros__idle_consumption_metrics',

    // Targets used only on the FRONT.
    /**
     * Total Idle consumption, that'll be consumption_metrics when idle_consumption_metrics.
     */
    totalIdleConsumption = 'total_idle_consumption_metrics',
    /**
     * Total Euros Idle consumption, that'll be __euros__consumption_metrics when __euros__idle_consumption_metrics.
     */
    totalEurosIdleConsumption = 'total__euros__idle_consumption_metrics',

    /**
     * Total Off Idle consumption, that'll be computed on the front based on consumption_metrics & idle_consumption_metrics.
     */
    totalOffIdleConsumption = 'off_idle_consumption_metrics',
    /**
     * Total Off Euros Idle consumption, that'll be computed on the front based on __euros__consumption_metrics & __euros__idle_consumption_metrics.
     */
    totalEurosOffIdleConsumption = '__euros__off_idle_consumption_metrics',
    /**
     * Eneum value for Euros Idle Consumption.
     */
    eurosIdleConsumption = '__euros__idle_consumption_metrics',
    /**
     * This target should return all the targets of tempo consumption metrics.
     * 
     * @description Only used to do the request.
     * @example 
     * "targets": [
     *         {
            "target": "base_consumption_metrics",
            "type": "timeserie"
        },
        {
            "target": "hp_consumption_metrics",
            "type": "timeserie"
        },
        {
            "target": "hc_consumption_metrics",
            "type": "timeserie"
        },
        {
            "target": "hp_jour_bleu_consumption_metrics",
            "type": "timeserie"
        },
        {
            "target": "hc_jour_bleu_consumption_metrics",
            "type": "timeserie"
        },
        {
            "target": "hp_jour_rouge_consumption_metrics",
            "type": "timeserie"
        },
        {
            "target": "hc_jour_rouge_consumption_metrics",
            "type": "timeserie"
        },
        {
            "target": "hp_jour_blanc_consumption_metrics",
            "type": "timeserie"
        },
        {
            "target": "hc_jour_blanc_consumption_metrics",
            "type": "timeserie"
        }
    ],
     */
    consumptionByTariffComponent = 'consumption_metrics_by_tariff_component',
    /**
     * This target should return all the targets of euro tempo consumption metrics.
     * 
     * @description Only used to do the request.
     * @example 
     * "targets": [
     *         {
            "target": "__euro__base_consumption_metrics",
            "type": "timeserie"
        },
        {
            "target": "__euro__hp_consumption_metrics",
            "type": "timeserie"
        },
        {
            "target": "__euro__hc_consumption_metrics",
            "type": "timeserie"
        },
        {
            "target": "__euro__hp_jour_bleu_consumption_metrics",
            "type": "timeserie"
        },
        {
            "target": "__euro__hc_jour_bleu_consumption_metrics",
            "type": "timeserie"
        },
        {
            "target": "__euro__hp_jour_rouge_consumption_metrics",
            "type": "timeserie"
        },
        {
            "target": "__euro__hc_jour_rouge_consumption_metrics",
            "type": "timeserie"
        },
        {
            "target": "__euro__hp_jour_blanc_consumption_metrics",
            "type": "timeserie"
        },
        {
            "target": "__euro__hc_jour_blanc_consumption_metrics",
            "type": "timeserie"
        }
    ],
     */
    euroConsumptionByTariffComponent = '__euros__consumption_metrics_by_tariff_component',
    /**
     * Tempo HP BLEU.
     */
    peakHourBlueTempoConsumption = 'hp_jour_bleu_consumption_metrics',
    /**
     * Tempo HC BLEU.
     */
    offPeakHourBlueTempoConsumption = 'hc_jour_bleu_consumption_metrics',
    /**
     * Tempo HP ROUGE.
     */
    peakHourRedTempoConsumption = 'hp_jour_rouge_consumption_metrics',
    /**
     * Tempo HC ROUGE.
     */
    offPeakHourRedTempoConsumption = 'hc_jour_rouge_consumption_metrics',
    /**
     * Tempo HP BLANC.
     */
    peakHourWhiteTempoConsumption = 'hp_jour_blanc_consumption_metrics',
    /**
     * Tempo HC BLANC.
     */
    offPeakHourWhiteTempoConsumption = 'hc_jour_blanc_consumption_metrics',
    /**
     * Tempo HP BLEU.
     */
    euroPeakHourBlueTempoConsumption = '__euros__hp_jour_bleu_consumption_metrics',
    /**
     * Tempo HC BLEU.
     */
    euroOffPeakHourBlueTempoConsumption = '__euros__hc_jour_bleu_consumption_metrics',
    /**
     * Tempo HP ROUGE.
     */
    euroPeakHourRedTempoConsumption = '__euros__hp_jour_rouge_consumption_metrics',
    /**
     * Tempo HC ROUGE.
     */
    euroOffPeakHourRedTempoConsumption = '__euros__hc_jour_rouge_consumption_metrics',
    /**
     * Tempo HP BLANC.
     */
    euroPeakHourWhiteTempoConsumption = '__euros__hp_jour_blanc_consumption_metrics',
    /**
     * Tempo HC BLANC.
     */
    euroOffPeakHourWhiteTempoConsumption = '__euros__hc_jour_blanc_consumption_metrics',

    /**
     * 'only_consumption_metrics' target is made for front purposes, it doesn't exist on the back.
     *
     * Only used when base consumption & ho & hc are empty.
     *
     *
     * Only consumption metrics.
     *
     */
    onlyConsumption = 'only_consumption_metrics',
    /**
     * 'only_euro_consumption_metrics' target is made for front purposes, it doesn't exist on the back.
     *
     * Only used when euro base & euro HP & euro HC are empty.
     *
     *
     * Only euro consumption metrics.
     */
    onlyEuroConsumption = 'only_euro_consumption_metrics',
}

/**
 * Enum representing the metric History Targets without exposing the backend naming.
 */
export enum metricHistoryTargetsEnum {
    /**
     * Enum value for the history version of the target consumption_metrics.
     */
    consumptionHistory = 'consumption_metrics_history',
    /**
     * Enum value for the history version of the target __euros__consumption_metrics.
     */
    eurosConsumptionHistory = '__euros__consumption_metrics_history',
    /**
     * Enum value for the history version of the target idle_consumption.
     */
    idleConsumptionHistory = 'idle_consumption_history',
    /**
     * Enum value for the history version of the target consumption_metrics_by_tariff_component.
     */
    consumptionHistoryByTariffComponent = 'consumption_metrics_history_by_tariff_component',
    /**
     * Enum value for the history version of the target __euros__consumption_metrics_by_tariff_component.
     */
    euroConsumptionHistoryByTariffComponent = '__euros__consumption_metrics_history_by_tariff_component',
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
     * Key. Default is: "housing_id".
     */
    key: 'housing_id'
    /**
     * Operator.
     */
    operator: '='
    /**
     * Value of the housing_id.
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
 * Options of useMetrics hook function.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type useMetricsOptionsType = {
    /**
     * Indicates if getMetrics will execute when useMetrics instanciated, by default its false because usually the filters meterGuid param is empty thus the getMetrics will always show an error on instaciation of the hook when filters meterGuid is not set.
     */
    immediate?: boolean
    /**
     * Boolean indicating that we should use history targets instaed of the simple targets.
     */
    isUsingHistoryTargets?: boolean
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
 * Format of timestamps or values object generated from formatMetricsDataToTimestampsValues function.
 *
 * @example
 * A a targetTimestampsValuesFormat would look like
 *
 * values: targetTimestampsValuesFormat = {
 *    "consumption_metrics": [1, 2, 3, 4, 5, 6, 7]
 *    "internal_temperature": [21, 22, 23, 24, 25, 26, 27]
 * }
 *
 * timestamps:targetTimestampsValuesFormat = {
 *    "consumption_metrics": [00001, 00002, 00003, 00004, 00005, 00006, 00007]
 *    "internal_temperature": [00001, 00002, 00003, 00004, 00005, 00006, 00007]
 * }
 */
export type targetTimestampsValuesFormat =
    /**
     * Metric Target Type.
     */
    {
        [key in metricTargetType]?: number[]
    }

/**
 * Format of the return from formatMetricsDataToTimestampsValues function.
 *
 * @example
 * data = [
 *  {
 *    "target": "consumption_metrics",
 *    "datapoints": [[1, 00001], [2, 00002] ,[3, 00003], [4, 00004], [5, 00005], [6, 00006], [7, 00007]]
 *  },
 *  {
 *    "target": "internal_temperature",
 *    "datapoints": [[21, 00001], [22, 00002] ,[23, 00003], [24, 00004], [25, 00005], [26, 00006], [27, 00007]]
 *  }
 * ]
 *
 * formatMetricsData(data) will give the following type.
 * {
 *  values = {
 *    "consumption_metrics": [1, 2, 3, 4, 5, 6, 7]
 *    "internal_temperature": [21, 22, 23, 24, 25, 26, 27]
 *  }
 *  timestamps = {
 *    "consumption_metrics": [00001, 00002, 00003, 00004, 00005, 00006, 00007]
 *    "internal_temperature": [00001, 00002, 00003, 00004, 00005, 00006, 00007]
 *  }
 * }
 */
export type formattedMetricsDataToTimestampsValues =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Values extracted from formatMetricsDataToTimestampsValues.
         */
        values: targetTimestampsValuesFormat
        /**
         * Timestamps extracted from formatMetricsDataToTimestampsValues.
         */
        timestamps: targetTimestampsValuesFormat
    }

/**
 * Current day consumption type.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type CurrentDayConsumptionType = {
    /**
     * Consumption value.
     */
    consumption: number | null
    /**
     * Auto consumption value.
     */
    autoConsumption: number | null
}

/**
 * Current day euro consumption type.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type CurrentDayEuroConsumptionType = {
    /**
     * Euro consumption value.
     */
    euroConsumption: number | null
}
