import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { formatMetricsDataToTimestampsValues } from 'src/modules/Metrics/formatMetricsData'
import { useTheme } from '@mui/material/styles'
import { ConsumptionChartProps } from 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChartTypes.d'
import { getEchartsConsumptionChartOptions } from 'src/modules/MyConsumption/components/MyConsumptionChart/consumptionChartOptions'
import { useMediaQuery } from '@mui/material'
import { useMyConsumptionStore } from 'src/modules/MyConsumption/store/myConsumptionStore'

/**
 * Consumption test id.
 */
export const consumptionChartClassName = 'consumption-chart-classname'

/**
 * MyConsumptionChart Component.
 *
 * @param props N/A.
 * @param props.data Data received from backend of format IMetric[].
 * @param props.period Period Type.
 * @returns MyConsumptionChart Component.
 */
const MyConsumptionChart = ({ data, period }: ConsumptionChartProps) => {
    const theme = useTheme()
    const { consumptionToggleButton } = useMyConsumptionStore()

    const { timestamps, values } = useMemo(() => {
        return formatMetricsDataToTimestampsValues(data)
    }, [data])

    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    // EchartsConsumptionChart Option.
    const option = useMemo(() => {
        return getEchartsConsumptionChartOptions(timestamps, values, theme, consumptionToggleButton, isMobile, period)
    }, [timestamps, values, theme, consumptionToggleButton, isMobile, period])

    return (
        <>
            <ReactECharts
                className={consumptionChartClassName}
                opts={{
                    renderer: 'canvas',
                }}
                option={option}
                style={{ height: 360, margin: '0 auto' }}
            />
        </>
    )
}

export default MyConsumptionChart
