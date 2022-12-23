import { ApexAxisChartSerie, IMetric, metricTargetsEnum, metricTargetType } from 'src/modules/Metrics/Metrics.d'
import { convertMetricsDataToApexChartsAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { sum, max, mean, round } from 'lodash'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'
import convert from 'convert-units'

/**
 * Function that returns values from yAxis of the graph.
 *
 * @param data Metrics data.
 * @param target Metric target.
 * @returns Values.
 */
export const getDataFromYAxis = (data: IMetric[], target: metricTargetType) => {
    // The values to be used in the widget are the values of the Y axis in the chart.
    const { yAxisSeries } = convertMetricsDataToApexChartsAxisValues(data)
    let values: number[] = []
    // Filter xAxisSeries according to the target.
    values = yAxisSeries.filter((el: ApexAxisChartSerie) => el.name === target)[0].data as number[]
    return values
}

/**
 * Function that computes total comsumption.
 *
 * @param data Metrics data.
 * @returns Total consumption rounded.
 */
export const computeTotalConsumption = (data: IMetric[]) => {
    const values = getDataFromYAxis(data, metricTargetsEnum.consumption)
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
    const values = getDataFromYAxis(data, metricTargetsEnum.pMax)
    const maxPowerVA = max(values)!
    // If the number has more than 3 digits, we convert from VA to kVA
    // The number is rounded with two number of digits after the decimal point.
    if (maxPowerVA > 999) {
        return {
            value: Number(convert(maxPowerVA).from('VA').to('kVA').toFixed(2)),
            unit: 'kVa',
        }
    }

    return {
        value: maxPowerVA,
        unit: 'VA',
    }
}

/**
 * Function that computes temperature.
 *
 * @param data Metrics data.
 * @returns Temperature value.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export const computeExternalTemperature = (data: IMetric[]): { value: number; unit: '°C' } => {
    const values = getDataFromYAxis(data, metricTargetsEnum.externalTemperature)
    return {
        // filter(Number) allows us to not take into considerattion any value that is not a Number
        value: round(mean(values.filter(Number))),
        unit: '°C',
    }
}

/**
 * Function that computes temperature.
 *
 * @param data Metrics data.
 * @returns Temperature value.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export const computeInternallTemperature = (data: IMetric[]): { value: number; unit: '°C' } => {
    const values = getDataFromYAxis(data, metricTargetsEnum.internalTemperature)
    return {
        // filter(Number) allows us to not take into considerattion any value that is not a Number
        value: round(mean(values.filter(Number))),
        unit: '°C',
    }
}

/**
 * Function that computes total euros.
 *
 * @param data Metrics data.
 * @returns Total Euros rounded.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export const computeTotalEuros = (data: IMetric[]): { value: number | string; unit: '€' } => {
    const values = getDataFromYAxis(data, metricTargetsEnum.eurosConsumption)
    return { value: sum(values).toFixed(2), unit: '€' }
}

/**
 * Function that compute widget assets from metric type.
 *
 * @param data Metrics data.
 * @param type Metric target.
 * @returns Unit and value for every metric type.
 */
export const computeWidgetAssets = (data: IMetric[], type: metricTargetType) => {
    switch (type) {
        case metricTargetsEnum.consumption:
            return computeTotalConsumption(data)!
        case metricTargetsEnum.pMax:
            return computePMax(data)!
        case metricTargetsEnum.externalTemperature:
            return computeExternalTemperature(data)!
        case metricTargetsEnum.internalTemperature:
            return computeInternallTemperature(data)!
        case metricTargetsEnum.eurosConsumption:
            return computeTotalEuros(data)!
        default:
            throw Error('Wrong target')
    }
}
