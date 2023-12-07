import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { formatMetricsDataToTimestampsValues } from 'src/modules/Metrics/formatMetricsData'
import { useTheme } from '@mui/material/styles'
import { ConsumptionChartProps } from 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChartTypes.d'
import { getEchartsConsumptionChartOptions } from 'src/modules/MyConsumption/components/MyConsumptionChart/consumptionChartOptions'
import { useMediaQuery } from '@mui/material'

/**
 * Consumption test id.
 */
export const consumptionChartClassName = 'consumption-chart-classname'

/**
 * MyConsumptionChart Component.
 *
 * @param props N/A.
 * @param props.data Data received from backend of format IMetric[].
 * @param props.isSolarProductionConsentOff Boolean indicating if solar production consent is off.
 * @param props.period Period Type.
 * @param props.axisColor Axis Color.
 * @returns MyConsumptionChart Component.
 */
const MyConsumptionChart = ({ data, isSolarProductionConsentOff, period, axisColor }: ConsumptionChartProps) => {
    const theme = useTheme()
    const { timestamps, values } = useMemo(() => {
        return formatMetricsDataToTimestampsValues(data)
    }, [data])

    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

    // EchartsConsumptionChart Option.
    const option = useMemo(() => {
        return getEchartsConsumptionChartOptions(
            timestamps,
            values,
            theme,
            isSolarProductionConsentOff,
            isMobile,
            period,
            axisColor,
        )
    }, [timestamps, values, theme, isSolarProductionConsentOff, isMobile, period, axisColor])

    return (
        <>
            <ReactECharts
                className={consumptionChartClassName}
                opts={{
                    renderer: 'canvas',
                }}
                option={option}
                style={{ height: 'auto', margin: '0 auto' }}
            />
        </>
    )
}

export default MyConsumptionChart
