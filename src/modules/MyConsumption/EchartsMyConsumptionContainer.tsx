import { useState, useEffect } from 'react'
import { EchartsConsumptionChartContainer } from 'src/modules/MyConsumption/components/MyConsumptionChart/EchartsConsumptionChartContainer'
import { formatMetricFilter, getRangeV2 } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { useTheme } from '@mui/material'
import { metricRangeType, metricFiltersType, metricIntervalType } from 'src/modules/Metrics/Metrics.d'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { useConsents } from 'src/modules/Consents/consentsHook'
import MyConsumptionDatePicker from 'src/modules/MyConsumption/components/MyConsumptionDatePicker'
import { MyConsumptionPeriod } from 'src/modules/MyConsumption'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { useHasMissingHousingContracts } from 'src/hooks/HasMissingHousingContracts'
import { ChartErrorMessage } from 'src/modules/MyConsumption/components/ChartErrorMessage'
import { NRLINK_ENEDIS_OFF_MESSAGE } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { EcowattWidget } from 'src/modules/Ecowatt/EcowattWidget'
import { MissingHousingMeterErrorMessage } from './utils/ErrorMessages'
import { ProductionChartContainer } from 'src/modules/MyConsumption/components/MyConsumptionChart/ProductionChartContainer'
import { useEcowatt } from 'src/modules/Ecowatt/EcowattHook'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import ConsumptionWidgetsContainer from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer'
import { ConsumptionWidgetsMetricsProvider } from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/ConsumptionWidgetsMetricsContext'
import { useConnectedPlugList } from 'src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook'
import { connectedPlugsFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import { globalProductionFeatureState } from 'src/modules/MyHouse/MyHouseConfig'

/**
 * EchartsMyConsumptionContainer.
 * Parent component.
 *
 * @returns EchartsMyConsumptionContainer and its children.
 */
export const EchartsMyConsumptionContainer = () => {
    const theme = useTheme()
    const { getConsents, nrlinkConsent, enedisSgeConsent, enphaseConsent, consentsLoading } = useConsents()
    const [period, setPeriod] = useState<PeriodEnum>(PeriodEnum.DAILY)
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const [range, setRange] = useState<metricRangeType>(getRangeV2(PeriodEnum.DAILY))
    const [filters, setFilters] = useState<metricFiltersType>([])

    // metricsInterval is initialized this way, so that its value is different from 2m or 30m, because it'll be set to 2m or 30m once consent request has finished.
    // This won't create a problem even if metricIntervalType doesn't include undefined, because this will affect only on mount of EchartsMyConsumptionContainer and all children component that useMetrics, won't execute getMetrics on mount.
    const [metricsInterval, setMetricsInterval] = useState<metricIntervalType>('1m')
    const { ecowattSignalsData, isLoadingInProgress: isEcowattDataInProgress } = useEcowatt(true)

    const { hasMissingHousingContracts } = useHasMissingHousingContracts(range, currentHousing?.id)

    const nrlinkOff = nrlinkConsent?.nrlinkConsentState === 'NONEXISTENT'
    const enedisOff = enedisSgeConsent?.enedisSgeConsentState !== 'CONNECTED'

    // Load connected plug only when housing is defined
    const {
        loadingInProgress: isConnectedPlugListLoadingInProgress,
        getProductionConnectedPlug,
        loadConnectedPlugList,
    } = useConnectedPlugList(currentHousing?.id)
    // Check if there's connected plug in production mode.
    const isProductionConnectedPlug = getProductionConnectedPlug()

    // TODO put enphaseConsent.enphaseConsentState in an enum.
    let isSolarProductionConsentOff = enphaseConsent?.enphaseConsentState !== 'ACTIVE'
    if (connectedPlugsFeatureState)
        isSolarProductionConsentOff = isSolarProductionConsentOff && !isProductionConnectedPlug

    // UseEffect to check for consent whenever a meter is selected.
    useEffect(() => {
        if (!currentHousing?.id || !currentHousing?.meter?.guid) return
        setFilters(formatMetricFilter(currentHousing?.meter.guid))
        getConsents(currentHousing?.id)
    }, [currentHousing?.meter?.guid, setFilters, getConsents, currentHousing?.id])

    /**
     * Callback when MyConsumptionPeriod components change metrics Interval.
     *
     * @param interval Metric Interval selected.
     */
    const setMyConsumptionPeriodMetricsInterval = (interval: metricIntervalType) => {
        if (interval === '1m') setMetricsInterval(!isSolarProductionConsentOff ? '30m' : '1m')
        else setMetricsInterval(interval)
    }

    useEffect(() => {
        setMetricsInterval((prevState) => {
            if (prevState === '1m' || prevState === '30m') return !isSolarProductionConsentOff ? '30m' : '1m'
            else return prevState
        })
    }, [isSolarProductionConsentOff])

    useEffect(() => {
        loadConnectedPlugList()
    }, [loadConnectedPlugList])

    if (consentsLoading)
        return (
            <Box
                sx={{ height: { xs: '424px', md: '584px' } }}
                className="p-24 CircularProgress flex flex-col justify-center items-center "
            >
                <CircularProgress style={{ color: theme.palette.primary.main }} />
            </Box>
        )
    // By checking if the metersList is true we make sure that if someone has skipped the step of connecting their PDL, they will see this error message.
    // Else if they have a PDL, we check its consent.
    if (!currentHousing?.meter?.guid) return <MissingHousingMeterErrorMessage />

    // When getConsent fail.
    if (!nrlinkConsent && !enedisSgeConsent)
        return (
            <ChartErrorMessage
                nrLinkEnedisOff={true}
                nrlinkEnedisOffMessage={NRLINK_ENEDIS_OFF_MESSAGE}
                linkTo={`/my-houses/${currentHousing?.id}`}
            />
        )

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

                        <EchartsConsumptionChartContainer
                            period={period}
                            hasMissingHousingContracts={hasMissingHousingContracts}
                            range={range}
                            filters={filters}
                            isSolarProductionConsentOff={isSolarProductionConsentOff}
                            enedisSgeConsent={enedisSgeConsent}
                            metricsInterval={metricsInterval}
                        />
                    </>
                )}

                {/* Production Chart */}
                {globalProductionFeatureState && (
                    <ProductionChartContainer
                        period={period}
                        range={range}
                        filters={filters}
                        isProductionConsentOff={isSolarProductionConsentOff}
                        isProductionConsentLoadingInProgress={isConnectedPlugListLoadingInProgress}
                        metricsInterval={metricsInterval}
                    />
                )}
            </div>

            {/* Widget List */}
            {(!nrlinkOff || !enedisOff) && (
                <ConsumptionWidgetsMetricsProvider>
                    <ConsumptionWidgetsContainer
                        period={period}
                        range={range}
                        filters={filters}
                        hasMissingHousingContracts={hasMissingHousingContracts}
                        metricsInterval={metricsInterval}
                        // TODO Change enphaseOff for a more generic naming such as isProductionConsentOff or productionOff...
                        enphaseOff={isSolarProductionConsentOff}
                        enedisOff={enedisOff}
                    />
                </ConsumptionWidgetsMetricsProvider>
            )}

            {/* Ecowatt Widget */}
            <div className="p-12 sm:p-24" id="ecowatt-widget">
                <EcowattWidget
                    ecowattSignalsData={ecowattSignalsData}
                    isEcowattDataInProgress={isEcowattDataInProgress}
                />
            </div>
        </>
    )
}
