import { useTheme, Icon } from '@mui/material'
import { useMemo } from 'react'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import AnalysisComparisonChart from 'src/modules/Analysis/components/AnalysisComparisonChart'
import { AnalysisComparisonProps } from 'src/modules/Analysis/tabs/AnalysisComparison/analysisComparison'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { linksColor, warningMainHashColor } from 'src/modules/utils/muiThemeVariables'

const AnalysisCTAColor = linksColor || warningMainHashColor

/**
 * Analyse comparison tab component.
 *
 * @param root0 N/A.
 * @param root0.data Metrics data.
 * @returns Analuse Comparison JSX.
 */
export default function AnalysisComparison({ data }: AnalysisComparisonProps) {
    const theme = useTheme()

    const consumptionData = useMemo(
        () => data.find((metric) => metric.target === metricTargetsEnum.consumption),
        [data],
    )

    // Check if every day of the month has data
    const isDataPresentInAllDaysOfMonth = consumptionData?.datapoints.every(
        (subArray) => subArray[0] !== undefined && subArray[0] !== null,
    )

    if (!isDataPresentInAllDaysOfMonth) {
        return (
            <div style={{ height: '200px' }} className="p-24 flex flex-col justify-center items-center ">
                <Icon style={{ fontSize: '4rem', marginBottom: '1rem', color: AnalysisCTAColor }}>
                    error_outline_outlined
                </Icon>

                <TypographyFormatMessage className="text-center" sx={{ color: AnalysisCTAColor }}>
                    Aucune donnée de comparaison disponible
                </TypographyFormatMessage>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full">
            <div className="flex justify-center md:justify-start w-full text-center md:text-left mb-20">
                <TypographyFormatMessage
                    className="sm:text-16 font-medium md:text-20"
                    style={{ color: theme.palette.common.black }}
                >
                    Comparaison de ma consommation globale à un même type de foyer
                </TypographyFormatMessage>
            </div>
            <AnalysisComparisonChart data={data} />
        </div>
    )
}
