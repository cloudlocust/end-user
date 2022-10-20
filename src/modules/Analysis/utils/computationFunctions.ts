import { isNil, mean } from 'lodash'
import { ApexChartsAxisValuesType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'
import { computationFunctionType } from 'src/modules/Analysis/analysisTypes.d'
import { ApexAxisChartSerie, metricTargetsEnum, metricTargetType } from 'src/modules/Metrics/Metrics.d'

/**
 * Compute the MeanConsumption.
 *
 * @param consumptionAxisValues Consumption Y and X values, where (Y, represent each consumption entry) and (X, represent the timestamp for it).
 * @returns Value and Unit for the mean consumption.
 */
export const computeMeanConsumption = (consumptionAxisValues: ApexChartsAxisValuesType): computationFunctionType => {
    const meanConsumption = computeStatisticsMetricsTargetData(
        consumptionAxisValues,
        metricTargetsEnum.consumption,
        'mean',
    )
    const convertedMeanConsumption = consumptionWattUnitConversion(meanConsumption || 0)
    return {
        value: Number(convertedMeanConsumption.value.toFixed(2)),
        unit: convertedMeanConsumption.unit,
    }
}

/**
 * Compute the Min or Max Consumption, as the difference in computing Min or Max Consumption is the condition, this function regroup both in computeStatisticConsumption.
 *
 * @param statisticConsumptionType Indicate if we're looking to compute the statistic maximum or minimum consumption.
 * @param consumptionAxisValues Consumption Y and X values, where (Y, represent each consumption entry) and (X, represent the timestamp for it).
 * @returns Value and Unit and the timestamp of the minimum or maximum consumption.
 */
export const computeStatisticConsumption = (
    statisticConsumptionType: 'maximum' | 'minimum',
    consumptionAxisValues: ApexChartsAxisValuesType,
): computationFunctionType => {
    // If we're looking at the minimum we initialize the result to -1, because consumption is a positive number.
    let resultStatisticConsumption = statisticConsumptionType === 'maximum' ? 0 : -1
    let timestampStatisticConsumption = 0
    if (consumptionAxisValues.yAxisSeries.length > 0) {
        const indexConsumptionTarget = consumptionAxisValues.yAxisSeries.findIndex(
            (el: ApexAxisChartSerie) => el.name === metricTargetsEnum.consumption,
        )
        const valuesConsumption = consumptionAxisValues.yAxisSeries[indexConsumptionTarget].data as Array<number | null>
        const timeStampsConsumption = consumptionAxisValues.xAxisSeries[indexConsumptionTarget]
        valuesConsumption.forEach((value, index: number) => {
            if (
                value &&
                (statisticConsumptionType === 'maximum'
                    ? resultStatisticConsumption < value
                    : // When resultStatisticConsumption === -1, we take the first value found as min.
                      resultStatisticConsumption > value || resultStatisticConsumption === -1)
            ) {
                resultStatisticConsumption = value
                timestampStatisticConsumption = timeStampsConsumption[index]
            }
        })
    }

    const convertedResultStatisticConsumption = consumptionWattUnitConversion(
        resultStatisticConsumption === -1 ? 0 : resultStatisticConsumption,
    )

    return {
        value: convertedResultStatisticConsumption.value,
        unit: convertedResultStatisticConsumption.unit,
        timestamp: timestampStatisticConsumption,
    }
}

/**
 * Compute the MaxConsumption.
 *
 * @param consumptionAxisValues Consumption Y and X values, where (Y, represent each consumption entry) and (X, represent the timestamp for it).
 * @returns Value and Unit and the timestamp of the maximum consumption.
 */
export const computeMaxConsumption = (consumptionAxisValues: ApexChartsAxisValuesType): computationFunctionType =>
    computeStatisticConsumption('maximum', consumptionAxisValues)

/**
 * Compute the MaxConsumption.
 *
 * @param consumptionAxisValues Consumption Y and X values, where (Y, represent each consumption entry) and (X, represent the timestamp for it).
 * @returns Value and Unit and the timestamp of the minimum consumption.
 */
export const computeMinConsumption = (consumptionAxisValues: ApexChartsAxisValuesType): computationFunctionType =>
    computeStatisticConsumption('minimum', consumptionAxisValues)

/**
 * Compute Percentage Change from oldValue to newValue, the function will be implemented to interpret negative is decrease and positive mean increase.
 *
 * @param oldValue Old Value.
 * @param newValue New Value.
 * @returns Percentage Change from oldValue to newValue ( negative means decrease, positive percentage means increase ).
 */
export const computePercentageChange = (oldValue: number, newValue: number) =>
    // This formula ((oldValue - newValue) / oldValue) * 100, when negative percentage means there is increase, and when positive means there is decrease.
    // Thus multiplying by -1 means, when negative percentage its decrease, and positive percentage its increase.
    oldValue === 0 ? oldValue : -((oldValue - newValue) / oldValue) * 100

/**
 * Transform data so that all of its elements fall between customMin, customMax.
 *
 * @param values Data.
 * @param customMin Represent the lowest value of the transformed data.
 * @param customMax Represent the Highest value of the transformed data.
 * @returns Data within a custom range where the lowest value is customMin and the highest value is customMax.
 */
export const normalizeValues = (values: number[], customMin: number, customMax: number) => {
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min
    return values.map((val) => customMin + ((val - min) * (customMax - customMin)) / range)
}

/**
 * Compute the mean of the metrics target data.
 *
 * @param consumptionAxisValues Consumption Y and X values, where (Y, represent each consumption entry) and (X, represent the timestamp for it).
 * @param target Metric target.
 * @param statisticConsumptionType Indicate if we're looking to compute the statistic mean, maximum or minimum consumption.
 * @returns Mean target data.
 */
export const computeStatisticsMetricsTargetData = (
    consumptionAxisValues: ApexChartsAxisValuesType,
    target: metricTargetType,
    statisticConsumptionType: 'maximum' | 'minimum' | 'mean',
) => {
    if (consumptionAxisValues.yAxisSeries.length === 0) return 0
    let values: number[] = []
    // Filter yAxisSeries according to the target.
    values = consumptionAxisValues.yAxisSeries.filter((el: ApexAxisChartSerie) => el.name === target)[0]
        .data as Array<number>

    switch (statisticConsumptionType) {
        case 'mean':
            return mean(values)
        case 'minimum':
            return Math.min(...values.filter((number) => !isNil(number)))
        case 'maximum':
            return Math.max(...values)
    }
}
