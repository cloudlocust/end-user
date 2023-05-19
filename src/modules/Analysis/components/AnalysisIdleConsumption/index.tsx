import { Avatar, useMediaQuery, useTheme, Typography } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { ReactComponent as IdleIcon } from 'src/assets/images/idle.svg'
import { AnalysisIdleConsumptionProps } from 'src/modules/Analysis/components/AnalysisIdleConsumption/analysisIdleConssumption'
import {
    computeAverageIdleConssumption,
    computeSumIdleConsumption,
} from 'src/modules/Analysis/components/AnalysisInformationList/utils'
import convert, { Unit } from 'convert-units'
import { useMemo } from 'react'
import { round } from 'lodash'

/**
 * AnalysisIdleConsumption component.
 *
 * @param param0 N/A.
 * @param param0.data Metrics data.
 * @param param0.totalConsumption Total consumption.
 * @returns AnalysisIdleConsumption JSX.
 */
export function AnalysisIdleConsumption({ data, totalConsumption }: AnalysisIdleConsumptionProps) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const convertedAverageIdleConsumptionDataToKwh = useMemo(
        () => convert(computeAverageIdleConssumption(data)!).from('Wh').to('kWh'),
        [data],
    )

    const convertedSumIdleConsumptionDataToKwh = useMemo(
        () => convert(computeSumIdleConsumption(data)!).from('Wh').to('kWh'),
        [data],
    )

    const pourcentageOfIdleConsumptionFromTotalConsumption = useMemo(
        () =>
            round(
                (convertedSumIdleConsumptionDataToKwh /
                    convert(totalConsumption.value)
                        .from(totalConsumption.unit as Unit)
                        .to('kWh')) *
                    100,
            ),
        [convertedSumIdleConsumptionDataToKwh, totalConsumption.unit, totalConsumption.value],
    )

    return (
        <div className="w-full flex flex-col items-start md:items-center p-0">
            <div className="flex flex-row mb-16" style={{ width: isMobile ? '100%' : '290px' }}>
                <Avatar sx={(theme) => ({ width: 64, height: 64, backgroundColor: theme.palette.grey['500'] })}>
                    <IdleIcon data-testid="idle-svg" />
                </Avatar>
                <div className="ml-8 flex flex-col h-full w-full">
                    <TypographyFormatMessage className="sm:text-13 font-bold md:text-16">
                        Consommation de veille :
                    </TypographyFormatMessage>
                    {convertedAverageIdleConsumptionDataToKwh && convertedSumIdleConsumptionDataToKwh ? (
                        <>
                            <span>
                                <TypographyFormatMessage className="sm:text-13 text-grey-600 font-bold md:text-16">
                                    Moyenne par jour :
                                </TypographyFormatMessage>
                                <Typography className="sm:text-13 font-medium md:text-16 ml-3">
                                    {convertedAverageIdleConsumptionDataToKwh.toFixed(2)} kWh
                                </Typography>
                            </span>
                            <span>
                                <TypographyFormatMessage className="sm:text-13 text-grey-600 font-bold md:text-16">
                                    Totale sur le mois :
                                </TypographyFormatMessage>
                                <Typography className="sm:text-13 font-medium md:text-16 ml-3">
                                    {convertedSumIdleConsumptionDataToKwh.toFixed(2)} kWh
                                </Typography>
                            </span>
                            <span>
                                <TypographyFormatMessage className="sm:text-13 text-grey-600 font-bold md:text-16">
                                    Part de la conso du mois :
                                </TypographyFormatMessage>
                                <Typography className="sm:text-13 font-medium md:text-16 ml-3">
                                    {pourcentageOfIdleConsumptionFromTotalConsumption} %
                                </Typography>
                            </span>
                        </>
                    ) : (
                        <TypographyFormatMessage className="sm:text-13 font-medium md:text-16">
                            Aucune donnée disponible
                        </TypographyFormatMessage>
                    )}
                </div>
            </div>
        </div>
    )
}
