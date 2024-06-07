import { Avatar, useMediaQuery, useTheme, Typography } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { ReactComponent as IdleIcon } from 'src/assets/images/idle.svg'
import { AnalysisIdleConsumptionProps } from 'src/modules/Analysis/components/AnalysisIdleConsumption/analysisIdleConssumption'
import {
    computeAverageIdleConssumption,
    computeSumIdleConsumption,
} from 'src/modules/Analysis/components/AnalysisInformationList/utils'
import convert from 'convert-units'
import { useMemo } from 'react'
import { round } from 'lodash'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'

/**
 * AnalysisIdleConsumption component.
 *
 * @param param0 N/A.
 * @param param0.totalConsumption Total consumption data.
 * @param param0.range Metrics range from parent.
 * @param param0.filters Metrics filters from parent.
 * @returns AnalysisIdleConsumption JSX.
 */
export function AnalysisIdleConsumption({ totalConsumption, range, filters }: AnalysisIdleConsumptionProps) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const { data: idleConsumptionData, isMetricsLoading: isIdleConsumptionDataLoading } = useMetrics(
        {
            interval: '1d',
            range: range,
            targets: [
                {
                    target: metricTargetsEnum.idleConsumption,
                    type: 'timeserie',
                },
            ],
            filters,
        },
        { immediate: Boolean(filters) },
    )

    const convertedAverageIdleConsumptionDataToKwh = useMemo(
        () => convert(computeAverageIdleConssumption(idleConsumptionData)!).from('Wh').to('kWh'),
        [idleConsumptionData],
    )

    const convertedSumIdleConsumptionDataToKwh = useMemo(
        () => convert(computeSumIdleConsumption(idleConsumptionData)!).from('Wh').to('kWh'),
        [idleConsumptionData],
    )

    const pourcentageOfIdleConsumptionFromTotalConsumption = useMemo(() => {
        // To avoid Infinity, you need to make sure that you're not dividing by zero.
        if (totalConsumption !== 0) {
            return round((convertedSumIdleConsumptionDataToKwh / convert(totalConsumption).from('Wh').to('kWh')) * 100)
        }

        return 0
    }, [convertedSumIdleConsumptionDataToKwh, totalConsumption])

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
                    {isIdleConsumptionDataLoading ? (
                        <TypographyFormatMessage>En cours de calcule...</TypographyFormatMessage>
                    ) : convertedAverageIdleConsumptionDataToKwh && convertedSumIdleConsumptionDataToKwh ? (
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
