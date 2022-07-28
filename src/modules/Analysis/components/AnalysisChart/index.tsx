import React, { useEffect, useRef } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import './AnalysisChart.scss'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { getDataFromYAxis } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import convert from 'convert-units'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { getAnalysisApexChartProps } from 'src/modules/Analysis/utils/analysisApexChartsProps'
import AnalysisChartTooltip from './AnalysisChartTooltip'
import { renderToString } from 'react-dom/server'

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
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
    const analysisChartContainerRef = useRef<HTMLDivElement>(null)
    const analysisChartCircleContentRef = useRef<HTMLDivElement>(null)

    // Getting consumption values from data.
    let values: ApexNonAxisChartSeries = data.length ? getDataFromYAxis(data, metricTargetsEnum.consumption) : []

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

    values = values.map((val) => convert(val).from('Wh').to('kWh'))
    const analysisApexChartProps = getAnalysisApexChartProps(
        // We convert Wh to kWh as analysisChart shows kWh tooltip values.
        values,
        theme,
    )

    if (isMobile) {
        analysisApexChartProps.options.chart!.events = {
            /**
             * Generating and showin a tooltip on Mobile, when selecting an element because Apexcharts in its default behaviour, it doesn't show tooltip onClick only on hover which doesn't exist on mobile.
             *
             * @param e Event of selected value.
             */
            dataPointSelection(e) {
                const tooltipContainerElement = document.getElementsByClassName(
                    analysisChartTooltipClassname,
                )[0] as HTMLDivElement
                // Serie Element will have ClassList[1] as follow apexcharts-polararea-slice-18
                const valueIndex = Number(e.target.classList[1].split('-').slice(-1))
                // If the element is selected
                if (e.target.instance.filterer) {
                    // Positioning the tooltip close to the click
                    tooltipContainerElement.style!.left = `${e.offsetX - 40}px`
                    tooltipContainerElement.style!.top = `${e.offsetY - 40}px`
                    // Rendering the tooltip text
                    tooltipContainerElement.innerHTML = renderToString(
                        <AnalysisChartTooltip valueIndex={valueIndex} values={values} theme={theme} />,
                    )
                    // Displaying the tooltip
                    tooltipContainerElement.classList.add('apexcharts-active')
                    tooltipContainerElement.style.display = 'flex'
                }
                // If the element is deselected
                else {
                    // Hide tooltip
                    tooltipContainerElement.style.display = 'none'
                    // Remove tooltip text is needed because we can have a behaviour where we store not related tooltip text
                    tooltipContainerElement.innerHTML = ''
                }
            },
        }
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
