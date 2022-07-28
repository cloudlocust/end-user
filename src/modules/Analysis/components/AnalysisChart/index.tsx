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

const analysisChartClassname = 'apexcharts-inner apexcharts-graphical'

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
    const values: ApexNonAxisChartSeries = data.length ? getDataFromYAxis(data, metricTargetsEnum.consumption) : []

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

    const analysisApexChartProps = getAnalysisApexChartProps(
        // We convert Wh to kWh as analysisChart shows kWh tooltip values.
        values.map((val) => convert(val).from('Wh').to('kWh')),
        theme,
    )

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
