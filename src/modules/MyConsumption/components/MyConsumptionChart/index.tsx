import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { formatMetricsDataToTimestampsValues } from 'src/modules/Metrics/formatMetricsData'
import { useTheme } from '@mui/material/styles'
import { ConsumptionChartProps } from 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChartTypes.d'
import { getEchartsConsumptionChartOptions } from 'src/modules/MyConsumption/components/MyConsumptionChart/consumptionChartOptions'

/**
 * MyConsumptionChart Component.
 *
 * @param props N/A.
 * @param props.data Data received from backend of format IMetric[].
 * @param props.isSolarProductionConsentOff Boolean indicating if solar production consent is off.
 * @returns MyConsumptionChart Component.
 */
const MyConsumptionChart = ({ data, isSolarProductionConsentOff }: ConsumptionChartProps) => {
    const theme = useTheme()
    const { timestamps, values } = useMemo(() => {
        return formatMetricsDataToTimestampsValues(data)
    }, [data])

    // EchartsConsumptionChart Option.
    const option = useMemo(() => {
        return getEchartsConsumptionChartOptions(timestamps, values, theme, isSolarProductionConsentOff)
    }, [timestamps, values, theme, isSolarProductionConsentOff])

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

export default MyConsumptionChart
