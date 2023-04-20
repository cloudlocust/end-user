import { useTheme, Icon } from '@mui/material'
import { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { getApexChartAnalysisComparisonProps } from 'src/modules/Analysis/utils/analysisComparisonOptions'
import { convertMetricsDataToApexChartsDateTimeAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { AnalysisComparisonChartProps } from 'src/modules/Analysis/components/AnalysisComparisonChart/analysisComparisonChart'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * AnalysisComparisonChart component.
 *
 * @param param0 N/A.
 * @param param0.data Metrics data.
 * @returns ReactApexChart.
 */
export default function AnalysisComparisonChart({ data }: AnalysisComparisonChartProps) {
    const consumptionData = useMemo(
        () => data.find((metric) => metric.target === metricTargetsEnum.consumption),
        [data],
    )

    // Check if every day of the month has data
    const isDataPresentInAllDaysOfMonth = consumptionData?.datapoints.every(
        (subArray) => subArray[0] !== undefined && subArray[0] !== null,
    )

    const theme = useTheme()
    const apexchartProps = useMemo(() => {
        let apexChartsAxisValues: ApexAxisChartSeries = convertMetricsDataToApexChartsDateTimeAxisValues(data)

        return getApexChartAnalysisComparisonProps({
            yAxisSeries: apexChartsAxisValues,
            theme,
        })
    }, [data, theme])

    if (!isDataPresentInAllDaysOfMonth)
        return (
            <div style={{ height: '200px' }} className="p-24 flex flex-col justify-center items-center ">
                <Icon style={{ fontSize: '4rem', marginBottom: '1rem', color: theme.palette.secondary.dark }}>
                    error_outline_outlined
                </Icon>

                <TypographyFormatMessage className="text-center">
                    Aucune donnée de comparison disponible
                </TypographyFormatMessage>
            </div>
        )

    return <ReactApexChart {...apexchartProps} width={'100%'} height={'100%'} type="bar" />
}
