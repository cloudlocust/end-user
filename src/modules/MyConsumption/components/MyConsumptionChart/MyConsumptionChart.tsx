import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { IMetrics } from 'src/modules/Metrics/Metrics'
import { useTheme } from '@mui/material/styles'
import { useIntl } from 'react-intl'
import { CircularProgress } from '@mui/material'
import 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChart.scss'
import { convertMetricsDataToApexChartsProps } from 'src/modules/MyConsumption'
import { periodValue } from 'src/modules/MyConsumption/myConsumptionTypes'
import { useMediaQuery } from '@mui/material'

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
    chartType: string
    // eslint-disable-next-line jsdoc/require-jsdoc
    isMetricsLoading: boolean
    // eslint-disable-next-line jsdoc/require-jsdoc
    period?: periodValue
}) => {
    const { formatMessage } = useIntl()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    if (isMetricsLoading)
        return (
            <div className="flex flex-col justify-center items-center w-full h-full">
                <CircularProgress />
            </div>
        )
    const reactApexChartsProps = convertMetricsDataToApexChartsProps({
        data,
        chartType,
        formatMessage,
        theme,
        period,
        isMobile,
    })
    return (
        <div className="w-full">
            <ReactApexChart {...reactApexChartsProps} data-testid="apexcharts" width={'100%'} />
        </div>
    )
}

export default MyConsumptionChart
