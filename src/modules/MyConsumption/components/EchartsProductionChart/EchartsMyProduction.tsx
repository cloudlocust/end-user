import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { formatMetricsDataToTimestampsValues } from 'src/modules/Metrics/formatMetricsData'
import { useTheme } from '@mui/material/styles'
import 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChart.scss'
import { getEchartsProductionChartOptions } from 'src/modules/MyConsumption/components/EchartsProductionChart/echartsProductionChartOptions'
import { EchartsProductionChartProps } from 'src/modules/MyConsumption/components/EchartsProductionChart/EchartsProductionChartTypes.d'

/**
 * EchartsProductionChart Component.
 *
 * @param props N/A.
 * @param props.data Data received from backend of format IMetric[].
 * @returns EchartsProductionChart Component.
 */
const EchartsProductionChart = ({ data }: EchartsProductionChartProps) => {
    const theme = useTheme()
    const { timestamps, values } = useMemo(() => {
        return formatMetricsDataToTimestampsValues(data)
    }, [data])

    // EchartsProductionChart Option.
    const option = useMemo(() => {
        return getEchartsProductionChartOptions(timestamps, values, theme)
    }, [timestamps, values, theme])

    return (
        <>
            <ReactECharts
                opts={{
                    renderer: 'svg',
                }}
                option={option}
                style={{ height: 360, margin: '0 auto' }}
            />
        </>
    )
}

export default EchartsProductionChart
