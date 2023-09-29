import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { formatMetricsDataToTimestampsValues } from 'src/modules/Metrics/formatMetricsData'
import { useTheme } from '@mui/material/styles'
import 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChart.scss'
import { EchartsConsumptionChartProps } from 'src/modules/MyConsumption/myConsumptionTypes'
import { getEchartsConsumptionChartOptions } from 'src/modules/MyConsumption/utils/echartsConsumptionChartOptions'

/**
 * EchartsConsumptionChart Component.
 *
 * @param props N/A.
 * @param props.data Data received from backend of format IMetric[].
 * @param props.isSolarProductionConsentOff Boolean indicating if solar production consent is off.
 * @returns EchartsConsumptionChart Component.
 */
const EchartsConsumptionChart = ({ data, isSolarProductionConsentOff }: EchartsConsumptionChartProps) => {
    const theme = useTheme()
    const { timestamps, values } = useMemo(() => {
        return formatMetricsDataToTimestampsValues(data)
    }, [data])

    // EchartsConsumptionChart Option.
    const option = useMemo(() => {
        return getEchartsConsumptionChartOptions(timestamps, values, theme, isSolarProductionConsentOff)
    }, [timestamps, values, theme, isSolarProductionConsentOff])
    console.log('🚀 ~ file: EchartsConsumptionChart.tsx:27 ~ option ~ option:', option)

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

export default EchartsConsumptionChart
