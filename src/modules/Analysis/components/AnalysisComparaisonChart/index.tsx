import { useTheme } from '@mui/material'
import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { AnalysisComparisonChartProps } from 'src/modules/Analysis/components/AnalysisComparaisonChart/AnalysisComparaisonChartTypes.d'
import { getEchartsComparaisonChartOptions } from './comparaisonChartOptions'

/**
 * AnalysisComparisonChart component.
 *
 * @param param0 N/A.
 * @param param0.data Metrics data.
 * @returns ReactEcharts.
 */
export default function AnalysisComparisonChart({ data }: AnalysisComparisonChartProps) {
    const theme = useTheme()

    // EchartsComparaisonChart Option.
    const option = useMemo(() => {
        return getEchartsComparaisonChartOptions(data, theme)
    }, [data, theme])

    return (
        <>
            <ReactECharts
                opts={{
                    renderer: 'canvas',
                }}
                option={option}
                style={{ height: 360, margin: '0 auto', width: '100%' }}
            />
        </>
    )
}
