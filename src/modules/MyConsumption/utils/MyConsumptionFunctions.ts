import {
    ApexAxisChartSerie,
    metricFiltersType,
    metricRangeType,
    metricTargetsEnum,
    metricTargetType,
    IMetric,
} from 'src/modules/Metrics/Metrics.d'
import dayjs from 'dayjs'
import {
    dateFnsPeriod,
    getChartSpecifitiesType,
    PeriodEnum,
    periodType,
} from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { ApexChartsAxisValuesType } from 'src/modules/MyConsumption/myConsumptionTypes'
import {
    add,
    addDays,
    endOfDay,
    subMinutes,
    startOfDay,
    sub,
    subDays,
    startOfMonth,
    addMinutes,
    differenceInCalendarDays,
    subWeeks,
    startOfWeek,
    subMonths,
    startOfYear,
    subYears,
    addWeeks,
    addMonths,
    addYears,
    endOfWeek,
    endOfMonth,
    endOfYear,
} from 'date-fns'
import { cloneDeep, subtract, sum } from 'lodash'
import { isNil } from 'lodash'
import fr from 'date-fns/locale/fr'
import { getDataFromYAxis } from '../components/Widget/WidgetFunctions'

/**
 * FormatMetricFilter function converts the data to the required format.
 *
 * @param valueGuid Meter guid.
 * @returns Formated meter data.
 */
export const formatMetricFilter = (valueGuid: string) => {
    return [
        {
            key: 'meter_guid',
            operator: '=',
            value: valueGuid,
        },
    ] as metricFiltersType
}
/**
 * Convert Period function gets the period to convert for date-fns library.
 *
 * @param rangePeriod Selected period to range.
 * @returns Changed period names.
 */
export const convertToDateFnsPeriod = (rangePeriod: string) => {
    switch (rangePeriod) {
        case 'day':
        case 'daily':
            return 'days'
        case 'week':
        case 'weekly':
            return 'weeks'
        case 'month':
        case 'monthly':
            return 'months'
        case 'year':
        case 'yearly':
            return 'years'
    }
}
/**
 * GetDateWithTimezoneOffset function.

 * @param date Current date.
 * @returns Date with utc offset.
 */
export const getDateWithTimezoneOffset = (date: string) => {
    const formattedData = new Date(date)
    const localOffset = formattedData.getTimezoneOffset()
    return addMinutes(formattedData, localOffset)
}
/**
 * GetDateWithoutOffset function.
 *
 * @param date Current date.
 * @returns Date without utc offset.
 */
export const getDateWithoutTimezoneOffset = (date: Date) => {
    const localOffset = date.getTimezoneOffset()
    return subMinutes(date, localOffset).toISOString()
}

/**
 * Add period.
 *
 * @param date Current Date.
 * @param period Selected period.
 * @returns Add period.
 */
export const addPeriod = (date: Date, period: dateFnsPeriod) => {
    if (period === 'days') return endOfDay(date)
    if (period === 'weeks') return addDays(date, 6)
    return add(period === 'years' ? startOfMonth(date) : endOfDay(date), {
        [period]: 1,
    })
}
/**
 * Subtract period.
 *
 * @param date Current Date.
 * @param period Selected period.
 * @returns Sub period.
 */
export const subPeriod = (date: Date, period: dateFnsPeriod) => {
    if (period === 'days') return startOfDay(date)
    if (period === 'weeks') return startOfDay(subDays(date, 6))
    return sub(period === 'years' ? startOfMonth(date) : startOfDay(date), {
        [period]: 1,
    })
}
/**
 * SetRange function.
 *
 * @param rangePeriod Selected period.
 * @param toDate Current date.
 * @param operation  Add or Sub operation.
 * Day then the "from" will represent the start of the current Date and the "to" will represent the end of the current date.
 * Week then the from date, represent the subtracted Week + 1day(6 full days), because we have to count the Week including the subtracted day
 * thus we add 1 day (for example, if we subtract 1 week from 27/06, it'll return the 20th because it doesn't count the 27th,
 * thus we add 1 day because the 27th is counted and thus we start from the 21st till 27th which give us 7 days).
 * @returns Ranged data.
 */
export const getRange = (rangePeriod: string, toDate?: Date, operation: 'sub' | 'add' = 'sub') => {
    const currentDate = toDate || new Date()
    const period = convertToDateFnsPeriod(rangePeriod) as dateFnsPeriod
    const isFutureDate = differenceInCalendarDays(addPeriod(currentDate, period), new Date()) >= 0
    if (operation === 'sub')
        return {
            from: getDateWithoutTimezoneOffset(subPeriod(currentDate, period)),
            to: getDateWithoutTimezoneOffset(endOfDay(currentDate)),
        }
    return {
        from: getDateWithoutTimezoneOffset(isFutureDate ? subPeriod(new Date(), period) : startOfDay(currentDate)),
        to: getDateWithoutTimezoneOffset(isFutureDate ? new Date() : addPeriod(currentDate, period)),
    }
}

/**
 * Function that returns list of dates representing every minutes for the given day.
 *
 * @param range Range represents start date and end date.
 * @returns List of dates representing every minutes for the given day.
 */
const getMinutesValues = (range: metricRangeType) => {
    return getAddedDates(1440, range.from, 'minute')
}

/**
 * Function that returns list of days.
 *
 * @param range Range represents start date and end date.
 * @param opts N/A.
 * @param opts.isWeek Indicates if list is of days for a week, or days for month.
 * @returns List of days.
 */
const getDaysValues = (
    range: metricRangeType,
    /**
     * Indicates the list will contain the days for a week.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    { isWeek }: { isWeek?: boolean },
) =>
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        if (isWeek) return getAddedDates(7, range.from, 'day')
        return getAddedDates(dayjs(range.from).daysInMonth() + 1, range.from, 'day')
    }

/**
 * Function that returns list months.
 *
 * @param range Range represents start date and end date.
 * @returns List of months.
 */
const getMonthValues = (range: metricRangeType) => {
    return getAddedDates(12, range.from, 'month')
}

/**
 * Function that adds an amount of dayjsPeriod, to the start date and return a list of all periods containing [Start Date, Elements In Between, Start Date + amount].
 * For example: amount is 6, startDate: 20 June, dayjsPeriod is 'day', then we'll add 6 Days to 20 june, and will have a list of all the days as following [20 june, 21 june, 22 june, 23 june, 24 june, 25 june, 26 june].
 *
 * @param amount The amount of dayjsPeriod added (When dayjsPeriod is week, and amount is 6, then we'll add 6 Weeks to the startDate), it'll indicates the length of the list.
 * @param startDate Range represents the first day and last day.
 * @param dayjsPeriod The dayjsPeriod indicates the dates and length of the list.
 * @returns List of dates between a range.
 */
const getAddedDates = (amount: number, startDate: string | number | Date, dayjsPeriod: dayjs.ManipulateType) => {
    const dates: number[] = []
    for (let i = 0; i < amount; i++) {
        const currentDate = dayjs(startDate).add(i, dayjsPeriod).format()
        dates.push(dayjs(currentDate).unix() * 1000)
    }
    return dates
}

/**
 * Function that returns a the xAxis Values depending on range and period (for 'daily' list of every 2 minutes, 'weekly' and 'mothly' list of everyday, 'yearly' list of every year).
 *
 * @param period The Curent Period.
 * @param range Range represents the first day and last day.
 * @returns XAxisValues for the given range and period.
 */
export const generateXAxisValues = (period: periodType, range: metricRangeType) => {
    if (period === 'daily') return getMinutesValues(range)
    if (period === 'yearly') return getMonthValues(range)
    return getDaysValues(range, { isWeek: period === 'weekly' })
}

/**
 * Function that map and fills gap values from backend response (which will have ordered xAxis), and returns the Values depending on range and when period is 'yearly', it will return list of every month (13entries)).
 *
 * @param ApexChartsMissingAxisValues Filled datapoints with the when yearly.
 * @param period Period of the chart ('daily', 'weekly', 'montly', 'yearly').
 * @param range Range represents the first day and last day.
 * @returns ApexChartsMissingAxisValues with filled gap datapoints.
 */
export const fillApexChartsAxisMissingValues = (
    ApexChartsMissingAxisValues: ApexChartsAxisValuesType,
    period: periodType,
    range: metricRangeType,
) => {
    // Checking if AxisValues are empty no need to feel anything, because there is no response data.
    if (
        ApexChartsMissingAxisValues.yAxisSeries.length === 0 ||
        ApexChartsMissingAxisValues.xAxisSeries.length === 0 ||
        period !== 'yearly'
    )
        return ApexChartsMissingAxisValues

    // Filling the missing values for all data targets happens only when period is yearly, otherwise the check is only for consumption target.
    let xAxisExpectedValues: number[] = []
    xAxisExpectedValues = generateXAxisValues(period, range)
    ApexChartsMissingAxisValues.yAxisSeries.forEach((yAxisSerie: ApexAxisChartSerie, serieIndex: number) => {
        if (!isMissingYAxisValues(yAxisSerie.data, period))
            // Checking if there are missing axis values to fill them.
            return
        // fillTargetYAxisValues check also if there are missing values.
        yAxisSerie.data = fillTargetYAxisValues(
            yAxisSerie.data,
            ApexChartsMissingAxisValues.xAxisSeries[serieIndex],
            xAxisExpectedValues,
            period,
        ) as ApexAxisChartSerie['data']
    })
    ApexChartsMissingAxisValues.xAxisSeries[0] = xAxisExpectedValues
    return ApexChartsMissingAxisValues
}

/**
 * Function that map and fills missing values for given yAxisMissingValues.
 *
 * @param yAxisMissingValues ApexChartsAxisValues with the missing values for the indicated period.
 * @param xAxisMissingValues The Curent Period.
 * @param xAxisExpectedValues The Curent Period.
 * @param period Period of the chart ('daily', 'weekly', 'montly', 'yearly').
 * @returns ApexChartsAxisValues for the given range and period.
 */
const fillTargetYAxisValues = (
    yAxisMissingValues: ApexAxisChartSerie['data'],
    xAxisMissingValues: number[],
    xAxisExpectedValues: number[],
    period: periodType,
) => {
    // This index will help to go through backend xAxis because there is a gap, the length of xAxis backend will not be the same of expected xAxis length, thus they'll not have the same idnexing.
    let missAxisValuesIndex = 0

    // Filling the missing y value with null, so that we can show its xAxis label, otherwise if ApexCharts if he find xAxis[i] and doesn't find yAxis[i] of the same index it'll hide the xAxis label, however even if yAxis[i] === null ApexCharts will show its xAxis[i], and that's why we're doing this so that we can show xAxis labels (for example: period === 'weekly', xAxis will be [Saturday, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday], and if yValus in Monday doesn't exist in ApexCharts it'll hide Tuesday, thus it'll show only 6 entries on the graph instead of 7, but by giving null to yValue it'll show all days including Tuesday but with no value on the chart).
    // consumptionSeries.data = fillMissingYValues(xAxisExpectedValues,
    return xAxisExpectedValues.map((xAxisValue) => {
        // Checking dates so that even if there is gap from backend response, we put the backend xAxis index value in its correct expected xAxis counterpart.
        if (
            // This condition means we covered all values from back, so we just need to return null to fill the missing ones.
            missAxisValuesIndex === xAxisMissingValues.length ||
            !isEqualDates(xAxisValue, xAxisMissingValues[missAxisValuesIndex], period)
        ) {
            // Filling the missing y value with null, so that we can show its xAxis label, otherwise if ApexCharts if he find xAxis[i] and doesn't find yAxis[i] of the same index it'll hide the xAxis label, however even if yAxis[i] === null ApexCharts will show its xAxis[i], and that's why we're doing this so that we can show xAxis labels (for example: period === 'weekly', xAxis will be [Saturday, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday], and if yValus in Monday doesn't exist in ApexCharts it'll hide Tuesday, thus it'll show only 6 entries on the graph instead of 7, but by giving null to yValue it'll show all days including Tuesday but with no value on the chart).
            return null
        }

        // Here we're saving the the backend axis value in its correct place (index) on the expected axis values counterpart, and thus we increment the index to handle and map the next backend axis value.
        missAxisValuesIndex += 1
        return yAxisMissingValues[missAxisValuesIndex - 1]
    })
}

/**
 * Filling missing values of datapoints when period is yearly, because response from metrics can send missing elements when target is temperature for period yearly, so they are filled in the frontend side.
 *
 * Datapoints are already formatted as ApexAxisChartsSeries that has format [ [timestamp1, value1], [timestamp2, value2], ....etc].
 *
 * @param ApexChartsSeriesDatetime ApexChartsAxisValues with potential missing values for the indicated period.
 * @param period Period of the chart ('daily', 'weekly', 'montly', 'yearly').
 * @param range Range represents the first day and last day.
 * @returns Filled datapoints when yearly.
 */
export const fillApexChartsDatetimeSeriesMissingValues = (
    ApexChartsSeriesDatetime: ApexAxisChartSeries,
    period: periodType,
    range: metricRangeType,
) => {
    // Checking if AxisValues are empty or period is not yearly no need to feel anything.
    if (ApexChartsSeriesDatetime.length === 0 || period !== 'yearly') return ApexChartsSeriesDatetime

    const MissingApexChartsSeriesDatetime = cloneDeep(ApexChartsSeriesDatetime)
    // Filling the missing values for all data targets can happen only when period is yearly.
    let expectedTimestampList: number[] = []
    expectedTimestampList = generateXAxisValues(period, range)
    MissingApexChartsSeriesDatetime.forEach((yAxisSerie: ApexAxisChartSerie) => {
        // TODO Find a better way rather than hard code the number.
        // Checking if there are missing datapoints.
        // If period is yearly then yAxisValues chart has 13 elements, representing all the months starting from the year preceding the current month with duplicating the current month.
        if (yAxisSerie.data.length > 12) return
        // Fill datapoints missing values.
        // This index will help to go through datapoints and map between missing value and its timestamp counterpart.
        let missingDatapointIndex = 0
        yAxisSerie.data = expectedTimestampList.map((xAxisValue) => {
            // Check for gap of current expected timestamp and current datapoint timestamp, otherwise check if we covered all given datapoints then we just fill the remaining datapoints.
            if (
                missingDatapointIndex === yAxisSerie.data.length ||
                !isEqualDates(xAxisValue, (yAxisSerie.data[missingDatapointIndex] as [number, number])[0], period)
            ) {
                // Fill the missing ones with null.
                return [xAxisValue, null]
            }

            // Map the current given datapoint in its right index following timestamp ascending oder.
            missingDatapointIndex += 1
            return [xAxisValue, (yAxisSerie.data[missingDatapointIndex - 1] as [number, number])[1]]
        }) as ApexAxisChartSerie['data']
    })
    return MissingApexChartsSeriesDatetime
}

/**
 * Check if the YAxisValues given have missing values, according to the expected number of elements for each period.
 *
 * @param yAxisValues The YAxisValues.
 * @param period Period of the chart ('daily', 'weekly', 'montly', 'yearly').
 * @returns Boolean indicating if there is the expected number of data according to the period given.
 */
export const isMissingYAxisValues = (yAxisValues: ApexAxisChartSerie['data'], period: periodType) => {
    /**
     * If period is weekly then yAxisValues chart has 7, representing all the the days of the week ending at the current day.
     * Example: Saturday 20 June, data will include [Sunday 14 June, Monday 15 June, Tuesday 16 June, Wednesday 17 June, Thursday 18 June, Friday 19 June, Saturday 20 June].
     */
    if (period === 'weekly') return yAxisValues.length !== 7
    /**
     * When Period is monthly then yAxisValues elements has 31 || 32 elements, representing all the days of the month preceding the current day.
     * Thus number of elements represents the length of month including the previous day.
     */
    if (period === 'monthly') return yAxisValues.length < 31 || yAxisValues.length > 32
    /**
     * If period is yearly then yAxisValues chart has 13 elements, representing all the months starting from the year preceding the current month with duplicating the current month.
     * Because example wwhen current month is June 2021, then the data will include [June 2020, July 2020, August 2020, September 2020, October 2020, November 2020, December 2020, January 2021, February 2021, March 2021, April 2021, May 2021, June 2021].
     */
    if (period === 'yearly') return yAxisValues.length !== 13
    /**
     * Default is daily, Data should have 60 * 24 elements.
     * 60 Represents 1h, because interval each 1min.
     * 24 Because there is 24 hours a day.
     */
    return yAxisValues.length !== 60 * 24
}

/**
 * Check the equality of two timestamps according to the period, if its daily we check the time (for example, date1: 12/12/2022 12:00, date2: 12/12/2022 12:01).
 *
 * If period is daily, we check the whole day including hours and minutes.
 * If period is yearly, we check the month and year.
 * Otherwise, we check the day, month and year.
 *
 * Thus function will help to map correctly the missingYAxisValues and put it in the right index in the expectedXAxisValues.
 *
 * @param date1 Timestamp of first date.
 * @param date2 Timestamp of second date.
 * @param period Period of the chart ('daily', 'weekly', 'montly', 'yearly').
 * @returns Boolean if the dates are equal, the comparaison will depend on the period.
 */
export const isEqualDates = (date1: number, date2: number, period: periodType) => {
    if (period === 'daily')
        return (
            dayjs.utc(new Date(date1).toUTCString()).format('D/M/YY-HH:mm') ===
            dayjs.utc(new Date(date2).toUTCString()).format('D/M/YY-HH:mm')
        )
    if (period === 'yearly')
        return (
            dayjs.utc(new Date(date1).toUTCString()).format('MM/YYYY') ===
            dayjs.utc(new Date(date2).toUTCString()).format('MM/YYYY')
        )
    return (
        dayjs.utc(new Date(date1).toUTCString()).format('DD/MM/YYYY') ===
        dayjs.utc(new Date(date2).toUTCString()).format('DD/MM/YYYY')
    )
}

/**
 * Function that gets the chart type.
 *
 * @param metricTarget Metric target.
 * @param period Period type.
 * @returns Apexchart type.
 */
export const getChartType = (metricTarget: metricTargetType, period: periodType): ApexChart['type'] | '' => {
    if (
        (metricTarget === metricTargetsEnum.consumption ||
            metricTarget === metricTargetsEnum.baseConsumption ||
            metricTarget === metricTargetsEnum.eurosConsumption ||
            metricTarget === metricTargetsEnum.autoconsumption ||
            metricTarget === metricTargetsEnum.injectedProduction ||
            metricTarget === metricTargetsEnum.totalProduction ||
            metricTarget === metricTargetsEnum.peakHourConsumption ||
            metricTarget === metricTargetsEnum.offPeakHourConsumption) &&
        period === 'daily'
    ) {
        return 'area'
    } else if (
        metricTarget === metricTargetsEnum.externalTemperature ||
        metricTarget === metricTargetsEnum.internalTemperature ||
        metricTarget === metricTargetsEnum.pMax
    ) {
        return 'line'
    } else {
        return 'bar'
    }
}

/**
 * Function to get chart specifities.
 *
 * @param target Metric target.
 * @param chartLabel Chart label according to enphase state.
 * @returns Specifity according to metric target.
 */
export const getChartSpecifities = (
    target: metricTargetsEnum,
    chartLabel?: 'Consommation totale' | 'Electricité achetée sur le réseau',
    // eslint-disable-next-line sonarjs/cognitive-complexity
): getChartSpecifitiesType => {
    if (target === metricTargetsEnum.consumption && chartLabel === 'Consommation totale') {
        return {
            label: chartLabel,
            seriesName: chartLabel,
        }
    } else if (target === metricTargetsEnum.baseConsumption && chartLabel === 'Consommation totale') {
        return {
            label: 'Consommation de base',
            seriesName: chartLabel,
            show: false,
        }
    } else if (
        (target === metricTargetsEnum.baseConsumption || target === metricTargetsEnum.consumption) &&
        chartLabel === 'Electricité achetée sur le réseau'
        // eslint-disable-next-line sonarjs/no-duplicated-branches
    ) {
        return {
            label: chartLabel,
        }
    } else if (target === metricTargetsEnum.autoconsumption) {
        return {
            label: 'Autoconsommation',
            seriesName: chartLabel,
            show: false,
        }
    } else if (target === metricTargetsEnum.baseEuroConsumption) {
        return {
            // eslint-disable-next-line sonarjs/no-duplicate-string
            label: 'Consommation euro de base',
            seriesName: 'Consommation euro de base',
        }
    } else if (target === metricTargetsEnum.eurosConsumption) {
        return {
            // eslint-disable-next-line sonarjs/no-duplicate-string
            label: 'Consommation euro totale',
            seriesName: 'Consommation euro de base',
        }
    } else if (target === metricTargetsEnum.subscriptionPrices) {
        return {
            label: 'Abonnement',
            seriesName: 'Consommation euro de base',
            show: false,
        }
    } else if (target === metricTargetsEnum.euroPeakHourConsumption) {
        return {
            label: 'Consommation achetée HP',
            seriesName: 'Consommation euro de base',
            show: false,
        }
    } else if (target === metricTargetsEnum.euroOffPeakConsumption) {
        return {
            label: 'Consommation achetée HC',
            seriesName: 'Consommation euro de base',
            show: false,
        }
    } else if (target === metricTargetsEnum.eurosIdleConsumption) {
        return {
            label: 'Consommation euro de veille',
            seriesName: 'Consommation euro de base',
            show: false,
        }
    } else if (target === metricTargetsEnum.totalEurosOffIdleConsumption) {
        return {
            label: 'Consommation euro Hors-veille',
            seriesName: 'Consommation euro de base',
            show: false,
        }
    } else if (target === metricTargetsEnum.externalTemperature) {
        return {
            label: 'Température Extérieure',
            // We put seriesName the same as internal temperature so that internal and external temperature charts will show their values in the same YAxis, instead of having 2 YAxis for each chart.
            seriesName: 'Température Intérieure',
            // Show is false here so that we don't show external temperature YAxis because its values will be shown on internal Temperature YAxis
            show: false,
        }
    } else if (target === metricTargetsEnum.internalTemperature) {
        return {
            label: 'Température Intérieure',
            // We put seriesName the same as internal temperature so that internal and external temperature charts will show their values in the same YAxis, instead of having 2 YAxis for each chart.
            seriesName: 'Température Extérieure',
        }
    } else if (target === metricTargetsEnum.pMax) {
        return {
            label: 'Pmax',
        }
    } else if (target === metricTargetsEnum.totalProduction) {
        return {
            label: 'Production totale',
            seriesName: 'Autoconsommation',
            show: true,
        }
    } else if (target === metricTargetsEnum.injectedProduction) {
        return {
            label: 'Electricité redistribuée sur le réseau',
            seriesName: 'Autoconsommation',
            show: false,
        }
    } else if (target === metricTargetsEnum.idleConsumption) {
        return {
            label: 'Consommation de veille',
            seriesName: chartLabel,
            show: false,
        }
    } else if (target === metricTargetsEnum.totalOffIdleConsumption) {
        return {
            label: 'Consommation Hors-veille',
            seriesName: chartLabel,
            show: false,
        }
    } else if (target === metricTargetsEnum.peakHourConsumption) {
        return {
            label: 'Consommation en HP',
            seriesName: chartLabel,
            show: false,
        }
    } else if (target === metricTargetsEnum.offPeakHourConsumption) {
        return {
            label: 'Consommation en HC',
            seriesName: chartLabel,
            show: false,
        }
    } else {
        throw Error('Wrong target')
    }
}

/**
 * Function that converts consumption from Wh to Watt.
 *
 * @param yValue Value in Wh.
 * @param isYValueRounded Indicate if Math.round should be applied to the value.
 * @param metricsInterval Active metrics interval.
 * @returns Consumption from Wh to Watt.
 */
export const convertConsumptionToWatt = (
    yValue: number | null | undefined,
    isYValueRounded?: boolean,
    metricsInterval: '1m' | '30m' = '1m',
) => {
    /**
     * To convert watt hours to watts for a time interval of one minute, you would divide the watt hour value by 1/60th of an hour,
     * since there are 60 minutes in an hour. So the conversion factor for one minute would be 60.
     *
     * To convert watt hours to watts for a time interval of 30 minutes, you would divide the watt hour value by 0.5 (which is 30/60th of an hour,
     * since there are 60 minutes in an hour and 30 minutes is half an hour). So the conversion factor for 30 minutes would be 2.
     */
    const value = isNil(yValue) ? '' : yValue
    const conversionFactor = metricsInterval === '1m' ? 60 : 2
    const result = value
        ? isYValueRounded
            ? Math.round(conversionFactor * value)
            : (conversionFactor * value).toFixed(2)
        : 0
    return result + ' W'
}

/**
 * Show text according to interval.
 *
 * @param chartType Chart type: consumption or production.
 * @param period Period indicating the text related to it.
 * @param isEuroUnit Indicate if its € unit.
 * @returns Text that represents the interval.
 */
export const showPerPeriodText = (chartType: 'consumption' | 'production', period: periodType, isEuroUnit = false) => {
    let textUnit = `en ${chartType === 'consumption' && isEuroUnit ? '€' : period === 'daily' ? 'Watt' : 'kWh'}`
    if (period === 'daily') {
        return `${textUnit} par jour`
    } else if (period === 'weekly') {
        return `${textUnit} par semaine`
    } else if (period === 'monthly') {
        return `${textUnit} par mois`
    } else if (period === 'yearly') {
        return `${textUnit} par année`
    } else {
        throw Error('PeriodValue not set')
    }
}

/**
 * Utility function used to filter pMax and EurosConsumption targets from given visibleChartTargets.
 *
 * @param visibleChartTargets Given Targets may contain pMax and eurosConsumption and other targets.
 * @returns New visibleChartTargets without eurosConsumption and pMax.
 */
export const filterTargetsOnDailyPeriod = (visibleChartTargets: metricTargetType[]) => {
    if (
        visibleChartTargets.includes(metricTargetsEnum.eurosConsumption) ||
        visibleChartTargets.includes(metricTargetsEnum.pMax) ||
        visibleChartTargets.includes(metricTargetsEnum.subscriptionPrices)
    ) {
        const savedVisibleTargetCharts = visibleChartTargets.filter(
            (target) =>
                ![
                    metricTargetsEnum.autoconsumption,
                    metricTargetsEnum.consumption,
                    metricTargetsEnum.baseConsumption,
                    metricTargetsEnum.pMax,
                    metricTargetsEnum.eurosConsumption,
                    metricTargetsEnum.subscriptionPrices,
                ].includes(target as metricTargetsEnum),
        )
        return [metricTargetsEnum.baseConsumption, metricTargetsEnum.autoconsumption, ...savedVisibleTargetCharts]
    }
    return visibleChartTargets
}

/**
 * Function that gets calendar dates.
 *
 * Période semaine du lundi au dimanche.
 *
 * Période mois du 1er au 28/29/30/31.
 *
 * Période année de janvier à décembre.
 *
 * @param range Metrics range.
 * @param operator Operator. "sub", "add", or "none".
 * @param period Metric period.
 * @returns Range accordingly.
 */
export function getCalendarDates(
    range: metricRangeType,
    operator: 'sub' | 'add' | 'none' = 'none',
    period: PeriodEnum,
) {
    const { from, to } = range

    switch (operator) {
        case 'sub':
            return {
                from: subtractTime(new Date(from), period),
                to: subtractTime(new Date(to), period),
            }
        case 'add':
            return {
                from: addTime(new Date(from), period),
                to: addTime(new Date(to), period),
            }
        case 'none':
        default:
            return {
                from: new Date(from),
                to: new Date(to),
            }
    }
}

/**
 * Function that subtracts time from date.
 *
 * @param date Date from which you subtract.
 * @param period Metric period.
 * @returns Substracted date.
 */
export function subtractTime(date: Date, period: PeriodEnum) {
    switch (period) {
        case PeriodEnum.DAILY:
            return getDateWithoutTimezoneOffset(subDays(startOfDay(date), 1))
        case PeriodEnum.WEEKLY:
            return getDateWithoutTimezoneOffset(subWeeks(startOfWeek(date, { locale: fr }), 1))
        case PeriodEnum.MONTHLY:
            return getDateWithoutTimezoneOffset(subMonths(startOfMonth(date), 1))
        case PeriodEnum.YEARLY:
            return getDateWithoutTimezoneOffset(subYears(startOfYear(date), 1))
    }
}

/**
 * Function that adds time to date.
 *
 * @param date Date from which you subtract.
 * @param period Metric period.
 * @returns Added date.
 */
export function addTime(date: Date, period: PeriodEnum) {
    switch (period) {
        case PeriodEnum.DAILY:
            return getDateWithoutTimezoneOffset(addDays(startOfDay(date), 1))
        case PeriodEnum.WEEKLY:
            return getDateWithoutTimezoneOffset(addWeeks(startOfWeek(date, { locale: fr }), 1))
        case PeriodEnum.MONTHLY:
            return getDateWithoutTimezoneOffset(addMonths(startOfMonth(date), 1))
        case PeriodEnum.YEARLY:
            return getDateWithoutTimezoneOffset(addYears(startOfYear(date), 1))
    }
}

/**
 * Function that gets the range according the period.
 *
 * @param period Metric period.
 * @returns Range according to the period.
 */
export function getRangeV2(period: PeriodEnum) {
    const currentDate = new Date()
    const isFutureDate = currentDate > new Date()
    const currentEndDay = getDateWithoutTimezoneOffset(endOfDay(currentDate))

    switch (period) {
        case PeriodEnum.DAILY:
            return {
                from: getDateWithoutTimezoneOffset(startOfDay(currentDate)),
                to: currentEndDay,
            }
        case PeriodEnum.WEEKLY:
            return {
                from: getDateWithoutTimezoneOffset(startOfWeek(currentDate, { locale: fr })),
                to: isFutureDate
                    ? getDateWithoutTimezoneOffset(currentDate)
                    : getDateWithoutTimezoneOffset(endOfWeek(currentDate, { locale: fr })),
            }
        case PeriodEnum.MONTHLY:
            return {
                from: getDateWithoutTimezoneOffset(startOfMonth(currentDate)),
                to: isFutureDate
                    ? getDateWithoutTimezoneOffset(currentDate)
                    : getDateWithoutTimezoneOffset(endOfMonth(currentDate)),
            }
        case PeriodEnum.YEARLY:
            return {
                from: getDateWithoutTimezoneOffset(startOfYear(currentDate)),
                to: isFutureDate
                    ? getDateWithoutTimezoneOffset(currentDate)
                    : getDateWithoutTimezoneOffset(endOfYear(currentDate)),
            }
    }
}

/**
 * Utility function to return whuch targets should be visible.
 *
 * Used in ConsumptionChartContainer in visibleTargetCharts state.
 *
 * @param isEnphaseOff Enphase state OFF.
 * @returns Metric targets list.
 */
export const getDefaultConsumptionTargets = (isEnphaseOff: boolean): metricTargetType[] => {
    if (isEnphaseOff) {
        return [
            metricTargetsEnum.baseConsumption,
            metricTargetsEnum.peakHourConsumption,
            metricTargetsEnum.offPeakHourConsumption,
            metricTargetsEnum.consumption,
        ]
    }

    return [metricTargetsEnum.autoconsumption, metricTargetsEnum.consumption]
}

/**
 * Indicates if metrics data is empty.
 *
 * @description
 * Empty Metrics Data happens when datapoints of all metricsData targets are NULL or 0.
 * To check that metricsData is empty, by summing all targets datapoints and the results must be 0 as the data should be positive.
 * Param targetsFilter to indicate which target Data to check if it's empty.
 * @example
 * data = [
 *  {
 *    "target": "consumption_metrics",
 *    "datapoints": [[null, 00001], [null, 00002] ,[null, 00003], [null, 00004]
 *  },
 *  {
 *    "target": "internal_temperature",
 *    "datapoints": [[0, 00001], [0, 00002] ,[0, 00003], [0, 00004]
 *  }
 * ]
 * => isEmptyMetricsData(data) === True
 * The isEmptyMetricsData returns true in this case because target datapoints are full of "null" and "0"
 * @example
 * data = [
 *  {
 *    "target": "consumption_metrics",
 *    "datapoints": [[null, 00001], [70, 00002] ,[89, 00003], [123, 00004]
 *  },
 *  {
 *    "target": "internal_temperature",
 *    "datapoints": [[0, 00001], [0, 00002] ,[120, 00003], [89, 00004]
 *  }
 * ]
 * => isEmptyMetricsData(data) === False
 * The isEmptyMetricsData returns false in this case because target datapoints are null made of only with "null" and "0"
 * @example
 * data = [
 *  {
 *    "target": "consumption_metrics",
 *    "datapoints": [[null, 00001], [null, 00002] ,[89, 00003], [123, 00004]
 *  },
 *  {
 *    "target": "internal_temperature",
 *    "datapoints": [[0, 00001], [0, 00002] ,[0, 00003], [0, 00004]
 *  }
 * ]
 * => isEmptyMetricsData(data, ['consumption_metrics']) === False
 * The isEmptyMetricsData returns false in this case because the filtered target "consumption_metrics" datapoints are not all null or 0.
 * @param data Metrics Data.
 * @param targetsFilter Filter indicatting the targets to check if they have empty datapoints.
 * @returns If Metrics Data given is empty (datapoints are "null" and "0" only).
 */
export const isEmptyMetricsData = (data: IMetric[], targetsFilter?: metricTargetType[]) => {
    let totalMetricsData = 0
    data.forEach((metric) => {
        if (targetsFilter && !targetsFilter.includes(metric.target)) return

        totalMetricsData += sum(
            metric.datapoints.reduce((prevValues: number[], datapoints) => prevValues.concat(datapoints[0]), []),
        )
    })
    return totalMetricsData === 0
}

/**
 * Compute TotalOffIdleConsumption MetricData based on total consumption (consumption_metrics) and idleConsumption (if exist), handle both euros and default idleConsumption.
 *
 * @description
 * Empty Metrics Data happens when datapoints of all metricsData targets are NULL or 0.
 * To check that metricsData is empty, by summing all targets datapoints and the results must be 0 as the data should be positive.
 * Param targetsFilter to indicate which target Data to check if it's empty.
 * @example
 * data = [
 *  {
 *    "target": "consumption_metrics",
 *    "datapoints": [[null, 00001], [null, 00002] ,[null, 00003], [null, 00004]]
 *  },
 *  {
 *    "target": "idle_consumption_metrics",
 *    "datapoints": [[0, 00001], [0, 00002] ,[0, 00003], [0, 00004]]
 *  }
 * ]
 * => getTotalOffIdleConsumptionData(data) === {
 *    "target": "off_idle_consumption_metrics",
 *    "datapoints": [[null, 00001], [null, 00002] ,[null, 00003], [null, 00004]]
 *  }
 * The getTotalOffIdleConsumptionData returns a new metrics object with null datapoints because consumption_metrics has only null values.
 * @example
 * data = [
 *  {
 *    "target": "consumption_metrics",
 *    "datapoints": [[null, 00001], [70, 00002] ,[120, 00003], [129, 00004]]
 *  },
 *  {
 *    "target": "idle_consumption_metrics",
 *    "datapoints": [[0, 00001], [30, 00002] ,[88, 00003], [89, 00004]]
 *  }
 * ]
 * => getTotalOffIdleConsumptionData(data) === {
 *    "target": "off_idle_consumption_metrics",
 *    "datapoints": [[null, 00001], [40, 00002] ,[32, 00003], [40, 00004]]
 *  }
 * The getTotalOffIdleConsumptionData returns a new metrics object based on the subtraction of consumption_metrics - idle_consumption_metrics.
 * @example
 * data = [
 *  {
 *    "target": "consumption_metrics",
 *    "datapoints": [[null, 00001], [null, 00002] ,[89, 00003], [123, 00004]
 *  },
 *  {
 *    "target": "internal_temperature",
 *    "datapoints": [[0, 00001], [0, 00002] ,[0, 00003], [0, 00004]
 *  }
 * ]
 * => getTotalOffIdleConsumptionData(data) === undefined
 * The getTotalOffIdleConsumptionData returns undefined because there's not idle_consumption_metrics.
 * @example
 * data = [
 *  {
 *    "target": "__euros__consumption_metrics",
 *    "datapoints": [[null, 00001], [70, 00002] ,[120, 00003], [129, 00004]]
 *  },
 *  {
 *    "target": "__euros__idle_consumption_metrics",
 *    "datapoints": [[0, 00001], [30, 00002] ,[88, 00003], [89, 00004]]
 *  }
 * ]
 * => getTotalOffIdleConsumptionData(data) === {
 *    "target": "__euros__off_idle_consumption_metrics",
 *    "datapoints": [[null, 00001], [40, 00002] ,[32, 00003], [40, 00004]]
 *  }
 * The getTotalOffIdleConsumptionData returns a new metrics object based on the subtraction of euros_consumption_metrics - euros_idle_consumption_metrics.
 * @param data Metrics Data.
 * @returns TotalOffIdle Metric Data.
 */
export const getTotalOffIdleConsumptionData = (data: IMetric[]): IMetric | undefined => {
    const idleConsumptionMetrics = data.find((metricData) => metricData.target === metricTargetsEnum.idleConsumption)
    if (idleConsumptionMetrics) {
        const totalConsumptionDatapoints = getDataFromYAxis(data, metricTargetsEnum.consumption)
        const idleConsumptionDatapoints = idleConsumptionMetrics.datapoints
        return {
            target: metricTargetsEnum.totalOffIdleConsumption,
            datapoints: totalConsumptionDatapoints.map((val, index) => {
                return [
                    val ? subtract(val, Number(idleConsumptionDatapoints[index][0])) : val,
                    idleConsumptionDatapoints[index][1],
                ]
            }),
        }
    }

    const idleEurosConsumptionMetrics = data.find(
        (metricData) => metricData.target === metricTargetsEnum.eurosIdleConsumption,
    )
    if (idleEurosConsumptionMetrics) {
        const totalEurosConsumptionDatapoints = getDataFromYAxis(data, metricTargetsEnum.eurosConsumption)
        const idleEurosConsumptionDatapoints = idleEurosConsumptionMetrics.datapoints
        return {
            target: metricTargetsEnum.totalEurosOffIdleConsumption,
            datapoints: totalEurosConsumptionDatapoints.map((val, index) => {
                return [
                    val ? subtract(val, Number(idleEurosConsumptionDatapoints[index][0])) : val,
                    idleEurosConsumptionDatapoints[index][1],
                ]
            }),
        }
    }

    return undefined
}
