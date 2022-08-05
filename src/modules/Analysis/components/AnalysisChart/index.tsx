import React, { useEffect, useRef } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import './AnalysisChart.scss'
import { IMetric } from 'src/modules/Metrics/Metrics.d'
import convert from 'convert-units'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import {
    addAnalysisChartSelectedValueStroke,
    getAnalysisApexChartProps,
    showAnalysisChartTooltipOnValueSelected,
} from 'src/modules/Analysis/utils/analysisApexChartsProps'
import { convertMetricsDataToApexChartsAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { ApexChartsAxisValuesType } from 'src/modules/MyConsumption/myConsumptionTypes'

const analysisChartClassname = 'apexcharts-inner apexcharts-graphical'

/**
 * Analysis Polar Area Chart.
 *
 * @param props N/A.
 * @param props.data Data received from backend of format IMetric[].
 * @param props.children Represent the content put inside the circle center of AnalysisChart.
 * @param props.getSelectedValueElementColor Indicate the color of the selectedValueElement so that we can match it to its .
 * @returns AnalysisChart.
 */
const AnalysisChart = ({
    data,
    children,
    getSelectedValueElementColor,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    data: IMetric[]
    // eslint-disable-next-line jsdoc/require-jsdoc
    children: JSX.Element
    // eslint-disable-next-line jsdoc/require-jsdoc
    getSelectedValueElementColor: (color: string) => void
}) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
    const analysisChartContainerRef = useRef<HTMLDivElement>(null)
    const analysisChartCircleContentRef = useRef<HTMLDivElement>(null)

    // Represents the consumption values in yAxisSeries, and their timestamp in xAxisSeries
    let { yAxisSeries, xAxisSeries }: ApexChartsAxisValuesType = convertMetricsDataToApexChartsAxisValues(data)
    let [values, timeStampValues] = data.length
        ? [yAxisSeries[0].data as ApexNonAxisChartSeries, xAxisSeries[0]]
        : [[], []]

    useEffect(() => {
        // This UseEffect is used to do some styling, in order to dynamically style the CircleContent in the middle of the analysisChart.
        if (
            analysisChartContainerRef.current &&
            analysisChartContainerRef.current.getElementsByClassName(analysisChartClassname)[0] &&
            analysisChartContainerRef.current.getElementsByClassName(analysisChartClassname)[0].getBoundingClientRect()
                .height !== 0
        ) {
            const analysisPolarAreaChartRec = analysisChartContainerRef.current
                .getElementsByClassName(analysisChartClassname)[0]
                .getBoundingClientRect()
            // Because ApexChart PolarArea div will have a height different from the container, the CircleContent won't be centered in the polarArea chart unless the container have the same height as the PolarArea div.
            analysisChartContainerRef.current.style!.height = `${analysisPolarAreaChartRec.height}px`
        }
    })

    if (values.length === 0) {
        return (
            <div style={{ height: '200px' }} className="p-24 flex flex-col justify-center items-center ">
                <TypographyFormatMessage className="sm:text-16 font-medium md:text-20">
                    Aucune donnée disponible
                </TypographyFormatMessage>
            </div>
        )
    }

    // We convert Wh to kWh as analysisChart shows kWh tooltip values.
    values = values.map((val) => convert(val).from('Wh').to('kWh'))

    const analysisApexChartProps = getAnalysisApexChartProps(values, timeStampValues, theme)

    analysisApexChartProps.options.chart!.events = {
        /**
         * Generating and showin a tooltip on Mobile, when selecting an element because Apexcharts in its default behaviour, it doesn't show tooltip onClick only on hover which doesn't exist on mobile.
         *
         * @param e Event of selected value.
         * @param chartContext Chart context.
         * @param configs Current chart configs options, with information about the index of selected value in (dataPointIndex).
         */
        dataPointSelection(e, chartContext, configs) {
            const indexSelectedValue = configs.dataPointIndex
            showAnalysisChartTooltipOnValueSelected(e, values, timeStampValues, indexSelectedValue, theme)
            addAnalysisChartSelectedValueStroke(
                indexSelectedValue,
                theme.palette.primary.light,
                theme.palette.background.default,
            )
            // configs.w.config.colors, represent the analysisChart options.colors that will have colors for all element in the analysishart.
            // Including the minConsumptionDay which have color of theme.primary.light
            // maxConsumptionDay which have color of theme.primary.dark
            getSelectedValueElementColor(configs.w.config.colors[indexSelectedValue])
        },
        /**
         * Generating and showin a tooltip on Mobile, when selecting an element because Apexcharts in its default behaviour, it doesn't show tooltip onClick only on hover which doesn't exist on mobile.
         *
         * @param e Event of selected value.
         * @param chartContext Chart context.
         * @param config Current chart config options, with information about the index of selected value in (dataPointIndex).
         */
        dataPointMouseEnter(e, chartContext, config) {
            this.dataPointSelection!(e, chartContext, config)
        },
    }

    return (
        <div className="analysisChartContainer px-24" ref={analysisChartContainerRef}>
            <ReactApexChart
                {...analysisApexChartProps}
                type={'polarArea'}
                height={isMobile ? 360 : 520}
                width={'100%'}
            />
            <div
                className="analysisChartCircleContent p-4 flex justify-center items-center"
                ref={analysisChartCircleContentRef}
                style={{ background: theme.palette.background.default }}
            >
                {children}
            </div>
        </div>
    )
}
export default AnalysisChart
