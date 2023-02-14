import {
    ApexAxisChartSerie,
    IMetric,
    metricRangeType,
    metricTargetsEnum,
    metricTargetType,
} from 'src/modules/Metrics/Metrics.d'
import { convertMetricsDataToApexChartsAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { sum, max, mean, round } from 'lodash'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'
import convert from 'convert-units'
import { widgetTitleType } from 'src/modules/MyConsumption/components/Widget/Widget'
import {
    endOfDay,
    startOfDay,
    subDays,
    startOfMonth,
    subMonths,
    endOfMonth,
    startOfYear,
    endOfYear,
    subYears,
    getMonth,
} from 'date-fns'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { getDateWithoutTimezoneOffset } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'

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
 * Function that computes total energy for a target type.
 *
 * @param data Metrics data.
 * @param target Metric target.
 * @returns Total energy rounded.
 */
const computeTotalEnergy = (data: IMetric[], target: metricTargetType) => {
    const values = getDataFromYAxis(data, target)
    /**
     * Lodash sum when array is [null] returns null, weird library behaviour however when its sum([null, null, ...etc]) returns 0, so for the case where values are [null], 0 is assigned.
     *
     * @see https://github.com/lodash/lodash/issues/4110#issuecomment-463725975
     */
    const totalEnergyValueInWatts = sum(values) || 0
    return consumptionWattUnitConversion(totalEnergyValueInWatts)
}

/**
 * Function that computes total comsumption.
 *
 * @param data Metrics data.
 * @returns Total consumption rounded.
 */
export const computeTotalConsumption = (data: IMetric[]) => computeTotalEnergy(data, metricTargetsEnum.consumption)

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
    /**
     * Lodash sum when array is [null] returns null, weird library behaviour however when its sum([null, null, ...etc]) returns 0, so for the case where values are [null], 0 is assigned.
     *
     * @see https://github.com/lodash/lodash/issues/4110#issuecomment-463725975
     */
    const totalEuros = sum(values) ? sum(values).toFixed(2) : 0
    return { value: totalEuros, unit: '€' }
}

/**
 * Function that computes total production.
 *
 * @param data Metrics data.
 * @returns Total production rounded.
 */
export const computeTotalProduction = (data: IMetric[]) => computeTotalEnergy(data, metricTargetsEnum.totalProduction)

/**
 * Function that computes total Autoconsumption.
 *
 * @param data Metrics data.
 * @returns Total autoconsumption rounded.
 */
export const computeTotalAutoconsumption = (data: IMetric[]) =>
    computeTotalEnergy(data, metricTargetsEnum.autoconsumption)

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
        case metricTargetsEnum.totalProduction:
            return computeTotalProduction(data)!
        case metricTargetsEnum.autoconsumption:
            return computeTotalAutoconsumption(data)!
        default:
            throw Error('Wrong target')
    }
}

/**
 * Function that returns title according to metric target.
 *
 * @param target Metric Target.
 * @returns Widget title.
 */
export const renderWidgetTitle = (target: metricTargetType): widgetTitleType => {
    switch (target) {
        case metricTargetsEnum.consumption:
            return 'Achetée'
        case metricTargetsEnum.pMax:
            return 'Puissance Maximale'
        case metricTargetsEnum.externalTemperature:
            return 'Température Extérieure'
        case metricTargetsEnum.internalTemperature:
            return 'Température Intérieure'
        case metricTargetsEnum.eurosConsumption:
            return 'Coût Total'
        case metricTargetsEnum.totalProduction:
            return 'Production Totale'
        case metricTargetsEnum.autoconsumption:
            return 'Autoconsommation'
        default:
            throw Error('Wrong target')
    }
}

/**
 * Get range of previous period for widget.
 *
 * @param range Range from metrics.
 * @param period Period give.
 * @returns Previous range according from period, if "daily" returns range (startOf: fromDate-1, endOf: fromDate-1). If "weekly" returns range (startOf: fromDate week-1, endOf: fromDate-1). If "monthly" returns range (startOf: fromDate month-1, endOf: fromDate month-1). If "yearly" returns range (startOf: fromDate year-1, endOf: fromDate year-1).
 */
export const getWidgetPreviousRange = (range: metricRangeType, period: periodType) => {
    // Extract only the date, so that new Date don't create a date including the timezone.
    const fromDate = new Date(range.from.split('T')[0])
    switch (period) {
        case 'daily':
            return {
                from: getDateWithoutTimezoneOffset(startOfDay(subDays(fromDate, 1))),
                to: getDateWithoutTimezoneOffset(endOfDay(subDays(fromDate, 1))),
            }

        case 'weekly':
            return {
                from: getDateWithoutTimezoneOffset(startOfDay(subDays(fromDate, 7))),
                to: getDateWithoutTimezoneOffset(endOfDay(subDays(fromDate, 1))),
            }
        case 'monthly':
            return {
                from: getDateWithoutTimezoneOffset(startOfMonth(subMonths(fromDate, 1))),
                to: getDateWithoutTimezoneOffset(endOfMonth(subMonths(fromDate, 1))),
            }
        case 'yearly':
            return {
                from: getDateWithoutTimezoneOffset(startOfYear(subYears(fromDate, 1))),
                to: getDateWithoutTimezoneOffset(endOfYear(subYears(fromDate, 1))),
            }
    }
}

/**
 * Get range for widget, because given range can be incorrect and delayed from the wanted Widget range.
 *
 * @param range Range from metrics.
 * @param period Period give.
 * @returns Range according to period, if "daily" returns range (startOf: toDate, endOf: toDate). If "weekly" returns range (startOf: toDate week-1, endOf: toDate day). If "monthly" returns range (startOf: toDate month, endOf: toDate day). If "yearly" returns range (startOf: toDate year, endOf: toDate month-1).
 */
export const getWidgetRange = (range: metricRangeType, period: periodType) => {
    // Extract only the date, so that new Date don't create a date including the timezone.
    const toDate = new Date(range.to.split('T')[0])
    switch (period) {
        case 'daily':
            return {
                from: getDateWithoutTimezoneOffset(startOfDay(toDate)),
                to: getDateWithoutTimezoneOffset(endOfDay(toDate)),
            }

        case 'weekly':
            return {
                from: getDateWithoutTimezoneOffset(startOfDay(subDays(toDate, 6))),
                to: getDateWithoutTimezoneOffset(endOfDay(toDate)),
            }
        case 'monthly':
            return {
                from: getDateWithoutTimezoneOffset(startOfMonth(toDate)),
                to: getDateWithoutTimezoneOffset(endOfDay(toDate)),
            }
        case 'yearly':
            return {
                from: getDateWithoutTimezoneOffset(startOfYear(toDate)),
                to:
                    // If toDate is january.
                    getMonth(startOfYear(toDate)) === getMonth(toDate)
                        ? getDateWithoutTimezoneOffset(endOfDay(toDate))
                        : getDateWithoutTimezoneOffset(endOfDay(subMonths(toDate, 1))),
            }
    }
}
