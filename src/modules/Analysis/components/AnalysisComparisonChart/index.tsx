import { useTheme } from '@mui/material'
import { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { getApexChartAnalysisComparisonProps } from 'src/modules/Analysis/utils/analysisComparisonOptions'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { convertMetricsDataToApexChartsDateTimeAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import useMediaQuery from '@mui/material/useMediaQuery'

/**
 * AnalysisComparisonChart component.
 *
 * @param param0 N/A.
 * @param param0.data Metrics data.
 * @returns ReactApexChart.
 */
export default function AnalysisComparisonChart({
    data,
}: /**
 *
 */
{
    /**
     *
     */
    data: IMetric[]
}) {
    const theme = useTheme()
    const isModile = useMediaQuery(theme.breakpoints.up('sm'))
    const apexchartProps = useMemo(() => {
        let apexChartsAxisValues: ApexAxisChartSeries = convertMetricsDataToApexChartsDateTimeAxisValues(data)

        return getApexChartAnalysisComparisonProps({
            yAxisSeries: apexChartsAxisValues.filter((metric) => metric.name === metricTargetsEnum.consumption),
            theme,
        })
    }, [data, theme])

    return <ReactApexChart {...apexchartProps} width={'100%'} height={isModile ? '100%' : '300px'} type="bar" />
}
