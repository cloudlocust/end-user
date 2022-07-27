import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import ReactApexChart from 'react-apexcharts'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import './AnalysisChart.scss'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { getDataFromYAxis } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import convert from 'convert-units'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { getAnalysisApexChartOptions } from 'src/modules/Analysis/utils/analysisApexChartsOptions'
import { normalizeValues } from 'src/modules/Analysis/utils/computationFunctions'

const analysisChartClassname = 'apexcharts-inner apexcharts-graphical'
const analysisChartTooltipClassname = 'apexcharts-tooltip'
/**
 * Analysis Polar Area Chart.
 *
 * @param props N/A.
 * @param props.data Data received from backend of format IMetric[].
 * @param props.children Represent the content put inside the circle center of AnalysisChart.
 * @returns AnalysisChart.
 */
const AnalysisChart = ({
    data,
    children,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    data: IMetric[]
    // eslint-disable-next-line jsdoc/require-jsdoc
    children: JSX.Element
}) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const analysisChartContainerRef = useRef<HTMLDivElement>(null)
    const analysisChartCircleContentRef = useRef<HTMLDivElement>(null)
    // Getting consumption values from data.
    let values: ApexNonAxisChartSeries =
        data.length > 0
            ? getDataFromYAxis(data, metricTargetsEnum.consumption).map((val) => convert(val).from('Wh').to('kWh'))
            : []

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
            // Because ApexChart PolarArea div will have a height different from the container, the CircleContent won't be centered in the polarArea chart unless the container have the same height as the circle content.
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

    const analysisApexChartOptions = getAnalysisApexChartOptions(values, theme)

    analysisApexChartOptions.chart!.events = {
        /**
         * Showing tooltip when clicking selecting an element in the polarArea chart, this is mostly for mobile because tooltip doesn't show only if we click on element.
         *
         * @param e DOM Element clicked on, it can represent each element in the polarArea chart, or the chart container.
         */
        dataPointSelection(e) {
            const tooltipContainerElement = document.getElementsByClassName(
                analysisChartTooltipClassname,
            )[0] as HTMLDivElement
            const activeTooltipClassname = 'apexcharts-active'
            const activeTooltipElement = tooltipContainerElement.firstElementChild as HTMLDivElement

            // If we click an element on the chart, we show tooltip
            tooltipContainerElement.style!.left = `${e.offsetX - 40}px`
            tooltipContainerElement.style!.top = `${e.offsetY - 40}px`
            tooltipContainerElement.classList.add(activeTooltipClassname)
            tooltipContainerElement.style.display = 'flex'
            const indexActiveElement = e.target.className.baseVal.slice(-1)
            // If the element is already highlighted
            if (e.target.instance.filterer) {
                const textNodeActiveTooltipElement = React.createElement(
                    'span',
                    {},
                    `${values[indexActiveElement].toFixed(2)} kWh`,
                )
                ReactDOM.render(
                    textNodeActiveTooltipElement,
                    activeTooltipElement.querySelector('.apexcharts-tooltip-text-y-value'),
                )
                activeTooltipElement.style.background = theme.palette.primary.main
                activeTooltipElement.style.display = 'flex'
                activeTooltipElement.classList.add(activeTooltipClassname)
            } else {
                tooltipContainerElement.classList.remove(activeTooltipClassname)
                tooltipContainerElement.style.display = 'none'
            }
        },
    }

    // normalize values to [200, 150], to improve polarArea chart and show all values from min to max.
    // Values taken of min: 150, max: 200, makes the bars big enough for the lowest value, while being able to show the CircleContent inside the chart.
    const series = normalizeValues(values, 150, 200)

    return (
        <div className="analysisChartContainer px-24" ref={analysisChartContainerRef}>
            <ReactApexChart
                options={analysisApexChartOptions}
                series={series}
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
