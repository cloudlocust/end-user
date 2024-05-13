import { useState, useEffect, useMemo } from 'react'
import { ConsumptionChartContainer } from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartContainer'
import { useTheme, CircularProgress, Box } from '@mui/material'
import { formatMetricFilter, getRangeV2 } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { metricRangeType, metricFiltersType, metricIntervalType } from 'src/modules/Metrics/Metrics.d'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { useHasMissingHousingContracts } from 'src/hooks/HasMissingHousingContracts'
import { ChartErrorMessage } from 'src/modules/MyConsumption/components/ChartErrorMessage'
import { NRLINK_ENEDIS_OFF_MESSAGE } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { EcowattWidget } from 'src/modules/Ecowatt/EcowattWidget'
import { MissingHousingMeterErrorMessage } from 'src/modules/MyConsumption/utils/ErrorMessages'
import { useEcowatt } from 'src/modules/Ecowatt/EcowattHook'
import ConsumptionWidgetsContainer from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer'
import { ConsumptionWidgetsMetricsProvider } from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/ConsumptionWidgetsMetricsContext'
import { useConnectedPlugList } from 'src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook'
import {
    arePlugsUsedBasedOnProductionStatus,
    isProductionActiveAndHousingHasAccess,
} from 'src/modules/MyHouse/MyHouseConfig'
import { SwitchConsumptionButtonTypeEnum } from 'src/modules/MyConsumption/components/SwitchConsumptionButton/SwitchConsumptionButton.types'
import { useMyConsumptionStore } from 'src/modules/MyConsumption/store/myConsumptionStore'
import { ChartFAQ } from 'src/modules/MyConsumption/components/ChartFAQ'
import { useContractList } from 'src/modules/Contracts/contractsHook'
import { MyConsumptionContainerProps } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { SwitchConsumptionButton } from 'src/modules/MyConsumption/components/SwitchConsumptionButton'
import SolarProductionLinkingPrompt from 'src/modules/MyConsumption/components/SolarProductionLinkingPrompt'

/**
 * MyConsumptionContainer.
 * Parent component.
 *
 * @param root0 MyConsumptionContainer props.
 * @param root0.defaultPeriod The default period will be displayed on the page.
 * @returns MyConsumptionContainer and its children.
 */
export const MyConsumptionContainer = ({ defaultPeriod = PeriodEnum.DAILY }: MyConsumptionContainerProps) => {
    const theme = useTheme()
    const { getConsents, nrlinkConsent, enedisSgeConsent, enphaseConsent, consentsLoading } = useConsents()
    const [period, setPeriod] = useState<PeriodEnum>(defaultPeriod)
    const { currentHousing, currentHousingScopes } = useSelector(({ housingModel }: RootState) => housingModel)
    const [range, setRange] = useState<metricRangeType>(getRangeV2(PeriodEnum.DAILY))
    const [filters, setFilters] = useState<metricFiltersType>([])
    const { elementList: contractList } = useContractList(currentHousing?.id as number)
    const { consumptionToggleButton, resetToDefault } = useMyConsumptionStore()

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
    if (arePlugsUsedBasedOnProductionStatus(currentHousingScopes))
        isSolarProductionConsentOff = isSolarProductionConsentOff && !isProductionConnectedPlug

    const nrlinkOff = nrlinkConsent?.nrlinkConsentState === 'NONEXISTENT'
    const enedisSgeOff = enedisSgeConsent?.enedisSgeConsentState !== 'CONNECTED'

    const [metricsInterval, setMetricsInterval] = useState<metricIntervalType>(
        isSolarProductionConsentOff ? '1m' : '30m',
    )
    const { ecowattSignalsData, isLoadingInProgress: isEcowattDataInProgress } = useEcowatt(true)

    const { hasMissingHousingContracts } = useHasMissingHousingContracts(range, currentHousing?.id)

    const metricsIntervalWhenConsumptionButtonIsProduction = useMemo(() => {
        if (
            period === 'daily' &&
            consumptionToggleButton === SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction
        ) {
            return '30m'
        }
        return metricsInterval
    }, [consumptionToggleButton, metricsInterval, period])

    // UseEffect to check for consent whenever a meter is selected.
    useEffect(() => {
        if (!currentHousing?.id) return
        setFilters(formatMetricFilter(currentHousing?.id))
        getConsents(currentHousing?.id)

        return () => {
            resetToDefault()
        }
    }, [setFilters, getConsents, currentHousing?.id, resetToDefault])

    useEffect(() => {
        loadConnectedPlugList()
    }, [loadConnectedPlugList])

    // check if the user has a tempo contract
    const doesUserHasTempoContract = useMemo(
        () => !!(contractList?.some((contract) => contract.tariffType.name === 'Jour Tempo') || false),
        [contractList],
    )

    if (consentsLoading || isConnectedPlugListLoadingInProgress)
        return (
            <Box
                sx={{ height: { xs: '424px', md: '584px' } }}
                className="p-24 CircularProgress flex flex-col justify-center items-center "
            >
                <CircularProgress style={{ color: theme.palette.primary.main }} />
            </Box>
        )

    if (!currentHousing?.meter?.guid) return <MissingHousingMeterErrorMessage />

    if ((!nrlinkConsent || nrlinkOff) && (!enedisSgeConsent || enedisSgeOff))
        return (
            <ChartErrorMessage
                nrLinkEnedisOff={true}
                nrlinkEnedisOffMessage={NRLINK_ENEDIS_OFF_MESSAGE}
                linkTo={`/my-houses/${currentHousing?.id}`}
            />
        )

    return (
        <>
            <div style={{ background: theme.palette.common.white }} className="pb-8 w-full flex justify-center">
                <SwitchConsumptionButton
                    isIdleShown={isSolarProductionConsentOff}
                    isAutoConsumptionProductionShown={isProductionActiveAndHousingHasAccess(currentHousingScopes)}
                />
            </div>
            {consumptionToggleButton === SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction &&
            isSolarProductionConsentOff ? (
                <SolarProductionLinkingPrompt />
            ) : (
                <>
                    <div style={{ background: theme.palette.common.white }} className="px-12 py-12 sm:px-24 sm:pb-24">
                        <ConsumptionChartContainer
                            period={period}
                            hasMissingHousingContracts={hasMissingHousingContracts}
                            range={range}
                            filters={filters}
                            enedisSgeConsent={enedisSgeConsent}
                            metricsInterval={metricsIntervalWhenConsumptionButtonIsProduction}
                            isIdleShown={isSolarProductionConsentOff}
                            setMetricsInterval={setMetricsInterval}
                            onPeriodChange={setPeriod}
                            onRangeChange={setRange}
                        />
                    </div>

                    {/* Widget List */}
                    <ConsumptionWidgetsMetricsProvider>
                        <ConsumptionWidgetsContainer
                            period={period}
                            range={range}
                            filters={filters}
                            hasMissingHousingContracts={hasMissingHousingContracts}
                            metricsInterval={metricsInterval}
                            // TODO Change enphaseOff for a more generic naming such as isProductionConsentOff or productionOff...
                            enphaseOff={isSolarProductionConsentOff}
                            enedisOff={enedisSgeOff}
                            isIdleWidgetShown={isSolarProductionConsentOff && period !== PeriodEnum.DAILY}
                        />
                    </ConsumptionWidgetsMetricsProvider>

                    {/* FAQ used to understand the charts  */}
                    <div className="p-12 sm:p-24">
                        <ChartFAQ period={period} hasTempoContract={doesUserHasTempoContract} />
                    </div>

                    {/* Ecowatt Widget */}
                    <div className="p-12 sm:p-24" id="ecowatt-widget">
                        <EcowattWidget
                            ecowattSignalsData={ecowattSignalsData}
                            isEcowattDataInProgress={isEcowattDataInProgress}
                        />
                    </div>
                </>
            )}
        </>
    )
}
