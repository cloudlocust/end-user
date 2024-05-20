import { useCallback, useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { SwitchConsumptionButtonTypeEnum } from 'src/modules/MyConsumption/components/SwitchConsumptionButton/SwitchConsumptionButton.types'
import { formatMetricsDataToTimestampsValues } from 'src/modules/Metrics/formatMetricsData'
import { useTheme } from '@mui/material/styles'
import { ConsumptionChartProps } from 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChartTypes.d'
import {
    getEchartsConsumptionChartOptions,
    getXAxisCategoriesData,
} from 'src/modules/MyConsumption/components/MyConsumptionChart/consumptionChartOptions'
import { useMediaQuery } from '@mui/material'
import { PeriodEnum } from '../../myConsumptionTypes.d'
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
 * @param props.axisColor Axis Color depending on the background of the graph.
 * @param props.selectedLabelPeriod Selected Label Period.
 * @param props.chartRef ChartRef.
 * @param props.setInputPeriodTime SetInputPeriodTime.
 * @param props.tooltipFormatter Callback to format the tooltip.
 * @param props.isLabelizationChart Indicates if the chart is for the labelization.
 * @returns MyConsumptionChart Component.
 */
const MyConsumptionChart = ({
    data,
    period,
    axisColor,
    selectedLabelPeriod,
    chartRef,
    setInputPeriodTime,
    tooltipFormatter,
    isLabelizationChart,
}: ConsumptionChartProps) => {
    const theme = useTheme()
    const { consumptionToggleButton } = useMyConsumptionStore()

    const { timestamps, values } = formatMetricsDataToTimestampsValues(data)

    // TODO - Change Echarts options params to use XAxisTimeStamps directly instead of converting it inside the options.
    const xAxisData = useMemo(() => {
        const xAxisTimestamps = Object.values(timestamps).length ? Object.values(timestamps)[0] : [0]
        return getXAxisCategoriesData(xAxisTimestamps, period)
    }, [timestamps, period])

    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    // EchartsConsumptionChart Option.
    const option = useMemo(() => {
        const options = getEchartsConsumptionChartOptions(
            timestamps,
            values,
            theme,
            consumptionToggleButton,
            isMobile,
            period,
            axisColor,
            tooltipFormatter,
            selectedLabelPeriod,
        )
        return {
            ...options,
            ...(isLabelizationChart
                ? {
                      dataZoom: [
                          {
                              type: 'inside',
                              disabled: true,
                          },
                      ],
                  }
                : {}),
        }
    }, [
        timestamps,
        values,
        theme,
        consumptionToggleButton,
        isMobile,
        period,
        axisColor,
        selectedLabelPeriod,
        tooltipFormatter,
        isLabelizationChart,
    ])

    const handleBrushSelected = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (params: any) => {
            if (!params?.areas || period !== PeriodEnum.DAILY) return
            if (setInputPeriodTime && params.areas[0]?.coordRange?.length === 2) {
                // indexs of choosen period
                const startTimeIndex = params.areas[0].coordRange[0]
                const endTimeIndex = params.areas[0].coordRange[1]

                // values of times of choosen period based on indexs
                const startTime = xAxisData[startTimeIndex]
                const endTime = xAxisData[endTimeIndex]
                setInputPeriodTime({
                    startTime,
                    endTime,
                })
            }
        },
        [setInputPeriodTime, period, xAxisData],
    )

    return (
        <>
            <ReactECharts
                className={consumptionChartClassName}
                ref={chartRef}
                opts={{
                    renderer: 'canvas',
                }}
                onEvents={{
                    brush: handleBrushSelected,
                }}
                option={option}
                style={{
                    height:
                        consumptionToggleButton === SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction
                            ? 500
                            : 360,
                }}
            />
        </>
    )
}

export default MyConsumptionChart
