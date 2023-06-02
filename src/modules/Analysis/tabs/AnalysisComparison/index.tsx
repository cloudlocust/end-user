import { endOfMonth, startOfMonth, subYears } from 'date-fns'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import AnalysisComparisonChart from 'src/modules/Analysis/components/AnalysisComparisonChart'
import { AnalysisComparisonProps } from 'src/modules/Analysis/tabs/AnalysisComparison/analysisComparison'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { getDateWithoutTimezoneOffset } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { getDataCorrespendingToRange } from 'src/modules/Analysis/utils/computationFunctions'
import { AnalysisCTAColor } from 'src/modules/Analysis/tabs/AnalysisSummary'
import { Icon } from '@mui/material'

/**
 * Analyse comparison tab component.
 
 * @param root0 N/A.
 * @param root0.filters Metrics filters. This should have the meter guid retrieved from the parent. To be paassed to retrieve metrics of the year.
 * @param root0.monthlyRange Monthly range passed by the parent, to be compared to retrieve data correspending with that range.
 * @returns Analuse Comparison JSX.
 */
export default function AnalysisComparison({ filters, monthlyRange }: AnalysisComparisonProps) {
    const { data: metricsData } = useMetrics(
        {
            interval: '1M',
            range: {
                from: getDateWithoutTimezoneOffset(startOfMonth(subYears(new Date(), 1))),
                to: getDateWithoutTimezoneOffset(endOfMonth(new Date())),
            },
            targets: [
                {
                    target: metricTargetsEnum.consumption,
                    type: 'timeserie',
                },
            ],
            filters,
        },
        Boolean(filters.length),
    )

    const data = getDataCorrespendingToRange(metricsData!, monthlyRange, metricTargetsEnum.consumption)

    if (!data[0].datapoints[0][0]) {
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
            <div className="flex justify-center w-full text-center md:text-left mb-20">
                <TypographyFormatMessage
                    className="sm:text-16 font-medium md:text-20"
                    style={{ color: 'theme.palette.common.black' }}
                >
                    Comparaison de ma consommation globale à un même type de foyer
                </TypographyFormatMessage>
            </div>
            <AnalysisComparisonChart data={data} />
        </div>
    )
}
