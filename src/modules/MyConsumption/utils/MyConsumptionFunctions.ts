import { ApexAxisChartSerie, metricFiltersType, metricRangeType } from 'src/modules/Metrics/Metrics.d'
import dayjs from 'dayjs'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { ApexChartsAxisValuesType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { getDaysInMonth } from 'date-fns'
// import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
// import TextField from '@mui/material/TextField'
// import { IInputStyles, ViewsType } from 'src/modules/MyConsumption/myConsumptionTypes'

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
 * Function to get range.
 *
 * @param rangePeriod Period for range.
 * @returns Object with range data.
 */
export const getRange = (rangePeriod: dayjs.ManipulateType) => {
    return {
        /**
         * When rangePeriod is:
         *  Day then the "from" will represent the start of the current Date and the "to" will represent the end of the current date.
         *  Week then the from date, represent the subtracted Week + 1day, because we have to count the Week including the subtracted day thus we add 1 day (for example, if we subtract 1 week from 27/06, it'll return the 20th because it doesn't count the 27th, thus we add 1 day because the 27th is counted and thus we start from the 21st till 27th which give us 7 days).
         *  Month or Year, we count from the subtracted Date a month or year from now, including the current current date or the current month.
         *
         */
        from:
            rangePeriod === 'day'
                ? dayjs().startOf('date').toDate().toISOString()
                : rangePeriod === 'week'
                ? dayjs().subtract(1, rangePeriod).add(1, 'day').toDate().toISOString()
                : dayjs().subtract(1, rangePeriod).toDate().toISOString(),
        to: dayjs().endOf('date').toDate().toISOString(),
    }
}

/**
 * Function that returns list of every 2 minutes as a date in the given range.
 *
 * @param range Range represents start date and end date.
 * @returns List of every 2minute as dates in the given range.
 */
const getMinutesValues = (range: metricRangeType) => {
    return getDatesList(range, 'minute')
}

/**
 * Function that returns list of every day as a date in the given range.
 *
 * @param range Range represents start date and end date.
 * @returns List of day as dates.
 */
const getDaysValues = (range: metricRangeType) => {
    return getDatesList(range, 'day')
}

/**
 * Function that returns list of every month as a date in the given range.
 *
 * @param range Range represents start date and end date.
 * @returns List of months as dates.
 */
const getMonthValues = (range: metricRangeType) => {
    return getDatesList(range, 'month')
}

/**
 * Function that returns a a list of millisecond timestamp dates between two dates, and the dates depends on the dayjsPeriod (it can be every 2 minute every dayjsPeriod is 'minute', or every day is dayjsPeriod is 'day' and every month if dayjsPeriod is 'month' ).
 *
 * @param range Range represents the first day and last day.
 * @param dayjsPeriod The dayjsPeriod indicates the dates and length of the list.
 * @returns List of dates between a range.
 */
const getDatesList = (range: metricRangeType, dayjsPeriod: dayjs.ManipulateType) => {
    const dates: number[] = []
    let currentDate = dayjs(new Date(range.from)).format()
    const endDate = dayjs(new Date(range.to)).format()
    while (currentDate <= endDate) {
        dates.push(dayjs(currentDate).unix() * 1000)
        currentDate = dayjs(currentDate)
            .add(dayjsPeriod === 'minute' ? 2 : 1, dayjsPeriod)
            .format()
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
    if (period === 'weekly' || period === 'monthly') return getDaysValues(range)
    if (period === 'daily') return getMinutesValues(range)
    return getMonthValues(range)
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
 * @param period The Curent Period.
 * @param range Range represents the first day and last day.
 * @returns ApexChartsAxisValues for the given range and period.
 */
export const fillApexChartsAxisMissingValues = (
    ApexChartsMissingAxisValues: ApexChartsAxisValuesType,
    period: periodType,
    range: metricRangeType,
) => {
    // Checking if AxisValues are empty no need to feel anything, because there is no response data.
    if (ApexChartsMissingAxisValues.yAxisSeries.length === 0 || ApexChartsMissingAxisValues.xAxisValues.length === 0)
        return ApexChartsMissingAxisValues
    // Checking if there are missing axis values to fill them.
    if (!isMissingApexChartsAxisValues(ApexChartsMissingAxisValues, period)) return ApexChartsMissingAxisValues
    const xAxisFilledValues = generateXAxisValues(period, range)

    const consumptionSeries: ApexAxisChartSerie = ApexChartsMissingAxisValues.yAxisSeries.find(
        // TODO FIX IN 2427, by adding the enum type
        (serie: ApexAxisChartSerie) => serie.name === 'consumption_metrics',
    )!

    // This index will help to go through backend xAxis because there is a gap, the length of xAxis backend will not be the same of expected xAxis length, thus they'll not have the same idnexing.
    let missingAxisValuesIndex = 0
    // Filling the missing y value with null, so that we can show its xAxis label, otherwise if ApexCharts if he find xAxis[i] and doesn't find yAxis[i] of the same index it'll hide the xAxis label, however even if yAxis[i] === null ApexCharts will show its xAxis[i], and that's why we're doing this so that we can show xAxis labels (for example: period === 'weekly', xAxis will be [Saturday, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday], and if yValus in Monday doesn't exist in ApexCharts it'll hide Tuesday, thus it'll show only 6 entries on the graph instead of 7, but by giving null to yValue it'll show all days including Tuesday but with no value on the chart).
    consumptionSeries.data = xAxisFilledValues.map((xFilledValue) => {
        // Checking dates so that even if there is gap from backend response, we put the backend xAxis index value in its correct expected xAxis counterpart.
        if (
            // This condition means we covered all values from back, so we just need to return null to fill the missing ones.
            missingAxisValuesIndex === ApexChartsMissingAxisValues.xAxisValues.length ||
            !isEqualDates(xFilledValue, ApexChartsMissingAxisValues.xAxisValues[missingAxisValuesIndex], period)
        ) {
            // Filling the missing y value with null, so that we can show its xAxis label, otherwise if ApexCharts if he find xAxis[i] and doesn't find yAxis[i] of the same index it'll hide the xAxis label, however even if yAxis[i] === null ApexCharts will show its xAxis[i], and that's why we're doing this so that we can show xAxis labels (for example: period === 'weekly', xAxis will be [Saturday, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday], and if yValus in Monday doesn't exist in ApexCharts it'll hide Tuesday, thus it'll show only 6 entries on the graph instead of 7, but by giving null to yValue it'll show all days including Tuesday but with no value on the chart).
            return null
        }

        // Here we're saving the the backend axis value in its correct place (index) on the expected axis values counterpart, and thus we increment the index to handle and map the next backend axis value.
        missingAxisValuesIndex += 1
        return consumptionSeries.data[missingAxisValuesIndex - 1] as number
    })
    ApexChartsMissingAxisValues.xAxisValues = xAxisFilledValues
    return ApexChartsMissingAxisValues
}

/**
 * Check if the converted ApexChartsAxisValues have missing values, according to the expected number elements for each period.
 *
 * @param ApexChartsAxisValues ApexChartsAxisValues.
 * @param period Current Period.
 * @returns Boolean indicating if there is the expected number of data according to the period given.
 */
export const isMissingApexChartsAxisValues = (ApexChartsAxisValues: ApexChartsAxisValuesType, period: periodType) => {
    if (ApexChartsAxisValues.yAxisSeries.length === 0) return false

    // TODO FIX IN 2427, by adding the enum type
    const consumptionSeries = ApexChartsAxisValues.yAxisSeries.find(
        (serie: ApexAxisChartSerie) => serie.name === 'consumption_metrics',
    )

    // If Consumption chart has 7 elements, representing the total for weekly priod.
    if (period === 'weekly') return consumptionSeries!.data.length !== 7
    // If Consumption chart has 30 elements, representing the total for weekly monthly.
    if (period === 'monthly') return consumptionSeries!.data.length !== 30 || consumptionSeries!.data.length === 31
    // If Consumption chart has 12 elements, representing the total for yearly period.
    if (period === 'yearly') return consumptionSeries!.data.length !== 12
    // Default is daily chart has 1h * 24 elements, representing the total for daily period.
    return consumptionSeries!.data.length !== 30 * 24
}

/**
 * Check the equality of two timestamps according to the period, if its daily we check the time (for example, date1: 12/12/2022 12:00, date2: 12/12/2022 12:01).
 *
 * If period is not daily, we don't need to check the time thus we check only the day, month and year.
 *
 * Thus function will help to map correctly the missingAxisValues and put it in the right index in the expectedAxisValues.
 *
 * @param date1 Timestamp of first date.
 * @param date2 Timestamp of second date.
 * @param period Period.
 * @returns Boolean if the dates are equal, the comparaison will depend on the period.
 */
export const isEqualDates = (date1: number, date2: number, period: periodType) => {
    if (period === 'daily') return dayjs(new Date(date1)).format() === dayjs(new Date(date2)).format()
    else return dayjs(new Date(date1)).format('DD/MM/YYYY') === dayjs(new Date(date2)).format('DD/MM/YYYY')
}

/**
 * Function verify if the current date is valid.
 *
 * @param date Current date.
 * @returns Boolean validation value.
 */
export const isInvalidDate = (date: Date) => {
    return (
        date.getDate() > getDaysInMonth(date) ||
        date.getDate() <= 0 ||
        date.getMonth() > 12 ||
        date.getMonth() <= 0 ||
        date.getFullYear() > new Date().getFullYear() ||
        date.getFullYear() < 2000
    )
}
// /**
//  * Set date picker.
//  *
//  * @param views Available views.
//  * @param date Current date.
//  * @param handleDateChange Handle Date Change function.
//  * @param inputStyles Input styles.
//  * @param inputFormat Input date format.
//  * @returns Date picker.
//  */
// export const setDatePickerData = (
//     views: ViewsType[],
//     date: Date,
//     handleDateChange: (newDate: Date | null) => void,
//     inputStyles: IInputStyles,
//     inputFormat: string,
// ) => {
//     return (
//         <MobileDatePicker
//             views={views}
//             value={date}
//             maxDate={new Date()}
//             inputFormat={inputFormat}
//             onChange={handleDateChange}
//             renderInput={(params) => (
//                 <TextField
//                     {...params}
//                     sx={{
//                         input: inputStyles,
//                     }}
//                 />
//             )}
//         />
//     )
// }
