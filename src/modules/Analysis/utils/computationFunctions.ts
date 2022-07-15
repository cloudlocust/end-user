import { isNil, mean } from 'lodash'
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
 * Compute the MaxConsumption.
 *
 * @param consumptionAxisValues Consumption Y and X values, where (Y, represent each consumption entry) and (X, represent the timestamp for it).
 * @returns Value and Unit and the timestamp of the maximum consumption.
 */
export const computeMaxConsumption = (consumptionAxisValues: ApexChartsAxisValuesType): computationFunctionType => {
    let maxConsumption = 0
    let timeStampMaxConsumption = 0
    if (consumptionAxisValues.yAxisSeries.length > 0) {
        const valuesConsumption = consumptionAxisValues.yAxisSeries[0].data as Array<number>
        const timeStampsConsumption = consumptionAxisValues.xAxisSeries[0]
        valuesConsumption.forEach((value: number | null, index) => {
            if (!isNil(value) && maxConsumption < value) {
                maxConsumption = value
                timeStampMaxConsumption = timeStampsConsumption[index]
            }
        })
    }
    const convertedMaxConsumption = consumptionWattUnitConversion(maxConsumption)
    return {
        value: convertedMaxConsumption.value,
        unit: convertedMaxConsumption.unit,
        timestamp: timeStampMaxConsumption,
    }
}

/**
 * Compute the MaxConsumption.
 *
 * @param consumptionAxisValues Consumption Y and X values, where (Y, represent each consumption entry) and (X, represent the timestamp for it).
 * @returns Value and Unit and the timestamp of the minimum consumption.
 */
export const computeMinConsumption = (consumptionAxisValues: ApexChartsAxisValuesType): computationFunctionType => {
    let minConsumption = 0
    let timeStampMinConsumption = 0
    if (consumptionAxisValues.yAxisSeries.length > 0) {
        const valuesConsumption = consumptionAxisValues.yAxisSeries[0].data as Array<number>
        const timeStampsConsumption = consumptionAxisValues.xAxisSeries[0]
        valuesConsumption.forEach((value: number | null, index) => {
            // When minConsumption is 0, we initialize minConsumption with the first value found
            if (!isNil(value) && (minConsumption > value || minConsumption === 0)) {
                minConsumption = value
                timeStampMinConsumption = timeStampsConsumption[index]
            }
        })
    }
    const convertedMinConsumption = consumptionWattUnitConversion(minConsumption)
    return {
        value: convertedMinConsumption.value,
        unit: convertedMinConsumption.unit,
        timestamp: timeStampMinConsumption,
    }
}
