import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { IMetric, metricRangeType } from 'src/modules/Metrics/Metrics'
import { useTheme } from '@mui/material/styles'
import { useIntl } from 'react-intl'
import { CircularProgress } from '@mui/material'
import 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChart.scss'
import { convertMetricsDataToApexChartsAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { getApexChartMyConsumptionProps } from 'src/modules/MyConsumption/utils/apexChartsMyConsumptionOptions'
import { ApexChartsAxisValuesType, periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import {
    fillApexChartsAxisMissingValues,
    isMissingApexChartsAxisValues,
} from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'

/**
 * MyConsumptionChart Component.
 *
 * @param props N/A.
 * @param props.data Data received from backend of format IMetric[].
 * @param props.chartType Indicates the type of the Consumption Chart.
 * @param props.isMetricsLoading Indicates if Metrics Chart Data is loading to show a spinner.
 * @param props.period Indicates the current selected Period if it's monthly or daily or yearly or weekly so that we format tooltip and xAxis of chart according to the period.
 * @param props.range Current range so that we handle the xAxis values according to period and range selected.
 * @returns MyConsumptionChart Component.
 */
const MyConsumptionChart = ({
    data,
    chartType,
    isMetricsLoading,
    period,
    range,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    data: IMetric[]
    // eslint-disable-next-line jsdoc/require-jsdoc
    chartType: ApexChart['type']
    // eslint-disable-next-line jsdoc/require-jsdoc
    isMetricsLoading: boolean
    // eslint-disable-next-line jsdoc/require-jsdoc
    period: periodType
    // eslint-disable-next-line jsdoc/require-jsdoc
    range: metricRangeType
}) => {
    const { formatMessage } = useIntl()
    const theme = useTheme()

    if (isMetricsLoading)
        return (
            <div className="flex flex-col justify-center items-center w-full h-full" style={{ height: '320px' }}>
                <CircularProgress style={{ color: theme.palette.background.paper }} />
            </div>
        )

    let ApexChartsAxisValues: ApexChartsAxisValuesType = convertMetricsDataToApexChartsAxisValues(data)

    // Checking if there are missing axis values otherwise we fill them.
    if (isMissingApexChartsAxisValues(ApexChartsAxisValues, period)) {
        // Because of ApexCharts to show the right amount of xAxis even If there are missing values according to the period (for example for 'weekly' we expect seven values), we fill the missing values with null.
        ApexChartsAxisValues = fillApexChartsAxisMissingValues(ApexChartsAxisValues, period, range)
    }

    const reactApexChartsProps = getApexChartMyConsumptionProps({
        yAxisSeries: ApexChartsAxisValues.yAxisSeries,
        xAxisValues: ApexChartsAxisValues.xAxisValues,
        period,
        chartType,
        formatMessage,
        theme,
    })
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
            <ReactApexChart {...reactApexChartsProps} data-testid="apexcharts" width={'100%'} height={320} />
        </div>
    )
}

export default MyConsumptionChart
