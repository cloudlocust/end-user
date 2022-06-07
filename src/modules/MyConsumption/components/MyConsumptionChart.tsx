import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { IMetrics } from 'src/modules/Metrics/Metrics'
import { useTheme } from '@mui/material/styles'
import { useIntl } from 'react-intl'
import 'src/modules/MyConsumption/components/MyConsumptionChart.scss'
import { convertMetricsDataToApexChartsProps } from 'src/modules/MyConsumption'

// eslint-disable-next-line jsdoc/require-jsdoc
const MyConsumptionChart = ({ data, chartType }: { data: IMetrics; chartType: string }) => {
    const { formatMessage } = useIntl()
    const theme = useTheme()
    return (
        <div className="w-full">
            <ReactApexChart
                {...convertMetricsDataToApexChartsProps(data, 'area', formatMessage, theme)}
                width={'100%'}
            />
        </div>
    )
}

export default MyConsumptionChart
