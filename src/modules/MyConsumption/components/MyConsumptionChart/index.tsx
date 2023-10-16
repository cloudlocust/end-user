import React, { useRef, useEffect, useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useTheme } from '@mui/material/styles'
import { useIntl } from 'react-intl'
import 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChart.scss'
import { convertMetricsDataToApexChartsDateTimeAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { getApexChartMyConsumptionProps } from 'src/modules/MyConsumption/utils/apexChartsMyConsumptionOptions'
import { MyConsumptionChartProps } from 'src/modules/MyConsumption/myConsumptionTypes'
import { CircularProgress } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'

/**
 * MyConsumptionChart Component.
 *
 * @param props N/A.
 * @param props.data Data received from backend of format IMetric[].
 * @param props.period Indicates the current selected Period if it's monthly or daily or yearly or weekly so that we format tooltip and xAxis of chart according to the period.
 * @param props.range Current range so that we handle the xAxis values according to period and range selected.
 * @param props.isStackedEnabled Boolean state to know whether the stacked option is true or false.
 * @param props.chartType Consumption or production chart type.
 * @param props.chartLabel Chart label according to enphase state.
 * @param props.metricsInterval Metrics intervals.
 * @param props.enphaseOff Enphase consent is not ACTIVE.
 * @returns MyConsumptionChart Component.
 */
const MyConsumptionChart = ({
    data,
    period,
    range,
    isStackedEnabled,
    chartType,
    chartLabel,
    metricsInterval,
    enphaseOff,
}: MyConsumptionChartProps) => {
    const { formatMessage } = useIntl()
    const theme = useTheme()
    //To improve user experience by showing a spinner when chart mount and start drawing, until the chart is completely shown and drawn. Instead of showing an empty chart while while the chart is drawing heavy computations (Because of the length of categories given and labels, tooltip.labels especially when period === 'daily', and when options.xaxis.type === 'category' chart performance in drawing is slower).
    const [isApexChartsFinishDrawing, setIsApexChartsFinishDrawing] = React.useState(false)
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    // Is DataChanged responsible for tracking the change of data and thus optimize apexchartsProps computation only when data changes.
    const isDataChanged = useRef(true)

    useEffect(() => {
        // Reset isDataChanged when its not data change.
        isDataChanged.current = false
    }, [period, chartType, chartLabel, range])

    useEffect(() => {
        // Set isDataChanged when data changes.
        isDataChanged.current = true
    }, [data])

    // Wrap in useMemo for better performance, as we save the heavy computational result of getApexChartMyConsumptionProps function and we don't call it again on every reender only when data change.
    // The fillApexChartsDatetimeSeriesMissingValues checks if there are missing datapoints.
    const reactApexChartsProps = useMemo(() => {
        if (isDataChanged.current) {
            let ApexChartsAxisValues: ApexAxisChartSeries = convertMetricsDataToApexChartsDateTimeAxisValues(data)
            const apexChartsProps = getApexChartMyConsumptionProps({
                yAxisSeries: ApexChartsAxisValues,
                period,
                formatMessage,
                theme,
                isStackedEnabled,
                chartType,
                chartLabel,
                metricsInterval,
                enphaseOff,
            })
            apexChartsProps.options!.chart!.events = {
                /**
                 * Fires before the chart has been drawn on screen, so that to improve user experience by showing a spinner, instead of showing an empty chart while while the chart is drawing heavy computations (Because of the length of categories given and labels, tooltip.labels especially when period === 'daily', and when options.xaxis.type === 'category' chart performance in drawing is slower).
                 * Reference: https://apexcharts.com/docs/options/chart/events/ .
                 *
                 * @param _chart ChartContext.
                 * @param _options Config.
                 */
                beforeMount(_chart, _options?) {
                    setIsApexChartsFinishDrawing(false)
                },
                /**
                 * Fires after the chart has been drawn on screen, so that we stop the spinner and show the chart instead because it's being drawn.
                 * Reference: https://apexcharts.com/docs/options/chart/events/ .
                 *
                 * @param _chart ChartContext.
                 * @param _options Config.
                 */
                mounted(_chart, _options?) {
                    setIsApexChartsFinishDrawing(true)
                },
            }
            return apexChartsProps
        }
    }, [data, chartType, period, formatMessage, theme, isStackedEnabled, chartLabel, metricsInterval, enphaseOff])

    return (
        <div
            className={`${
                // We add some styling when period is daily to hide some labels in the xAxis when screen is small, otherwise it'll be too much labels and thus becomes unreadable.
                period === 'daily' && 'apexChartsDailyPeriodWrapper'
            }
            ${
                // We add some styling when period is weekly to show only 1 xAxis day label every 2 labels, and on small screens we show only 1 label day every 4 labels, It makes the Chart more readable and nicer.
                period === 'weekly' && 'apexChartsWeeklyPeriodWrapper'
            }
             ${
                 // We add some styling when period is monthly to show only 1 xAxis day label every 2 labels, and on small screens we show only 1 label day every 4 labels, It makes the Chart more readable and nicer.
                 period === 'monthly' && 'apexChartsMonthlyPeriodWrapper'
             }
             ${
                 // We add some styling when period is yearly to show only 1 xAxis day label every 2 labels, and on small screens we show only 1 label day every 4 labels, It makes the Chart more readable and nicer.
                 period === 'yearly' && 'apexChartsYearlyPeriodWrapper'
             }`}
            // When there is more than one curve on the graph, then it is necessary to increase its width (on Mobile version),
            // without this, the width increase will only apply to the consumption chart
            style={{
                width: `${isMobile && reactApexChartsProps!.series.length > 1 ? '101%' : '100%'}`,
            }}
        >
            {!isApexChartsFinishDrawing && (
                <div className="flex flex-col justify-center items-center w-full h-full" style={{ height: '320px' }}>
                    <CircularProgress style={{ color: theme.palette.background.paper }} />
                </div>
            )}
            <div className={`${!isApexChartsFinishDrawing && 'invisible h-0'}`}>
                <ReactApexChart
                    {...reactApexChartsProps}
                    data-testid="apexcharts"
                    width={isMobile ? '101%' : '100%'}
                    height={320}
                />
            </div>
        </div>
    )
}

export default MyConsumptionChart
