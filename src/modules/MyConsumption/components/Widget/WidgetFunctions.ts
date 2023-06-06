import {
    ApexAxisChartSerie,
    IMetric,
    metricRangeType,
    metricTargetsEnum,
    metricTargetType,
} from 'src/modules/Metrics/Metrics.d'
import { enphaseConsentFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
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
    addDays,
} from 'date-fns'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { getDateWithoutTimezoneOffset } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'

const WRONG_TARGET_TEXT = 'Wrong target'

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
            throw Error(WRONG_TARGET_TEXT)
    }
}

/**
 * Utility Function helps not to break previous logic.
 * This function makes sure that Consumption, EurosConsumption, AutoConsumption Widgets fetches the monthly metrics when period is monthly.
 * In order to show widget value (which is the total Consumption) from monthly metrics.
 * Instead of making a daily metrics request for that month and suming the values which doesn't give the same as the value from monthly request (which is more accurate).
 *
 * @param type Metric target.
 * @param period Period.
 * @returns Returns true if the widget should make monthly metrics request.
 */
export const isWidgetMonthlyMetrics = (type: metricTargetType, period: periodType) => {
    switch (type) {
        case metricTargetsEnum.consumption:
        case metricTargetsEnum.eurosConsumption:
        case metricTargetsEnum.autoconsumption:
            return period === 'monthly'
        default:
            return false
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
            return enphaseConsentFeatureState ? 'Achetée' : 'Consommation Totale'
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
            throw Error(WRONG_TARGET_TEXT)
    }
}

/**
 * Get range of previous period for widget.
 *
 * @param range Range from metrics.
 * @param period Period give.
 * @param target Widget Target.
 * @returns Previous range according from period, if "daily" returns range (startOf: fromDate-1, endOf: fromDate-1). If "weekly" returns range (startOf: fromDate week-1, endOf: fromDate-1). If "monthly" returns range (startOf: fromDate month-1, endOf: fromDate month-1). If "yearly" returns range (startOf: fromDate year-1, endOf: fromDate year-1).
 */
export const getWidgetPreviousRange = (range: metricRangeType, period: periodType, target: metricTargetType) => {
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
                to: isWidgetMonthlyMetrics(target, period)
                    ? // Same as getWidgetRange, this gets the previous range, which ensures a correct comparaison with current range and the previous range.
                      // For the widgets that'll show the sum from the monthly metrics request.
                      // Adding 15 days will ensure to receive that sum.
                      // Example: To see consumption of 04/2022, A query request will be made with metricsInterval '1M' and make range [from: 01/04/2022 - to: 15/05/2022]
                      // This will make sure the response result, contains the metric for 04/2022 as first element, and if there is a second element it'll be null, because we're requesting whole month data when we give only 15/05
                      getDateWithoutTimezoneOffset(addDays(endOfMonth(subMonths(fromDate, 1)), 15))
                    : getDateWithoutTimezoneOffset(endOfMonth(subMonths(fromDate, 1))),
            }
        case 'yearly':
            return {
                from: getDateWithoutTimezoneOffset(startOfYear(subYears(fromDate, 1))),
                to: getDateWithoutTimezoneOffset(endOfYear(subYears(fromDate, 1))),
            }
    }
}

/**
 * Get range for widget, because given range comes from MyConsumptionContainer which is not calendar when it comes to monthly and yearly period.
 *
 * @param range Range from metrics.
 * @param period Period give.
 * @param target Metric Target type.
 * @returns Range according to period.
 * - When "daily" range should be [start, end] of same day.
 * - When "weekly" range should be a week starting with the fromDate day of given range.
 * - When "monthly" range should be [start, end] of same month.
 * - When "yearly" range should be [start, end] of same year.
 */
export const getWidgetRange = (range: metricRangeType, period: periodType, target: metricTargetType) => {
    // Extract only the date, so that new Date don't create a date including the timezone.
    const fromDate = startOfDay(new Date(range.from.split('T')[0]))
    switch (period) {
        case 'daily':
            return {
                from: getDateWithoutTimezoneOffset(fromDate),
                to: getDateWithoutTimezoneOffset(endOfDay(fromDate)),
            }
        case 'weekly':
            return {
                from: getDateWithoutTimezoneOffset(fromDate),
                to: getDateWithoutTimezoneOffset(endOfDay(addDays(fromDate, 6))),
            }
        case 'monthly':
            return {
                from: getDateWithoutTimezoneOffset(startOfMonth(fromDate)),
                to: isWidgetMonthlyMetrics(target, period)
                    ? // For the widgets that'll show the sum from the monthly metrics request.
                      // Adding 15 days will ensure to receive that sum.
                      // Example: To see consumption of 04/2022, A query request will be made with metricsInterval '1M' and make range [from: 01/04/2022 - to: 15/05/2022]
                      // This will make sure the response result, contains the metric for 04/2022 as first element, and if there is a second element it'll be null, because we're requesting whole month data when we give only 15/05
                      getDateWithoutTimezoneOffset(addDays(endOfMonth(fromDate), 15))
                    : getDateWithoutTimezoneOffset(endOfMonth(fromDate)),
            }
        case 'yearly':
            return {
                from: getDateWithoutTimezoneOffset(startOfYear(fromDate)),
                to: getDateWithoutTimezoneOffset(endOfYear(fromDate)),
            }
    }
}

/**
 * Get color type for increase indicator or decrease indicator according to the target type.
 *
 * @param target Target type.
 * @param percentageChange Percentage change (positive or negative).
 * @returns Color type (success / error).
 */
export const getWidgetIndicatorColor = (target: metricTargetType, percentageChange: number) => {
    switch (target) {
        case metricTargetsEnum.totalProduction:
        case metricTargetsEnum.injectedProduction:
        case metricTargetsEnum.autoconsumption:
            return percentageChange > 0 ? 'success' : 'error'
        case metricTargetsEnum.consumption:
        case metricTargetsEnum.pMax:
        case metricTargetsEnum.externalTemperature:
        case metricTargetsEnum.internalTemperature:
        case metricTargetsEnum.eurosConsumption:
            return percentageChange > 0 ? 'error' : 'success'
        default:
            throw Error(WRONG_TARGET_TEXT)
    }
}

/**
 * Compute the total consumption of the current and old metrics.
 *
 * @param data The current metrics.
 * @returns The total consumption (consumption + autoconsumption).
 */
export const computeTotalOfAllConsumptions = (data: IMetric[]) => {
    const { value: consumptionValue, unit: consumptionUnit } = computeTotalConsumption(data)
    const { value: AutoConsumptionValue, unit: AutoConsumptionUnit } = computeTotalAutoconsumption(data)

    const totalOfAllConsumptions =
        convert(consumptionValue).from(consumptionUnit).to('Wh') +
        convert(AutoConsumptionValue).from(AutoConsumptionUnit).to('Wh')

    return consumptionWattUnitConversion(totalOfAllConsumptions)
}
