import React, { useMemo } from 'react'
import { endOfMonth, startOfMonth, subDays, subMonths, subYears } from 'date-fns'
import { getMetricType, metricFiltersType, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import {
    fillApexChartsAxisMissingValues,
    getDateWithoutTimezoneOffset,
} from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { ApexChartsAxisValuesType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { convertMetricsDataToApexChartsAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { computePercentageChange } from 'src/modules/Analysis/utils/computationFunctions'
import Icon from '@mui/material/Icon'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import { Typography } from '@mui/material'

/**
 * Component rendering each Line for each analysis percentage change.
 *
 * @param props N/A.
 * @param props.percentageChange The percentage change shown in the Line (If percentageChange is negative then its decrease and success colors) (else its increase and error color).
 * @param props.datePercentageChange Date shown related to the percentage change and it has format string.
 * @returns PercentageChangeLine, represents the line that shows percentage change , icon up or down, and the date of percentage change.
 */
const PercentageChangeLine = ({
    percentageChange,
    datePercentageChange,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    percentageChange: number
    // eslint-disable-next-line jsdoc/require-jsdoc
    datePercentageChange: string
}) => {
    return (
        <>
            {percentageChange ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.1 } }}
                    className="flex items-center mb-8"
                >
                    <>
                        {
                            // Negative means decrease
                            percentageChange < 0 ? (
                                <Icon color="success">trending_down</Icon>
                            ) : (
                                // Positive means increase
                                <Icon color="error">trending_up</Icon>
                            )
                        }
                        <Typography
                            className="mx-4 text-13 md:text-16 font-medium"
                            color={percentageChange < 0 ? 'success.main' : 'error.main'}
                        >
                            {Math.abs(percentageChange).toFixed(1)}%
                        </Typography>
                    </>
                    <p className="text-13 md:text-16 font-medium"> vs {datePercentageChange}</p>
                </motion.div>
            ) : (
                <></>
            )}
        </>
    )
}
/**
 * Component rendering the consumption analysis comparaison arrows of (previous month for dateReference), and (same month of dateReference but year - 1).
 *
 * @param props N/A.
 * @param props.dateReferenceConsumptionValue Represent the date of the referenceConsumptionValue, and thus we will compare to (dateReference - 1month) and (same month of dateReference - 1 year).
 * @param props.referenceConsumptionValue The Consumption value reference, that represent the new value when comparing percent change.
 * @param props.filters The Consumption value reference, that represent the new value when comparing percent change.
 * @returns Analysis Comparaison Arrows indicating the percent change for (dateReferenceConsumptionValue - 1month) and (same month of dateReferenceConsumptionValue - 1year).
 */
const AnalysisPercentageChangeArrows = ({
    dateReferenceConsumptionValue,
    referenceConsumptionValue,
    filters,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    dateReferenceConsumptionValue: string | Date
    // eslint-disable-next-line jsdoc/require-jsdoc
    referenceConsumptionValue: number
    // eslint-disable-next-line jsdoc/require-jsdoc
    filters: metricFiltersType
}) => {
    const { range, data, isMetricsLoading } = useMetrics({
        range: {
            // From represent the consumption of
            from: getDateWithoutTimezoneOffset(startOfMonth(subYears(new Date(dateReferenceConsumptionValue), 1))),
            to: getDateWithoutTimezoneOffset(endOfMonth(new Date(dateReferenceConsumptionValue))),
        },
        filters,
        targets: [
            {
                target: metricTargetsEnum.consumption,
                type: 'timeserie',
            },
        ],
        interval: '1M',
    } as getMetricType)

    // Wrap in useMemo for better performance, as we save the result of convertMetricsData function and we don't call it again on every reender, until data changes.
    let ApexChartsAxisValues: ApexChartsAxisValuesType = useMemo(
        () => convertMetricsDataToApexChartsAxisValues(data),
        [data],
    )

    // Wrap in useMemo for better performance, as we save the heavy computational result of fillApexChartsAxisMissingValues function and we don't call it again on every reender, until period, range or ApexChartsAxisValues from convertMetricsDataToApexChartsAxisValues changes.
    // The fillApexChartsAxisMissingValues checks if there are missing axis values.
    ApexChartsAxisValues = useMemo(
        // Because of ApexCharts to show the right amount of xAxis even If there are missing values according to the period (for example for 'weekly' we expect seven values), we fill the missing values with null.
        () => fillApexChartsAxisMissingValues(ApexChartsAxisValues, 'yearly', range),
        [range, ApexChartsAxisValues],
    )

    if (ApexChartsAxisValues.yAxisSeries.length === 0 || isMetricsLoading) return <></>

    let previousMonthPercentageChange = 0
    let previousYearPercentageChange = 0

    // Previous Month consumption represent the element before the last, because the last represent the dateReference and thus before it is the previous month of dateReference.
    const indexPreviousMonthPercentageChange = ApexChartsAxisValues.yAxisSeries[0].data.length - 2
    // Because example: if dateReference is 01-01-2022, then our range will be {from: "01-12-2021", to: "31-01-2022"}.
    // Thus we'll have data array showing: [Jan 2021, Feb 2021, Mar 2021, Apr 2021, May 2021, June 2021, July 2021, Aug 2021, Sept 2021, Oct 2021, Nov 2021, Dec 2021, Jan 2022].
    previousMonthPercentageChange = computePercentageChange(
        Number(ApexChartsAxisValues.yAxisSeries[0].data[indexPreviousMonthPercentageChange]),
        referenceConsumptionValue,
    )

    // Previous Year consumption represent the first element for the range given.
    previousYearPercentageChange = computePercentageChange(
        Number(ApexChartsAxisValues.yAxisSeries[0].data[0]),
        referenceConsumptionValue,
    )

    return (
        <>
            <PercentageChangeLine
                datePercentageChange={dayjs(subMonths(subDays(new Date(range.to), 1), 1)).format('MM/YYYY')}
                percentageChange={previousMonthPercentageChange}
            />
            <PercentageChangeLine
                datePercentageChange={dayjs(new Date(range.from)).format('MM/YYYY')}
                percentageChange={previousYearPercentageChange}
            />
        </>
    )
}

export default AnalysisPercentageChangeArrows
