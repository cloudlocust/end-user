import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { IMetric, metricRangeType } from 'src/modules/Metrics/Metrics'
import { useTheme } from '@mui/material/styles'
import { useIntl } from 'react-intl'
import 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChart.scss'
import { convertMetricsDataToApexChartsAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { getApexChartMyConsumptionProps } from 'src/modules/MyConsumption/utils/apexChartsMyConsumptionOptions'
import { ApexChartsAxisValuesType, periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { fillApexChartsAxisMissingValues } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { CircularProgress } from '@mui/material'

/**
 * MyConsumptionChart Component.
 *
 * @param props N/A.
 * @param props.data Data received from backend of format IMetric[].
 * @param props.chartType Indicates the type of the Consumption Chart.
 * @param props.period Indicates the current selected Period if it's monthly or daily or yearly or weekly so that we format tooltip and xAxis of chart according to the period.
 * @param props.range Current range so that we handle the xAxis values according to period and range selected.
 * @returns MyConsumptionChart Component.
 */
const MyConsumptionChart = ({
    data,
    chartType,
    period,
    range,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    data: IMetric[]
    // eslint-disable-next-line jsdoc/require-jsdoc
    chartType: ApexChart['type']
    // eslint-disable-next-line jsdoc/require-jsdoc
    period: periodType
    // eslint-disable-next-line jsdoc/require-jsdoc
    range: metricRangeType
}) => {
    const { formatMessage } = useIntl()
    const theme = useTheme()
    //To improve user experience by showing a spinner when chart mount and start drawing, until the chart is completely shown and drawn. Instead of showing an empty chart while while the chart is drawing heavy computations (Because of the length of categories given and labels, tooltip.labels especially when period === 'daily', and when options.xaxis.type === 'category' chart performance in drawing is slower).
    const [isApexChartsFinishDrawing, setIsApexChartsFinishDrawing] = React.useState(false)

    // Wrap in useMemo for better performance, as we save the result of convertMetricsData function and we don't call it again on every reender, until data changes.
    let ApexChartsAxisValues: ApexChartsAxisValuesType = React.useMemo(
        () => convertMetricsDataToApexChartsAxisValues(data),
        [data],
    )

    // // Wrap in useMemo for better performance, as we save the heavy computational result of fillApexChartsAxisMissingValues function and we don't call it again on every reender, until period, range or ApexChartsAxisValues from convertMetricsDataToApexChartsAxisValues changes.
    // The fillApexChartsAxisMissingValues checks if there are missing axis values otherwise we fill them, so that if there are no missing value it return the ApexChartsAxisValues from ApexChartsAxisValues without filling.
    ApexChartsAxisValues = React.useMemo(
        // Because of ApexCharts to show the right amount of xAxis even If there are missing values according to the period (for example for 'weekly' we expect seven values), we fill the missing values with null.
        () => fillApexChartsAxisMissingValues(ApexChartsAxisValues, period, range),
        [period, range, ApexChartsAxisValues],
    )

    const reactApexChartsProps = getApexChartMyConsumptionProps({
        yAxisSeries: ApexChartsAxisValues.yAxisSeries,
        xAxisValues: ApexChartsAxisValues.xAxisValues,
        period,
        chartType,
        formatMessage,
        theme,
    })

    reactApexChartsProps.options!.chart!.events = {
        /**
         * Fires before the chart has been drawn on screen, so that to improve user experience by showing a spinner, instead of showing an empty chart while while the chart is drawing heavy computations (Because of the length of categories given and labels, tooltip.labels especially when period === 'daily', and when options.xaxis.type === 'category' chart performance in drawing is slower).
         * Reference: https://apexcharts.com/docs/options/chart/events/ .
         *
         * @param chart ChartContext.
         * @param options Config.
         */
        beforeMount(chart, options?) {
            setIsApexChartsFinishDrawing(false)
        },
        /**
         * Fires after the chart has been drawn on screen, so that we stop the spinner and show the chart instead because it's being drawn.
         * Reference: https://apexcharts.com/docs/options/chart/events/ .
         *
         * @param chart ChartContext.
         * @param options Config.
         */
        mounted(chart, options?) {
            setIsApexChartsFinishDrawing(true)
        },
    }

    return (
        <div
            className={`w-full
    ${
        // We add some styling when period is daily to hide some labels in the xAxis when screen is small, otherwise it'll be too much labels and thus becomes unreadable.
        period === 'daily' && 'apexChartsDailyPeriodWrapper'
    }
    ${
        // We add some styling when period is monthly to show only 1 xAxis day label every 2 labels, and on small screens we show only 1 label day every 4 labels, It makes the Chart more readable and nicer.
        period === 'monthly' && 'apexChartsMonthlyPeriodWrapper'
    }`}
        >
            {!isApexChartsFinishDrawing && (
                <div className="flex flex-col justify-center items-center w-full h-full" style={{ height: '320px' }}>
                    <CircularProgress style={{ color: theme.palette.background.paper }} />
                </div>
            )}
            <div className={`${!isApexChartsFinishDrawing && 'invisible h-0'}`}>
                <ReactApexChart {...reactApexChartsProps} data-testid="apexcharts" width={'100%'} height={320} />
            </div>
        </div>
    )
}

export default MyConsumptionChart
