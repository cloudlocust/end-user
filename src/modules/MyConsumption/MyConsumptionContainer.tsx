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
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
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

    // metricsInterval is initialized this way, so that its value is different from 2m or 30m, because it'll be set to 2m or 30m once consent request has finished.
    // This won't create a problem even if metricIntervalType doesn't include undefined, because this will affect only on mount of MyConsumptionContainer and all children component that useMetrics, won't execute getMetrics on mount.
    const [metricsInterval, setMetricsInterval] = useState<metricIntervalType>('2m')
    const { ecowattSignalsData, isLoadingInProgress: isEcowattDataInProgress } = useEcowatt(true)

    const nrlinkOff = nrlinkConsent?.nrlinkConsentState === 'NONEXISTENT'
    const enedisOff = enedisSgeConsent?.enedisSgeConsentState === 'NONEXISTENT'

    // UseEffect to check for consent whenever a meter is selected.
    useEffect(() => {
        if (!currentHousing?.meter?.guid) return
        setFilters(formatMetricFilter(currentHousing?.meter.guid))
        getConsents(currentHousing?.meter.guid, currentHousing?.id)
    }, [currentHousing?.meter?.guid, setFilters, getConsents, currentHousing?.id])

    /**
     * Callback when MyConsumptionPeriod components change metrics Interval.
     *
     * @param interval Metric Interval selected.
     */
    const setMyConsumptionPeriodMetricsInterval = (interval: metricIntervalType) => {
        if (interval === '2m')
            setMetricsInterval(enphaseConsent && enphaseConsent.enphaseConsentState === 'ACTIVE' ? '30m' : '2m')
        else setMetricsInterval(interval)
    }

    useEffect(() => {
        setMetricsInterval((prevState) => {
            if (prevState === '2m' || prevState === '30m')
                return enphaseConsent && enphaseConsent.enphaseConsentState === 'ACTIVE' ? '30m' : '2m'
            else return prevState
        })
    }, [enphaseConsent])

    const { hasMissingHousingContracts } = useHasMissingHousingContracts(range, currentHousing?.id)

    // if (consentsLoading) return <div>Loading Consent...</div>
    if (consentsLoading)
        return (
            <Box
                sx={{ height: { xs: '424px', md: '584px' } }}
                className="p-24 CircularProgress flex flex-col justify-center items-center "
            >
                <CircularProgress style={{ color: theme.palette.primary.main }} />
            </Box>
        )
    // When getConsent fail.
    if (!nrlinkConsent && !enedisSgeConsent) return <></>
    // By checking if the metersList is true we make sure that if someone has skipped the step of connecting their PDL, they will see this error message.
    // Else if they have a PDL, we check its consent.
    if (!currentHousing?.meter?.guid) return <MissingHousingMeterErrorMessage />

    return (
        <>
            <div style={{ background: theme.palette.primary.dark }} className="p-12 sm:p-24">
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
                                setMetricsInterval={setMyConsumptionPeriodMetricsInterval}
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
                <EcowattWidget
                    ecowattSignalsData={ecowattSignalsData}
                    isEcowattDataInProgress={isEcowattDataInProgress}
                />
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
