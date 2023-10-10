import { useTheme } from '@mui/material'
import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { AnalysisComparisonChartProps } from 'src/modules/Analysis/components/AnalysisComparisonChart/analysisComparisonChart'
import { getEchartsComparaisonChartOptions } from './echartsComparaisonChartOptions'

/**
 * AnalysisComparisonChart component.
 *
 * @param param0 N/A.
 * @param param0.data Metrics data.
 * @returns ReactApexChart.
 */
export default function EchartsAnalysisComparisonChart({ data }: AnalysisComparisonChartProps) {
    const theme = useTheme()

    // EchartsComparaisonChart Option.
    const option = useMemo(() => {
        return getEchartsComparaisonChartOptions(data, theme)
    }, [data, theme])

    return (
        <>
            <ReactECharts
                opts={{
                    renderer: 'svg',
                }}
                option={option}
                style={{ height: 360, margin: '0 auto', width: '100%' }}
            />
        </>
    )
}
