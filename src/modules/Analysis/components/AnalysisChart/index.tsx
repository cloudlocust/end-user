import React, { useMemo } from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import 'src/modules/Analysis/components/AnalysisChart/AnalysisChart.scss'
import { IMetric } from 'src/modules/Metrics/Metrics.d'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { convertMetricsDataToApexChartsAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import ReactECharts from 'echarts-for-react'
import { getEchartsAnalysisChartOptions } from 'src/modules/Analysis/components/AnalysisChart/analysisChartOptions'
import { DefaultLabelFormatterCallbackParams } from 'echarts'
import { identity, indexOf, maxBy, minBy } from 'lodash'
import { analysisInformationName } from 'src/modules/Analysis/analysisTypes'

/**
 * Analysis Polar Area Chart.
 *
 * @param props N/A.
 * @param props.data Data received from backend of format IMetric[].
 * @param props.setActiveBarType A setter to set if the selected bar is the max, the medium or the smallest.
 * @param props.children Represent the content put inside the circle center of AnalysisChart.
 * @returns AnalysisChart.
 */
const AnalysisChart = ({
    data,
    setActiveBarType,
    children,
}: /**
 */
{
    /**
     * Metric Data.
     */
    data: IMetric[]
    /**
     * Function to set if the selected bar is the max, the medium or the smallest.
     */
    setActiveBarType: (type: analysisInformationName) => void
    /**
     * Div circle content to put inside the chart.
     */
    children: JSX.Element
}) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

    const [values, timeStamps] = useMemo(() => {
        // Represents the consumption values in yAxisSeries, and their timestamp in xAxisSeries
        // TODO - rename the convert function
        let { yAxisSeries, xAxisSeries } = convertMetricsDataToApexChartsAxisValues(data)

        return data.length ? [yAxisSeries[0].data as ApexNonAxisChartSeries, xAxisSeries[0]] : [[], []]
    }, [data])

    // EchartsProductionChart Option.
    const option = useMemo(() => {
        return getEchartsAnalysisChartOptions(values, timeStamps, theme)
    }, [values, timeStamps, theme])

    const [minValueIndex, maxValueIndex] = useMemo(() => {
        return [indexOf(values, minBy(values, identity)), indexOf(values, maxBy(values, identity))]
    }, [values])

    /**
     * Function to handle onClick event on bar.
     *
     * @param params Params that are passed from the chart when clicking.
     */
    const handleBarClick = (params: DefaultLabelFormatterCallbackParams) => {
        if (params.dataIndex === minValueIndex) setActiveBarType('minConsumptionDay')
        else if (params.dataIndex === maxValueIndex) setActiveBarType('maxConsumptionDay')
        else setActiveBarType('meanConsumption')
    }

    if (values.length === 0) {
        return (
            <div style={{ height: '200px' }} className="p-24 flex flex-col justify-center items-center ">
                <TypographyFormatMessage className="sm:text-16 font-medium md:text-20">
                    Aucune donnée disponible
                </TypographyFormatMessage>
            </div>
        )
    }

    return (
        <div className="analysisChartContainer flex justify-center items-center w-full md:px-24">
            <ReactECharts
                opts={{
                    renderer: 'svg',
                }}
                onEvents={{ click: handleBarClick }}
                option={option}
                style={{ height: isMobile ? 360 : 520, width: '100%' }}
            />
            <div
                className="analysisChartCircleContent absolute p-4 flex justify-center items-center"
                style={{ background: theme.palette.background.paper }}
            >
                {children}
            </div>
        </div>
    )
}

// the React.memo is to prevent re-rendering unless the second condition is fullfilled, in the case the changing of data
export default React.memo(AnalysisChart, (prevProps, nextProps) => prevProps.data === nextProps.data)
