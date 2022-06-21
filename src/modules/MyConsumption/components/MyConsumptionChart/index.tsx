import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { IMetrics } from 'src/modules/Metrics/Metrics'
import { useTheme } from '@mui/material/styles'
import { useIntl } from 'react-intl'
import { CircularProgress } from '@mui/material'
import 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChart.scss'
import { convertMetricsDataToApexChartsAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { getApexChartMyConsumptionProps } from 'src/modules/MyConsumption/utils/apexChartsMyConsumptionOptions'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'

// eslint-disable-next-line jsdoc/require-jsdoc
const MyConsumptionChart = ({
    data,
    chartType,
    isMetricsLoading,
    period,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    data: IMetrics
    // eslint-disable-next-line jsdoc/require-jsdoc
    chartType: ApexChart['type']
    // eslint-disable-next-line jsdoc/require-jsdoc
    isMetricsLoading: boolean
    // eslint-disable-next-line jsdoc/require-jsdoc
    period: periodType
}) => {
    const { formatMessage } = useIntl()
    const theme = useTheme()

    if (isMetricsLoading)
        return (
            <div className="flex flex-col justify-center items-center w-full h-full" style={{ height: '320px' }}>
                <CircularProgress style={{ color: theme.palette.background.paper }} />
            </div>
        )
    const { yAxisSeries, xAxisValues } = convertMetricsDataToApexChartsAxisValues(data)
    const reactApexChartsProps = getApexChartMyConsumptionProps({
        yAxisSeries,
        xAxisValues,
        period,
        chartType,
        formatMessage,
        theme,
    })
    return <ReactApexChart {...reactApexChartsProps} data-testid="apexcharts" width={'100%'} height={320} />
}

export default MyConsumptionChart
