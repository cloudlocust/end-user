import { useEffect, useRef } from 'react'
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
    let values: ApexNonAxisChartSeries =
        data.length > 0
            ? getDataFromYAxis(data, metricTargetsEnum.consumption).map((val) => convert(val).from('Wh').to('kWh'))
            : []

    useEffect(() => {
        if (
            analysisChartContainerRef.current &&
            analysisChartContainerRef.current.getElementsByClassName(analysisChartClassname)[0] &&
            analysisChartContainerRef.current.getElementsByClassName(analysisChartClassname)[0].getBoundingClientRect()
                .height !== 0
        ) {
            const analysisPolarAreaChartRec = analysisChartContainerRef.current
                .getElementsByClassName(analysisChartClassname)[0]
                .getBoundingClientRect()
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
