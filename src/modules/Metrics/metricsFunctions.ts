import {
    IMetric,
    targetTimestampsValuesFormat,
    formattedMetricsDataToTimestampsValues,
    metricTargetsType,
    metricIntervalType,
    metricTargetsEnum,
    metricHistoryTargetsEnum,
    metricHistoryTargetType,
} from 'src/modules/Metrics/Metrics.d'

/**
 * Pure Function to format Metrics Data to {values & timestamps} for a simpler access and usability by chart library.
 *
 * @description
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
 * formatMetricsData(data) will give the following
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
 * @param data Metric Data in IMetric[] format .
 * @returns A simpler format as {values, timestamps} for a simpler access by chart library.
 */
export const formatMetricsDataToTimestampsValues = (data: IMetric[]): formattedMetricsDataToTimestampsValues => {
    const timestamps: targetTimestampsValuesFormat = {}
    // We can have multiple yAxisSeries, for each target it'll have its own yAxis Series.
    const values: targetTimestampsValuesFormat = {}

    data.forEach((metric) => {
        const targetTimestamps: number[] = []
        const targetValues: number[] = []

        if (metric.datapoints.length > 0) {
            metric.datapoints.forEach((datapoint) => {
                targetTimestamps.push(datapoint[1])
                targetValues.push(datapoint[0])
            })
        }
        timestamps[metric.target] = targetTimestamps
        values[metric.target] = targetValues
    })

    return { values, timestamps }
}

/**
 * Object that map every target to its history target version.
 */
export const targetHistoryMapping: Partial<Record<metricTargetsEnum, metricHistoryTargetsEnum>> = {
    [metricTargetsEnum.consumption]: metricHistoryTargetsEnum.consumptionHistory,
    [metricTargetsEnum.eurosConsumption]: metricHistoryTargetsEnum.eurosConsumptionHistory,
    [metricTargetsEnum.idleConsumption]: metricHistoryTargetsEnum.idleConsumptionHistory,
    [metricTargetsEnum.consumptionByTariffComponent]: metricHistoryTargetsEnum.consumptionHistoryByTariffComponent,
    [metricTargetsEnum.euroConsumptionByTariffComponent]:
        metricHistoryTargetsEnum.euroConsumptionHistoryByTariffComponent,
}

/**
 * Object that map every history target to its original target.
 */
export const reverseTargetHistoryMapping: Record<metricHistoryTargetsEnum, metricTargetsEnum> = {
    [metricHistoryTargetsEnum.consumptionHistory]: metricTargetsEnum.consumption,
    [metricHistoryTargetsEnum.eurosConsumptionHistory]: metricTargetsEnum.eurosConsumption,
    [metricHistoryTargetsEnum.idleConsumptionHistory]: metricTargetsEnum.idleConsumption,
    [metricHistoryTargetsEnum.consumptionHistoryByTariffComponent]: metricTargetsEnum.consumptionByTariffComponent,
    [metricHistoryTargetsEnum.euroConsumptionHistoryByTariffComponent]:
        metricTargetsEnum.euroConsumptionByTariffComponent,
}

/**
 * Function to get the optimal targets to use (simple target or history target) depending on the interval used.
 *
 * @param targets Metric Targets.
 * @param metricsInterval Metrics Interval.
 * @returns Metric Targets to use.
 */
export const getOptimalTargets = (targets: metricTargetsType, metricsInterval: metricIntervalType) => {
    if (['30m', '1d', '1M'].includes(metricsInterval)) {
        return targets.map((target) => ({
            ...target,
            target:
                (targetHistoryMapping[target.target as metricTargetsEnum] as metricHistoryTargetType) ?? target.target,
        }))
    }
    return targets
}
