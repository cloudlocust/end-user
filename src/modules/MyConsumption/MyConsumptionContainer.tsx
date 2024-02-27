import { useState, useEffect, useMemo, useCallback } from 'react'
import { ConsumptionChartContainer } from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartContainer'
import { useTheme, CircularProgress, Box } from '@mui/material'
import {
    formatMetricFilter,
    getRangeV2,
    getDateWithTimezoneOffset,
} from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
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
import { MissingHousingMeterErrorMessage } from 'src/modules/MyConsumption/utils/ErrorMessages'
import { ProductionChartContainer } from 'src/modules/MyConsumption/components/ProductionChart/ProductionChartContainer'
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
import { MyConsumptionContainerProps } from 'src/modules/MyConsumption/myConsumptionTypes.d'

/**
 * Const represent how many years we want to display on the calender in the yearly view.
 */
export const NUMBER_OF_LAST_YEARS_TO_DISPLAY_IN_DATE_PICKER_OF_YEARLY_VIEW = 3

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
    const enedisOff = enedisSgeConsent?.enedisSgeConsentState !== 'CONNECTED'

    // Productioon chart should be shown only when user click on Autoconsumption-Production switch button
    const isProductionChartShown =
        isProductionActiveAndHousingHasAccess(currentHousingScopes) &&
        consumptionToggleButton === SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction

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

    /**
     * Handles the selection of years in the date picker.
     * In yearly view, only the n years are displayed if the enedis consent is active.
     *
     * @param {Date} date - The selected date.
     * @returns {boolean} - True if the date should be displayed in the date picker, false otherwise.
     */
    const handleYearsOfDatePicker = useCallback(
        (date: Date) => {
            // in yearly view display only the last n years if the enedis consent is active.
            return (
                period === PeriodEnum.YEARLY &&
                !enedisOff &&
                date.getFullYear() <
                    new Date().getFullYear() - NUMBER_OF_LAST_YEARS_TO_DISPLAY_IN_DATE_PICKER_OF_YEARLY_VIEW
            )
        },
        [enedisOff, period],
    )

    /**
     * Determines whether the previous year navigation button should be disabled in the yearly view.
     * The button is disabled if the enedis consent is active and the range is within the last n years.
     *
     * @returns {boolean} True if the previous year navigation button should be disabled, false otherwise.
     */
    const disablePreviousYearOfNavigationButton = useMemo(() => {
        // in yearly view display only the previous button for the last n years if the enedis consent is active.
        return (
            period === PeriodEnum.YEARLY &&
            !enedisOff &&
            range &&
            getDateWithTimezoneOffset(range.from).getFullYear() <=
                new Date().getFullYear() - NUMBER_OF_LAST_YEARS_TO_DISPLAY_IN_DATE_PICKER_OF_YEARLY_VIEW
        )
    }, [enedisOff, period, range])

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
                                setMetricsInterval={setMetricsInterval}
                                period={period}
                                range={range}
                            />
                            <MyConsumptionDatePicker
                                period={period}
                                setRange={setRange}
                                range={range}
                                handleYears={handleYearsOfDatePicker}
                                isPreviousButtonDisabling={disablePreviousYearOfNavigationButton}
                            />
                        </div>

                        <ConsumptionChartContainer
                            period={period}
                            hasMissingHousingContracts={hasMissingHousingContracts}
                            range={range}
                            filters={filters}
                            isSolarProductionConsentOff={isSolarProductionConsentOff}
                            enedisSgeConsent={enedisSgeConsent}
                            metricsInterval={metricsIntervalWhenConsumptionButtonIsProduction}
                            setMetricsInterval={setMetricsInterval}
                        />
                    </>
                )}

                {/* Production Chart */}
                {isProductionChartShown && (
                    <ProductionChartContainer
                        period={period}
                        range={range}
                        filters={filters}
                        isProductionConsentOff={isSolarProductionConsentOff}
                        isProductionConsentLoadingInProgress={isConnectedPlugListLoadingInProgress}
                        metricsInterval={metricsIntervalWhenConsumptionButtonIsProduction}
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
