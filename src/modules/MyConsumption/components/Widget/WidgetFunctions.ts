import { ApexAxisChartSerie, IMetric } from 'src/modules/Metrics/Metrics'
import { convertMetricsDataToApexChartsAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { sum, max, mean } from 'lodash'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'
import convert from 'convert-units'

/**
 * Function that returns values from yAxis of the graph.
 *
 * @param data Metrics data.
 * @returns Values.
 */
export const getDataFromYAxis = (data: IMetric[]) => {
    // The values to be used in the widget are the values of the Y axis in the chart.
    const { yAxisSeries } = convertMetricsDataToApexChartsAxisValues(data)
    const values: number[] = []
    yAxisSeries.forEach((el: ApexAxisChartSerie) => el.data.forEach((number) => values.push(number as number)))
    return values
}

/**
 * Function that computes total comsumption.
 *
 * @param data Metrics data.
 * @returns Total consumption rounded.
 */
export const computeTotalConsumption = (data: IMetric[]) => {
    const values = getDataFromYAxis(data)
    const totalConsumptionValueInWatts = sum(values)
    return consumptionWattUnitConversion(totalConsumptionValueInWatts)
}

/**
 * Function that computes maximum power.
 *
 * @param data Metrics data.
 * @returns Max power value.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export const computePMax = (data: IMetric[]): { value: number; unit: 'kVa' | 'VA' } => {
    const values = getDataFromYAxis(data)
    const maxPowerVA = max(values)!
    // If the number has more than 3 digits, we convert from VA to kVA
    // The number is rounded with two number of digits after the decimal point.
    if (maxPowerVA > 999) {
        return {
            value: Number(convert(maxPowerVA).to('kVA').toFixed(2)),
            unit: 'kVa',
        }
    } else {
        return {
            value: maxPowerVA,
            unit: 'VA',
        }
    }
}

/**
 * Function that computes temperature.
 *
 * @param data Metrics data.
 * @returns Temperature value.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export const computeTemperature = (data: IMetric[]): { value: number; unit: '°C' } => {
    const values = getDataFromYAxis(data)
    return {
        value: Math.ceil(mean(values)),
        unit: '°C',
    }
}
