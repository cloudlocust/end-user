import { useEffect, useMemo } from 'react'
import { addMonths, endOfMonth, startOfMonth, subMonths, subYears } from 'date-fns'
import { getMetricType, metricFiltersType, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { getDateWithoutTimezoneOffset } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { ApexChartsAxisValuesType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { convertMetricsDataToApexChartsAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { computePercentageChange } from 'src/modules/Analysis/utils/computationFunctions'
import Icon from '@mui/material/Icon'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import { Typography } from '@mui/material'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'
import { useAnalysisStore } from 'src/modules/Analysis/store/analysisStore'
import { isNull } from 'lodash'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

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
 * Component rendering the consumption analysis chart circle content.
 *
 * Content includes:
 * - Total Consumption.
 * - Comparaison arrows of (previous month for dateReference), and (same month of dateReference but year - 1).
 * - Total Euros.
 *
 * @param props N/A.
 * @param props.dateReferenceConsumptionValue Represent the date of the referenceConsumptionValue, and thus we will compare to (dateReference - 1month) and (same month of dateReference - 1 year).
 * @param props.filters The Consumption value reference, that represent the new value when comparing percent change.
 * @returns Analysis Circle Content Including Total Consumption, Total Euros and Comparaison Arrows indicating the percent change for (dateReferenceConsumptionValue - 1month) and (same month of dateReferenceConsumptionValue - 1year).
 */
const AnalysisChartCircleContent = ({
    dateReferenceConsumptionValue,
    filters,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    dateReferenceConsumptionValue: string | Date
    // eslint-disable-next-line jsdoc/require-jsdoc
    filters: metricFiltersType
}) => {
    // This Metrics Request Gets the data of wanted current month and previous month for comparaison.
    const { range, data, isMetricsLoading } = useMetrics(
        {
            range: {
                from: getDateWithoutTimezoneOffset(startOfMonth(subMonths(new Date(dateReferenceConsumptionValue), 1))),
                to: getDateWithoutTimezoneOffset(endOfMonth(new Date(dateReferenceConsumptionValue))),
            },
            filters,
            targets: [
                {
                    target: metricTargetsEnum.consumption,
                    type: 'timeserie',
                },
                {
                    target: metricTargetsEnum.eurosConsumption,
                    type: 'timeserie',
                },
            ],
            interval: '1M',
        } as getMetricType,
        // execute getMetrics on instanciation only if filters meterGuid is not empty, because the filters props error will already be handled in the parent.
        Boolean(filters.length),
    )

    // This Metrics Request Gets the data of previous year month for comparaison.
    const { data: dataPreviousYear, isMetricsLoading: isPreviousYearMetricsLoading } = useMetrics(
        {
            range: {
                from: getDateWithoutTimezoneOffset(startOfMonth(subYears(new Date(dateReferenceConsumptionValue), 1))),
                // Adding one month to the dateReferenceConsumptionValue to make sure the monthly metric request returns data for dateReferenceConsumptionValue (which will be element before last).
                to: getDateWithoutTimezoneOffset(
                    endOfMonth(addMonths(subYears(new Date(dateReferenceConsumptionValue), 1), 1)),
                ),
            },
            filters,
            targets: [
                {
                    target: metricTargetsEnum.consumption,
                    type: 'timeserie',
                },
            ],
            interval: '1M',
        } as getMetricType,
        // execute getMetrics on instanciation only if filters meterGuid is not empty, because the filters props error will already be handled in the parent.
        Boolean(filters.length),
    )
    // Wrap in useMemo for better performance, as we save the result of convertMetricsData function and we don't call it again on every reender, until data changes.
    let ApexChartsAxisValues: ApexChartsAxisValuesType = useMemo(
        () => convertMetricsDataToApexChartsAxisValues(data),
        [data],
    )

    // Wrap in useMemo for better performance, as we save the result of convertMetricsData function and we don't call it again on every reender, until data changes.
    let ApexChartsAxisPreviousYearValues: ApexChartsAxisValuesType = useMemo(
        () => convertMetricsDataToApexChartsAxisValues(dataPreviousYear),
        [dataPreviousYear],
    )

    const setTotalConsumption = useAnalysisStore((state) => state.setTotalConsumption)

    useEffect(() => {
        if (ApexChartsAxisValues.yAxisSeries.length && !isMetricsLoading) {
            // Reference consumption value reference represents the last element due to the range we're setting.
            setTotalConsumption(
                Number(ApexChartsAxisValues.yAxisSeries[0].data[ApexChartsAxisValues.yAxisSeries[0].data.length - 1]),
            )
        }
    }, [ApexChartsAxisValues, isMetricsLoading, setTotalConsumption])

    if (ApexChartsAxisValues.yAxisSeries.length === 0 || isMetricsLoading || isPreviousYearMetricsLoading) return <></>

    let previousMonthPercentageChange = 0
    let previousYearPercentageChange = 0

    // Reference consumption value reference represents the last element due to the range we're setting.
    const indexReferenceConsumptionValue = ApexChartsAxisValues.yAxisSeries[0].data.length - 1

    // Previous Month consumption represent the element before consumption value reference, because the last represent the dateReference and thus before it is the previous month of dateReference.
    const indexPreviousMonthPercentageChange = indexReferenceConsumptionValue - 1
    // Example: if dateReference is 01-02-2022, then our range will be {from: "01-01-2022", to: "31-02-2022"}.
    // Thus we'll have data array showing: [Jan 2022, Feb 2022].
    previousMonthPercentageChange = computePercentageChange(
        Number(ApexChartsAxisValues.yAxisSeries[0].data[indexPreviousMonthPercentageChange]),
        Number(ApexChartsAxisValues.yAxisSeries[0].data[indexReferenceConsumptionValue]),
    )

    // Previous Year consumption represent the first element for the range given in previousYear Metric Request.
    previousYearPercentageChange = ApexChartsAxisPreviousYearValues.yAxisSeries.length
        ? computePercentageChange(
              Number(ApexChartsAxisPreviousYearValues.yAxisSeries[0].data[0]),
              Number(ApexChartsAxisValues.yAxisSeries[0].data[indexReferenceConsumptionValue]),
          )
        : 0

    if (isNull(ApexChartsAxisValues.yAxisSeries[0].data[indexReferenceConsumptionValue]))
        return (
            <TypographyFormatMessage className="sm:text-16 font-medium md:text-20 text-center">
                Aucune donnée disponible
            </TypographyFormatMessage>
        )

    const totalConsumption = Number(ApexChartsAxisValues.yAxisSeries[0].data[indexReferenceConsumptionValue])
        ? consumptionWattUnitConversion(
              Number(ApexChartsAxisValues.yAxisSeries[0].data[indexReferenceConsumptionValue]),
          )
        : { value: 0, unit: 'kWh' }

    return (
        <div className="flex flex-col justify-center items-center" style={{ backgroundColor: 'transparent' }}>
            <p className="text-16 md:text-20 font-medium mb-8">
                {totalConsumption.value} {totalConsumption.unit}
            </p>
            <PercentageChangeLine
                datePercentageChange={dayjs(subMonths(new Date(dateReferenceConsumptionValue), 1)).format('MM/YYYY')}
                percentageChange={previousMonthPercentageChange}
            />
            <PercentageChangeLine
                datePercentageChange={dayjs(new Date(range.from)).format('MM/YYYY')}
                percentageChange={previousYearPercentageChange}
            />
            <p className="text-16 md:text-20 font-medium">
                {Number(ApexChartsAxisValues.yAxisSeries[1].data[indexReferenceConsumptionValue]).toFixed(2)}
                {' €'}
            </p>
        </div>
    )
}

export default AnalysisChartCircleContent
