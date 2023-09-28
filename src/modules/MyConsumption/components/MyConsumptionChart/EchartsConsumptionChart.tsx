import React, { useMemo } from 'react'
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
 * @param props.period Indicates the current selected Period if it's monthly or daily or yearly or weekly so that we format tooltip and xAxis of chart according to the period.
 * @param props.range Current range so that we handle the xAxis values according to period and range selected.
 * @param props.isStackedEnabled Boolean state to know whether the stacked option is true or false.
 * @param props.metricsInterval Metrics intervals.
 * @param props.isSolarProductionConsentOff Boolean indicating if solar production consent is off.
 * @returns EchartsConsumptionChart Component.
 */
const EchartsConsumptionChart = ({
    data,
    period,
    range,
    isStackedEnabled,
    metricsInterval,
    isSolarProductionConsentOff,
}: EchartsConsumptionChartProps) => {
    console.log('🚀 ~ file: EchartsConsumptionChart.tsx:29 ~ data:', data)
    const theme = useTheme()
    const { timestamps, values } = useMemo(() => {
        return formatMetricsDataToTimestampsValues(data)
    }, [data])

    // EchartsConsumptionChart Option.
    const option = useMemo(() => {
        return getEchartsConsumptionChartOptions(timestamps, values, theme, isSolarProductionConsentOff)
    }, [timestamps, values, theme, isSolarProductionConsentOff])
    console.log('🚀 ~ file: EchartsConsumptionChart.tsx:38 ~ option ~ option:', option)

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
