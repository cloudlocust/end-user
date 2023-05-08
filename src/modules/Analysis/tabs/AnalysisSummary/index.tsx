import { useState } from 'react'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useTheme } from '@mui/material'
import { Link, NavLink } from 'react-router-dom'
import { Icon, Typography } from 'src/common/ui-kit'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import { useIntl } from 'react-intl'
import CircularProgress from '@mui/material/CircularProgress'
import { subDays } from 'date-fns'
import { computeTotalConsumption, computeTotalEuros } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import AnalysisInformationList from 'src/modules/Analysis/components/AnalysisInformationList'
import AnalysisPercentageChangeArrows from 'src/modules/Analysis/components/AnalysisPercentageChangeArrows'
import convert, { Unit } from 'convert-units'
import AnalysisChart from 'src/modules/Analysis/components/AnalysisChart'
import { analysisInformationName } from 'src/modules/Analysis/analysisTypes.d'
import useMediaQuery from '@mui/material/useMediaQuery'
import { AnalysisSummaryProps } from 'src/modules/Analysis/tabs/AnalysisSummary/AnalysisSummary'
import { AnalysisMaxPower } from 'src/modules/Analysis/components/AnalysisMaxPower'
import { linksColor, warningMainHashColor } from 'src/modules/utils/muiThemeVariables'
import { AnalysisIdleConsumption } from 'src/modules/Analysis/components/AnalysisIdleConsumption'

const AnalysisCTAColor = linksColor || warningMainHashColor

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
    const { formatMessage } = useIntl()
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
        return (
            <div className="container relative h-200 sm:h-256 p-16 sm:p-24 flex-col text-center flex items-center justify-center">
                <>
                    <Icon style={{ fontSize: '4rem', marginBottom: '1rem', color: AnalysisCTAColor }}>
                        error_outline_outlined
                    </Icon>
                </>
                <Typography>
                    {formatMessage({
                        id: "Pour voir votre consommation vous devez d'abord ",
                        defaultMessage: "Pour voir votre consommation vous devez d'abord ",
                    })}
                    <Link
                        to={`/nrlink-connection-steps/${currentHousing?.id}`}
                        className="underline"
                        style={{
                            color: linksColor || theme.palette.primary.main,
                        }}
                    >
                        {formatMessage({
                            id: 'enregistrer votre compteur et votre nrLINK',
                            defaultMessage: 'enregistrer votre compteur et votre nrLINK',
                        })}
                    </Link>
                </Typography>
            </div>
        )
    }

    const totalConsumption = data.length ? computeTotalConsumption(data) : { value: 0, unit: 'kWh' }
    const referenceConsumptionValue = Number(
        convert(totalConsumption.value)
            .from(totalConsumption.unit as Unit)
            .to('Wh'),
    )
    const totalEurosConsumption = data.length ? computeTotalEuros(data) : { value: 0, unit: 'kWh' }

    return (
        <>
            {hasMissingHousingContracts && (
                <div
                    style={{ minHeight: '64px' }}
                    className="w-full relative flex sflex-col justify-center items-center p-16"
                >
                    <div className="flex items-center justify-center flex-col">
                        <ErrorOutlineIcon
                            sx={{
                                color: AnalysisCTAColor,
                                width: { xs: '24px', md: '32px' },
                                height: { xs: '24px', md: '32px' },
                                margin: { xs: '0 0 4px 0', md: '0 8px 0 0' },
                            }}
                        />

                        <div className="w-full">
                            <TypographyFormatMessage
                                sx={{ color: AnalysisCTAColor }}
                                className="text-13 md:text-16 text-center"
                            >
                                Le coût en euros est un exemple. Vos données contractuelles de fourniture d'énergie ne
                                sont pas disponibles sur toute la période.
                            </TypographyFormatMessage>
                            <NavLink to={`${URL_MY_HOUSE}/${currentHousing?.id}/contracts`}>
                                <TypographyFormatMessage
                                    className="underline text-13 md:text-16 text-center"
                                    sx={{ color: AnalysisCTAColor }}
                                >
                                    Renseigner votre contrat d'énergie
                                </TypographyFormatMessage>
                            </NavLink>
                        </div>
                    </div>
                </div>
            )}

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
                        <div className="flex flex-col justify-center items-center">
                            <p className="text-16 md:text-20 font-medium mb-8">
                                {totalConsumption.value} {totalConsumption.unit}
                            </p>
                            <AnalysisPercentageChangeArrows
                                dateReferenceConsumptionValue={subDays(new Date(range.to), 1)}
                                referenceConsumptionValue={referenceConsumptionValue}
                                filters={filters}
                            />
                            <p className="text-16 md:text-20 font-medium">
                                {Number(totalEurosConsumption.value).toFixed(2)} {totalEurosConsumption.unit}
                            </p>
                        </div>
                    </AnalysisChart>
                )}
            </div>
            {!isMetricsLoading && (
                <div className="p-24 analysis-information-list">
                    <AnalysisInformationList activeInformationName={activeInformationName} data={data} range={range} />
                    {/* Consommation de veille. */}
                    <AnalysisIdleConsumption data={data} />
                    {enedisSgeConsent?.enedisSgeConsentState === 'CONNECTED' && (
                        <AnalysisMaxPower data={data} housingId={currentHousing!.id} />
                    )}
                </div>
            )}
        </>
    )
}
