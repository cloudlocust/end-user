import { ApexAxisChartSerie, IMetric } from 'src/modules/Metrics/Metrics'
import { convertMetricsDataToApexChartsAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { sum, ceil, max, mean } from 'lodash'

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
    // Reference for writing big numbers in JS: https://stackoverflow.com/questions/17605444/making-large-numbers-readable-in-javascript
    // If value is greater than 999 it returns in kWh (kilowatts)
    if (totalConsumptionValueInWatts > 999) {
        return ceil(totalConsumptionValueInWatts / 1000)
        // If value is greater than 999_999 it returns in Mhw (megawatts)
    } else if (totalConsumptionValueInWatts > 999_999) {
        return ceil(totalConsumptionValueInWatts / 1000_000)
        // If value is less than 999 it returns in Watts
    } else return totalConsumptionValueInWatts
}

/**
 * Function that computes maximum power.
 *
 * @param data Metrics data.
 * @returns Max power value.
 */
export const computePMax = (data: IMetric[]) => {
    const values = getDataFromYAxis(data)
    const maxPowerVA = max(values)!
    // If the number has more than 3 digits, we convert from VA to kVA
    if (maxPowerVA > 999) {
        return (maxPowerVA / 1000).toFixed(2)
    } else return maxPowerVA
}

/**
 * Function that computes temperature.
 *
 * @param data Metrics data.
 * @returns Temperature value.
 */
export const computeTemperature = (data: IMetric[]) => {
    const values = getDataFromYAxis(data)
    return Math.ceil(mean(values))
}
