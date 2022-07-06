import {
    ApexAxisChartSerie,
    metricFiltersType,
    metricRangeType,
    metricTargetsEnum,
} from 'src/modules/Metrics/Metrics.d'
import dayjs from 'dayjs'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { ApexChartsAxisValuesType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { add, addDays, endOfDay, subMinutes, startOfDay, sub, subDays, startOfMonth } from 'date-fns'

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
const convertPeriod = (rangePeriod: string) => {
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
 * Function to get range.
 *
 * @param rangePeriod Period for range.
 * @param toDate Current Date.
 * @param operation Add or Sub operation.
 * @returns Object with ranged data.
 */
export const getRange = (rangePeriod: string, toDate?: Date, operation: 'sub' | 'add' = 'sub') => {
    const currentDate = toDate || new Date()
    const period = convertPeriod(rangePeriod)
    const localOffset = currentDate.getTimezoneOffset()
    /**
     * SetRange function.
     *
     * @param operator Add or Sub operator.
     * @param dayDate Day then the "from" will represent the start of the current Date and the "to" will represent the end of the current date.
     * @param doDays SubDays or AddDays. Week then the from date, represent the subtracted Week + 1day(6 full days), because we have to count the Week including the subtracted day
     * thus we add 1 day (for example, if we subtract 1 week from 27/06, it'll return the 20th because it doesn't count the 27th,
     * thus we add 1 day because the 27th is counted and thus we start from the 21st till 27th which give us 7 days).
     * @param action Add or sub operation.
     * @returns Ranged data.
     */
    const setRange = (
        operator: 'sub' | 'add',
        dayDate: Date,
        doDays: (date: number | Date, amount: number) => Date,
        action: (date: number | Date, duration: Duration) => Date,
    ) => {
        if (operation === operator) {
            if (period === 'days') return dayDate
            if (period === 'weeks') return doDays(dayDate, 6)
            return action(period === 'years' ? startOfMonth(currentDate) : dayDate, {
                [period as string]: 1,
            })
        }
        return dayDate
    }
    /**
     * GetDateWithoutOffset function.
     *
     * @param date Current date.
     * @returns Date without utc offset.
     */
    const getDateWithoutOffset = (date: Date) => {
        return subMinutes(date, localOffset).toISOString()
    }
    return {
        from: getDateWithoutOffset(setRange('sub', startOfDay(currentDate), subDays, sub)),
        to: getDateWithoutOffset(setRange('add', endOfDay(currentDate), addDays, add)),
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
 * Function that fills missing values from backend response (which will have ordered xAxis), and returns the Values depending on range and period (for 'daily' list of every 2 minutes 720 entries, 'weekly' and 'mothly' list of everyday (7 or 30 entries), 'yearly' list of every year (12enries)).
 *
 * Filling the missing values, so that we can show its xAxis label, otherwise if ApexCharts finds xAxis[i] and doesn't find yAxis[i] of the same index it'll hide the xAxis label, however even if yAxis[i] === null ApexCharts will show its xAxis[i], and that's why we're doing this so that we can show xAxis labels.
 *
 * For example: period === 'weekly', xAxis will be [Saturday, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday], and if yValus in Monday doesn't exist in ApexCharts it'll hide Tuesday, thus it'll show only 6 entries on the graph instead of 7, but by giving null to yValue it'll show all days including Tuesday but with no value on the chart).
 *
 * We have to do a maping also because, from the example [Saturday, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday] xAxisLabels that we generate front side, backend can response with gap ie, backend can give values for only [Saturday, Friday] and no data is given for days in between Saturday and Friay, thus we're using an alogirthm where we will map through [Saturday, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday] and we construct a new yAxisValues that will have length of 7, where don't lose the indexing of Saturday and Friday given by back which will be respectively index 0 and 6  and still fill yAxisValues[indexes: 1, 2, 3, 4, 5, 6 representing the missing data from back], if there is no mapping yAxisValues will have the index 0 representing data for Saturday and index 1 representing data for Friday, which will be a wrong chart.
 *
 * @param ApexChartsMissingAxisValues ApexChartsAxisValues with the missing values for the indicated period.
 * @param period Period of the chart ('daily', 'weekly', 'montly', 'yearly').
 * @param range Range represents the first day and last day.
 * @returns ApexChartsAxisValues for the given range and period.
 */
export const fillApexChartsAxisMissingValues = (
    ApexChartsMissingAxisValues: ApexChartsAxisValuesType,
    period: periodType,
    range: metricRangeType,
) => {
    // Checking if AxisValues are empty no need to feel anything, because there is no response data.
    if (ApexChartsMissingAxisValues.yAxisSeries.length === 0 || ApexChartsMissingAxisValues.xAxisSeries.length === 0)
        return ApexChartsMissingAxisValues
    const xAxisExpectedValues = generateXAxisValues(period, range)

    // Filling the missing values for all data targets happens only when period is yearly, otherwise the check is only for consumption target.
    if (period === 'yearly')
        ApexChartsMissingAxisValues.yAxisSeries.forEach((yAxisSerie: ApexAxisChartSerie, serieIndex: number) => {
            // fillTargetYAxisValues check also if there are missing values.
            yAxisSerie.data = fillTargetYAxisValues(
                yAxisSerie.data,
                ApexChartsMissingAxisValues.xAxisSeries[serieIndex],
                xAxisExpectedValues,
                period,
            ) as ApexAxisChartSerie['data']
        })
    else {
        let consumptionSerieIndex = 0
        // When period not yearly the missing values is only in the consumption target.
        const consumptionSeries: ApexAxisChartSerie = ApexChartsMissingAxisValues.yAxisSeries.find(
            (serie: ApexAxisChartSerie, serieIndex: number) => {
                if (serie.name === metricTargetsEnum.consumption) {
                    consumptionSerieIndex = serieIndex
                    return true
                }
                return false
            },
        )!
        consumptionSeries.data = fillTargetYAxisValues(
            consumptionSeries.data,
            ApexChartsMissingAxisValues.xAxisSeries[consumptionSerieIndex],
            xAxisExpectedValues,
            period,
        ) as ApexAxisChartSerie['data']
    }

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
    // Checking if there are missing axis values to fill them.
    if (!isMissingYAxisValues(yAxisMissingValues, period)) return yAxisMissingValues

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
    else if (period === 'yearly')
        return (
            dayjs.utc(new Date(date1).toUTCString()).format('MM/YYYY') ===
            dayjs.utc(new Date(date2).toUTCString()).format('MM/YYYY')
        )
    else
        return (
            dayjs.utc(new Date(date1).toUTCString()).format('DD/MM/YYYY') ===
            dayjs.utc(new Date(date2).toUTCString()).format('DD/MM/YYYY')
        )
}
