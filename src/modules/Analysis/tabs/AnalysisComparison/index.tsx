import { useTheme } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import AnalysisComparisonChart from 'src/modules/Analysis/components/AnalysisComparisonChart'
import { AnalysisComparisonProps } from 'src/modules/Analysis/tabs/AnalysisComparison/analysisComparison'

/**
 * Analyse comparison tab component.
 *
 * @param root0 N/A.
 * @param root0.data Metrics data.
 * @param root0.enedisSgeConsent Enedis sge consent status.
 * @param root0.range Metric range.
 * @returns Analuse Comparison JSX.
 */
export default function AnalysisComparison({ data, enedisSgeConsent, range }: AnalysisComparisonProps) {
    const theme = useTheme()

    return (
        <div className="flex flex-col w-full">
            <div className="flex justify-center md:justify-start w-full text-center md:text-left mb-20">
                <TypographyFormatMessage
                    className="text-15 md:text-18"
                    style={{ color: theme.palette.common.black }}
                    fontWeight={500}
                >
                    Comparaison de ma consommation globale à un même type de foyer
                </TypographyFormatMessage>
            </div>
            <AnalysisComparisonChart data={data} />
        </div>
    )
}
