import { useTheme } from '@mui/material'
import { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { getApexChartAnalysisComparisonProps } from 'src/modules/Analysis/utils/analysisComparisonOptions'
import { convertMetricsDataToApexChartsDateTimeAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { AnalysisComparisonChartProps } from 'src/modules/Analysis/components/AnalysisComparisonChart/analysisComparisonChart'

/**
 * AnalysisComparisonChart component.
 *
 * @param param0 N/A.
 * @param param0.data Metrics data.
 * @returns ReactApexChart.
 */
export default function AnalysisComparisonChart({ data }: AnalysisComparisonChartProps) {
    const theme = useTheme()
    const apexchartProps = useMemo(() => {
        let apexChartsAxisValues: ApexAxisChartSeries = convertMetricsDataToApexChartsDateTimeAxisValues(data)

        return getApexChartAnalysisComparisonProps({
            yAxisSeries: apexChartsAxisValues,
            theme,
        })
    }, [data, theme])

    return <ReactApexChart {...apexchartProps} width={'100%'} height={'100%'} type="bar" />
}
