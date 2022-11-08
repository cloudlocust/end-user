import {
    ApexAxisChartSerie,
    metricFiltersType,
    metricRangeType,
    metricTargetsEnum,
    metricTargetType,
} from 'src/modules/Metrics/Metrics.d'
import dayjs from 'dayjs'
import { dateFnsPeriod, periodType } from 'src/modules/MyConsumption/myConsumptionTypes.d'
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
} from 'date-fns'
import { cloneDeep } from 'lodash'

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
 * Function that returns list of dates representing every 2 minutes for the given day.
 *
 * @param range Range represents start date and end date.
 * @returns List of dates representing every 2 minutes for the given day.
 */
const getMinutesValues = (range: metricRangeType) => {
    return getAddedDates(720, range.from, 'minute')
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
    return getAddedDates(13, range.from, 'month')
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
        const currentDate = dayjs(startDate)
            .add(dayjsPeriod === 'minute' ? 2 * i : i, dayjsPeriod)
            .format()
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
        if (yAxisSerie.data.length >= 13) return
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
     * Default is daily, Data should have 30 * 24 elements.
     * 30 Represents 1h, because interval each 2min.
     * 24 Because there is 24 hours a day.
     */
    return yAxisValues.length !== 30 * 24
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
            metricTarget === metricTargetsEnum.eurosConsumption ||
            metricTarget === metricTargetsEnum.autoconsumption) &&
        period === 'daily'
    ) {
        return 'area'
    } else if (
        metricTarget === metricTargetsEnum.externalTemperature ||
        metricTarget === metricTargetsEnum.internalTemperature ||
        metricTarget === metricTargetsEnum.pMax
    ) {
        return 'line'
        // } else if (metricTarget === metricTargetsEnum.consumption) {
        //     return ''
    } else {
        return 'bar'
    }
}
