import { useState, useEffect } from 'react'
import { ConsumptionChartContainer } from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartContainer'
import { formatMetricFilter, getRange } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { useTheme } from '@mui/material'
import { metricRangeType, metricFiltersType, metricIntervalType } from 'src/modules/Metrics/Metrics.d'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { useConsents } from 'src/modules/Consents/consentsHook'
import Grid from '@mui/material/Grid'
import MyConsumptionDatePicker from 'src/modules/MyConsumption/components/MyConsumptionDatePicker'
import { MyConsumptionPeriod } from 'src/modules/MyConsumption'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { useHasMissingHousingContracts } from 'src/hooks/HasMissingHousingContracts'
import { ChartErrorMessage } from 'src/modules/MyConsumption/components/ChartErrorMessage'
import { NRLINK_ENEDIS_OFF_MESSAGE, WidgetTargets } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { EcowattWidget } from 'src/modules/Ecowatt/EcowattWidget'
import { MissingHousingMeterErrorMessage } from './utils/ErrorMessages'
import { ProductionChartContainer } from 'src/modules/MyConsumption/components/MyConsumptionChart/ProductionChartContainer'
import { useEcowatt } from 'src/modules/Ecowatt/EcowattHook'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { Widget } from 'src/modules/MyConsumption/components/Widget'

/**
 * MyConsumptionContainer.
 * Parent component.
 *
 * @returns MyConsumptionContainer and its children.
 */
export const MyConsumptionContainer = () => {
    const theme = useTheme()
    const { getConsents, nrlinkConsent, enedisSgeConsent, enphaseConsent, consentsLoading } = useConsents()
    const [period, setPeriod] = useState<periodType>('daily')
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const [range, setRange] = useState<metricRangeType>(getRange('day'))
    const [filters, setFilters] = useState<metricFiltersType>([])
    const [metricsInterval, setMetricsInterval] = useState<metricIntervalType>('2m')
    const { ecowattData, isLoadingInProgress: isEcowattDataInProgress } = useEcowatt()

    const nrlinkOff = nrlinkConsent?.nrlinkConsentState === 'NONEXISTENT'
    const enedisOff = enedisSgeConsent?.enedisSgeConsentState === 'NONEXISTENT'

    useEffect(() => {
        if (!currentHousing?.meter?.guid) return
        setFilters(formatMetricFilter(currentHousing.meter?.guid))
    }, [currentHousing?.meter?.guid, setFilters])

    const { hasMissingHousingContracts } = useHasMissingHousingContracts(range, currentHousing?.id)

    useEffect(() => {
        if (period === 'daily' && enphaseConsent?.enphaseConsentState === 'ACTIVE') {
            setMetricsInterval('30m')
        } else if (period === 'daily' && enphaseConsent?.enphaseConsentState !== 'ACTIVE') {
            setMetricsInterval('2m')
        }
    }, [enphaseConsent?.enphaseConsentState, period])

    // UseEffect to check for consent whenever a meter is selected.
    useEffect(() => {
        if (filters.length > 0) {
            getConsents(filters[0].value, currentHousing?.id)
        }
    }, [currentHousing?.id, filters, getConsents])

    // When getConsent fail.
    if (!consentsLoading && !nrlinkConsent && !enedisSgeConsent) return <></>
    // By checking if the metersList is true we make sure that if someone has skipped the step of connecting their PDL, they will see this error message.
    // Else if they have a PDL, we check its consent.
    if (!currentHousing?.meter?.guid) return <MissingHousingMeterErrorMessage />

    return (
        <>
            <div style={{ background: theme.palette.primary.dark }} className="p-24">
                {nrlinkOff && enedisOff ? (
                    <ChartErrorMessage
                        nrLinkEnedisOff={nrlinkOff && enedisOff}
                        nrlinkEnedisOffMessage={NRLINK_ENEDIS_OFF_MESSAGE}
                        linkTo={`/my-houses/${currentHousing?.id}`}
                    />
                ) : (
                    <>
                        <div className="mb-24">
                            <MyConsumptionPeriod
                                setPeriod={setPeriod}
                                setRange={setRange}
                                setMetricsInterval={setMetricsInterval}
                                range={range}
                            />
                            <MyConsumptionDatePicker period={period} setRange={setRange} range={range} />
                        </div>

                        <ConsumptionChartContainer
                            period={period}
                            hasMissingHousingContracts={hasMissingHousingContracts}
                            range={range}
                            filters={filters}
                            enedisSgeConsent={enedisSgeConsent}
                            enphaseConsent={enphaseConsent}
                            metricsInterval={metricsInterval}
                        />
                    </>
                )}

                {/* Production Chart */}
                <ProductionChartContainer
                    period={period}
                    range={range}
                    filters={filters}
                    enphaseConsent={enphaseConsent}
                    metricsInterval={metricsInterval}
                />
            </div>
            {/* Ecowatt Widget */}
            <div className="p-12 sm:p-24" id="ecowatt-widget">
                <EcowattWidget ecowattData={ecowattData} isEcowattDataInProgress={isEcowattDataInProgress} />
            </div>

            {/* Widget List */}
            {(!nrlinkOff || !enedisOff) && (
                <div className="p-12 sm:p-24 ">
                    <div className="flex justify-center items-center md:justify-start">
                        <TypographyFormatMessage variant="h5" className="sm:mr-8 text-black font-medium">
                            Chiffres clés
                        </TypographyFormatMessage>
                    </div>
                    <div style={{ background: theme.palette.grey[100] }} className="w-full my-8">
                        <Grid container spacing={{ xs: 1, md: 2 }}>
                            {WidgetTargets.map((target) => {
                                return (
                                    <Widget
                                        key={target}
                                        target={target}
                                        range={range}
                                        filters={filters}
                                        metricsInterval={metricsInterval}
                                        period={period}
                                        hasMissingHousingContracts={hasMissingHousingContracts}
                                    />
                                )
                            })}
                        </Grid>
                    </div>
                </div>
            )}
        </>
    )
}
