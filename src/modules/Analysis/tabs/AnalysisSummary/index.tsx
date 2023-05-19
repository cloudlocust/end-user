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
// import AnalysisChartCircleContent from 'src/modules/Analysis/components/AnalysisChartCircleContent'
import { MissingHousingMeterErrorMessage } from 'src/modules/MyConsumption/utils/ErrorMessages'
import { MissingContractsWarning } from 'src/modules/Analysis/utils/ErrorMessages'

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
        // filters,
        currentHousing,
        nrlinkConsent,
        enedisSgeConsent,
        hasMissingHousingContracts,
        isMetricsLoading,
    } = props
    const theme = useTheme()
    const [activeInformationName, setActiveInformationName] = useState<analysisInformationName | undefined>(undefined)
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

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
                        {/* TODO Decomment on next PR */}
                        {/* <AnalysisChartCircleContent
                            dateReferenceConsumptionValue={new Date(range.from)}
                            filters={filters}
                        /> */}
                        <></>
                    </AnalysisChart>
                )}
            </div>
            {!isMetricsLoading && (
                <div className="p-24 analysis-information-list">
                    <AnalysisInformationList activeInformationName={activeInformationName} data={data} range={range} />
                    {/* Consommation de veille. */}
                    {/* TODO change totalConsumption on next PR */}
                    <AnalysisIdleConsumption data={data} totalConsumption={{ unit: 'Wh', value: 0 }} />
                    {enedisSgeConsent?.enedisSgeConsentState === 'CONNECTED' && (
                        <AnalysisMaxPower data={data} housingId={currentHousing!.id} />
                    )}
                </div>
            )}
        </>
    )
}
