import React, { useRef } from 'react'
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

// In order to center the content in apexcharts, we need to get the apexcharts container height, and then center our content, additionally the apexcharts will be shifted a bit from top so we need to shift our content with the same amount in order to finally center it according to apexcharts.
const apexchartsContainerClassname = 'apexcharts-inner apexcharts-graphical'
const apexchartsClassname = 'apexcharts-pie'

/**
 * Analysis Polar Area Chart.
 *
 * @param props N/A.
 * @param props.data Data received from backend of format IMetric[].
 * @param props.children Represent the content put inside the circle center of AnalysisChart.
 * @param props.getSelectedValueElementColor Indicate the color of the selectedValueElement so that we can match the color with the information (minConsumptionDay, maxConsumptionDay, meanConsumption).
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

    /**
     * This function is used to do some styling, in order to dynamically style the CircleContent in the middle of the analysisChart, whenever apexcharts graphical is updated.
     */
    const centerCircleContentInApexcharts = () => {
        if (
            data.length &&
            analysisChartContainerRef.current &&
            analysisChartCircleContentRef.current &&
            analysisChartContainerRef.current.getElementsByClassName(apexchartsContainerClassname)[0] &&
            analysisChartContainerRef.current
                .getElementsByClassName(apexchartsContainerClassname)[0]
                .getBoundingClientRect().height !== 0 &&
            analysisChartContainerRef.current.getElementsByClassName(apexchartsClassname)[0] &&
            analysisChartContainerRef.current.getElementsByClassName(apexchartsClassname)[0].getBoundingClientRect()
        ) {
            const apexchartsContainerRect = analysisChartContainerRef.current
                .getElementsByClassName(apexchartsContainerClassname)[0]
                .getBoundingClientRect()
            const apexchartsRect = analysisChartContainerRef.current
                .getElementsByClassName(apexchartsClassname)[0]
                .getBoundingClientRect()
            // The CircleContent won't be centered in apexcharts unless our div container have the same height as the apexcharts container.
            analysisChartContainerRef.current.style!.height = `${apexchartsContainerRect.height}px`
            // Additionally the apexcharts will be shifted a bit from top of apexchartsContainer so we need to shift our content with the same amount to our div container in order to finally center it according to apexcharts.
            analysisChartCircleContentRef.current.style!.bottom = `calc(50% - ${
                (apexchartsRect.top - apexchartsContainerRect.top) / 2
            }px)`
        }
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
            // The order change of analysisInformationList doesn't happen on hover in chart (mouseenter), but on click and selection.
            // Check that it's not mouse hover.
            if (e.type !== 'mouseenter') {
                // configs.w.config.colors, represent the analysisChart options.colors that will have colors for all element in the analysishart.
                // Including the minConsumptionDay in options.color will have theme.primary.light
                // maxConsumptionDay have theme.primary.dark
                getSelectedValueElementColor(configs.w.config.colors[indexSelectedValue])
            }
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
        /**
         * Center circle content whenever apexcharts finishes drawing on the map.
         *
         * @param chart Chart context.
         * @param options Config options.
         */
        animationEnd(chart, options) {
            centerCircleContentInApexcharts()
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
