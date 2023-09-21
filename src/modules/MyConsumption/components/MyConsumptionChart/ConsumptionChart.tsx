import React, { useRef, useEffect, useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { formatMetricsDataToTimestampsValues } from 'src/modules/Metrics/formatMetricsData'
import { useTheme } from '@mui/material/styles'
import { useIntl } from 'react-intl'
import 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChart.scss'
import { convertMetricsDataToApexChartsDateTimeAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { getApexChartMyConsumptionProps } from 'src/modules/MyConsumption/utils/apexChartsMyConsumptionOptions'
import { MyConsumptionChartProps } from 'src/modules/MyConsumption/myConsumptionTypes'
import { CircularProgress } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { getEchartsConsumptionChartOptions } from 'src/modules/MyConsumption/utils/echartsConsumptionChartOptions'

/**
 * MyConsumptionChart Component.
 *
 * @param props N/A.
 * @param props.data Data received from backend of format IMetric[].
 * @param props.period Indicates the current selected Period if it's monthly or daily or yearly or weekly so that we format tooltip and xAxis of chart according to the period.
 * @param props.range Current range so that we handle the xAxis values according to period and range selected.
 * @param props.isStackedEnabled Boolean state to know whether the stacked option is true or false.
 * @param props.chartType Consumption or production chart type.
 * @param props.chartLabel Chart label according to enphase state.
 * @param props.metricsInterval Metrics intervals.
 * @param props.enphaseOff Enphase consent is not ACTIVE.
 * @returns MyConsumptionChart Component.
 */
const ConsumptionChart = ({
    data,
    period,
    range,
    isStackedEnabled,
    chartType,
    chartLabel,
    metricsInterval,
    enphaseOff,
}: MyConsumptionChartProps) => {
    const theme = useTheme()
    const { timestamps, values } = useMemo(() => {
        return formatMetricsDataToTimestampsValues(data)
    }, [data])

    // ConsumptionChart Option.
    const option = useMemo(() => {
        return getEchartsConsumptionChartOptions(timestamps, values, theme)
    }, [timestamps, values, theme])
    console.log('🚀 ~ file: ConsumptionChart.tsx:47 ~ option ~ option:', option)

    return (
        <>
            <ReactECharts option={option} style={{ height: 700, margin: '0 auto' }} />
        </>
    )
}

export default ConsumptionChart
