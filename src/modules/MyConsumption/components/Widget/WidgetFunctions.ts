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
// eslint-disable-next-line jsdoc/require-jsdoc
export const computeTotalConsumption = (data: IMetric[]): { value: number; unit: 'W' | 'kWh' | 'MWh' } => {
    const values = getDataFromYAxis(data)
    const totalConsumptionValueInWatts = sum(values)
    // Reference for writing big numbers in JS: https://stackoverflow.com/questions/17605444/making-large-numbers-readable-in-javascript
    // If value is greater than 999 it returns in kWh (kilowatts)
    if (totalConsumptionValueInWatts > 999 && totalConsumptionValueInWatts < 999_999) {
        return {
            value: ceil(totalConsumptionValueInWatts / 1000),
            unit: 'kWh',
        }
        // If value is greater than 999_999 it returns in Mhw (megawatts)
    } else if (totalConsumptionValueInWatts > 999_999) {
        return {
            value: ceil(totalConsumptionValueInWatts / 1000_000),
            unit: 'MWh',
        }
        // If value is less than 999 it returns in Watts
    } else {
        return {
            value: ceil(totalConsumptionValueInWatts),
            unit: 'W',
        }
    }
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
    if (maxPowerVA > 999) {
        return {
            value: maxPowerVA / 1000,
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
