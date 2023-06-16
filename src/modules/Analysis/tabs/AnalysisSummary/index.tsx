import { useState } from 'react'
import { useTheme } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import AnalysisInformationList from 'src/modules/Analysis/components/AnalysisInformationList'
import AnalysisChart from 'src/modules/Analysis/components/AnalysisChart'
import { analysisInformationName } from 'src/modules/Analysis/analysisTypes.d'
import useMediaQuery from '@mui/material/useMediaQuery'
import { AnalysisSummaryProps } from 'src/modules/Analysis/tabs/AnalysisSummary/AnalysisSummary'
import { AnalysisMaxPower } from 'src/modules/Analysis/components/AnalysisMaxPower'
import { linksColor, warningMainHashColor } from 'src/modules/utils/muiThemeVariables'
import { AnalysisIdleConsumption } from 'src/modules/Analysis/components/AnalysisIdleConsumption'
import AnalysisChartCircleContent from 'src/modules/Analysis/components/AnalysisChartCircleContent'
import { MissingHousingMeterErrorMessage } from 'src/modules/MyConsumption/utils/ErrorMessages'
import { MissingContractsWarning } from 'src/modules/Analysis/utils/ErrorMessages'
import { useAnalysisStore } from 'src/modules/Analysis/store/analysisStore'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { computeTotalConsumption } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import Box from '@mui/material/Box'

// eslint-disable-next-line jsdoc/require-jsdoc
export const AnalysisCTAColor = linksColor || warningMainHashColor

/**
 * Analysis.
 * Parent component.
 *
 * @param props Props.
 * @returns Analysis and its children.
 */
export default function AnalysisSummary(props: AnalysisSummaryProps) {
    const {
        data,
        range,
        filters,
        currentHousing,
        nrlinkConsent,
        enedisSgeConsent,
        hasMissingHousingContracts,
        isMetricsLoading,
    } = props
    const theme = useTheme()
    const [activeInformationName, setActiveInformationName] = useState<analysisInformationName | undefined>(undefined)
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

    const totalConsumption = useAnalysisStore((state) => state.totalConsumption)

    /**
     * Handler to set the correct information name (min, max, mean) Based on the selected value element fill color in analysisChart.
     *
     * @param color Fill Color of the selected value element.
     */
    const getSelectedValueElementColor = (color: string) => {
        switch (color) {
            case theme.palette.primary.light:
                setActiveInformationName('minConsumptionDay')
                break
            case theme.palette.primary.dark:
                setActiveInformationName('maxConsumptionDay')
                break
            default:
                setActiveInformationName('meanConsumption')
        }
    }

    // By checking if the metersList is true we make sure that if someone has skipped the step of connecting their PDL, they will see this error message.
    // Else if they have a PDL, we check its consent.
    if (
        (nrlinkConsent?.nrlinkConsentState === 'NONEXISTENT' &&
            enedisSgeConsent?.enedisSgeConsentState === 'NONEXISTENT') ||
        (currentHousing && !currentHousing.meter)
    ) {
        return <MissingHousingMeterErrorMessage />
    }

    // Check if there's no consumption Data
    if (!isMetricsLoading && (data.length === 0 || computeTotalConsumption(data).value === 0))
        return (
            <Box className="h-full flex justify-center items-center ">
                <TypographyFormatMessage className="sm:text-16 font-medium md:text-20">
                    Aucune donnée disponible
                </TypographyFormatMessage>
            </Box>
        )

    return (
        <>
            {hasMissingHousingContracts && <MissingContractsWarning />}

            <div style={{ position: 'relative' }}>
                {isMetricsLoading ? (
                    <div
                        style={{ height: isMobile ? '360px' : '520px' }}
                        className="p-24 CircularProgress flex flex-col justify-center items-center "
                    >
                        <CircularProgress style={{ color: theme.palette.primary.main }} />
                    </div>
                ) : (
                    <AnalysisChart data={data} getSelectedValueElementColor={getSelectedValueElementColor}>
                        <AnalysisChartCircleContent
                            dateReferenceConsumptionValue={new Date(range.from)}
                            filters={filters}
                        />
                    </AnalysisChart>
                )}
            </div>
            {!isMetricsLoading && (
                <div className="p-24 analysis-information-list">
                    <AnalysisInformationList activeInformationName={activeInformationName} data={data} range={range} />
                    <AnalysisIdleConsumption totalConsumption={totalConsumption} {...{ range, filters }} />
                    {enedisSgeConsent?.enedisSgeConsentState === 'CONNECTED' && (
                        <AnalysisMaxPower data={data} housingId={currentHousing!.id} />
                    )}
                </div>
            )}
        </>
    )
}
