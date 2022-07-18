import { mean } from 'lodash'
import { ApexChartsAxisValuesType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'
import { computationFunctionType } from 'src/modules/Analysis/analysisTypes.d'

/**
 * Compute the MeanConsumption.
 *
 * @param consumptionValues Consumption values (represent each consumption entry).
 * @returns Value and Unit for the mean consumption.
 */
export const computeMeanConsumption = (consumptionValues: number[]): computationFunctionType => {
    const meanConsumption = mean(consumptionValues)
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
        const valuesConsumption = consumptionAxisValues.yAxisSeries[0].data as Array<number | null>
        const timeStampsConsumption = consumptionAxisValues.xAxisSeries[0]
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
