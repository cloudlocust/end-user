import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTheme, useMediaQuery } from '@mui/material'
import { useMetrics, useAdditionalMetrics } from 'src/modules/Metrics/metricsHook'
import { IMetric, metricTargetsEnum, metricTargetType } from 'src/modules/Metrics/Metrics.d'
import { ConsumptionChartContainerProps } from 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChartTypes.d'
import CircularProgress from '@mui/material/CircularProgress'
import EurosConsumptionButtonToggler from 'src/modules/MyConsumption/components/EurosConsumptionButtonToggler'
import {
    getTotalOffIdleConsumptionData,
    filterMetricsData,
    getDefaultConsumptionTargets,
    showPerPeriodText,
    nullifyTodayIdleConsumptionValue,
    getDateWithTimezoneOffset,
} from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import {
    DefaultContractWarning,
    ConsumptionEnedisSgeWarning,
} from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartWarnings'
import { sgeConsentFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import TargetMenuGroup from 'src/modules/MyConsumption/components/TargetMenuGroup'
import { SwitchConsumptionButton } from 'src/modules/MyConsumption/components/SwitchConsumptionButton'
import {
    eurosConsumptionTargets,
    eurosIdleConsumptionTargets,
    idleConsumptionTargets,
    temperatureOrPmaxTargets,
} from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import MyConsumptionChart from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { SwitchConsumptionButtonTypeEnum } from 'src/modules/MyConsumption/components/SwitchConsumptionButton/SwitchConsumptionButton.types'
import { useMyConsumptionStore } from 'src/modules/MyConsumption/store/myConsumptionStore'
import { MyConsumptionPeriod } from 'src/modules/MyConsumption'
import MyConsumptionDatePicker from 'src/modules/MyConsumption/components/MyConsumptionDatePicker'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { ConsumptionIdentifierButton } from 'src/modules/MyConsumption/components/ConsumptionIdentifierButton'
import { Title } from 'src/modules/MyConsumption/components/Title'
import { computeTotalConsumption, computeTotalEuros } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'

/**
 * Const represent how many years we want to display on the calender in the yearly view.
 */
export const NUMBER_OF_LAST_YEARS_TO_DISPLAY_IN_DATE_PICKER_OF_YEARLY_VIEW = 3

/**
 * MyConsumptionChartContainer Component.
 *
 * @param props N/A.
 * @param props.period Indicates the current selected Period if it's monthly or daily or yearly or weekly so that we format tooltip and xAxis of chart according to the period.
 * @param props.range Current range so that we handle the xAxis values according to period and range selected.
 * @param props.metricsInterval Boolean state to know whether the stacked option is true or false.
 * @param props.filters Consumption or production chart type.
 * @param props.hasMissingHousingContracts Boolean indicating if there are missing housing contracts.
 * @param props.enedisSgeConsent Enedis SGE consent.
 * @param props.isSolarProductionConsentOff Boolean indicating if solar production consent is off.
 * @param props.isIdleShown Boolean indicating whether the idle chart is shown or not.
 * @param props.setMetricsInterval Set metrics interval.
 * @param props.onPeriodChange Callback function for period change.
 * @param props.onRangeChange Callback function for range change.
 * @returns ConsumptionChartContainer Component.
 */
export const ConsumptionChartContainer = ({
    period,
    range,
    metricsInterval,
    filters,
    hasMissingHousingContracts,
    enedisSgeConsent,
    isSolarProductionConsentOff,
    isIdleShown,
    setMetricsInterval,
    onPeriodChange,
    onRangeChange,
}: ConsumptionChartContainerProps) => {
    const theme = useTheme()

    const mdDown = useMediaQuery(theme.breakpoints.down('md'))
    const { consumptionToggleButton, setConsumptionToggleButton } = useMyConsumptionStore()

    // Handling the targets makes it simpler instead of the useMetrics as it's a straightforward array of metricTargetType
    const [targets, setTargets] = useState<metricTargetType[]>(
        getDefaultConsumptionTargets(SwitchConsumptionButtonTypeEnum.Consumption),
    )
    const isAutoConsumptionProductionShown = !isSolarProductionConsentOff

    useEffect(() => {
        const defaultTargets = getDefaultConsumptionTargets(consumptionToggleButton)
        setTargets(defaultTargets)
    }, [consumptionToggleButton])

    // Switch consumption button should be reset to consumption when the other two are not shown.
    useEffect(() => {
        if (
            (!isIdleShown && consumptionToggleButton === SwitchConsumptionButtonTypeEnum.Idle) ||
            (!isAutoConsumptionProductionShown &&
                consumptionToggleButton === SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction)
        ) {
            setConsumptionToggleButton(SwitchConsumptionButtonTypeEnum.Consumption)
        }
    }, [consumptionToggleButton, isAutoConsumptionProductionShown, isIdleShown, setConsumptionToggleButton])

    // Indicates if enedisSgeConsent is not Connected
    const enedisSgeOff = enedisSgeConsent?.enedisSgeConsentState !== 'CONNECTED'
    const hidePmax = period === 'daily' || enedisSgeOff

    const { data, getMetricsWithParams, isMetricsLoading } = useMetrics({
        interval: metricsInterval,
        range: range,
        targets: [],
        filters,
    })
    // now we used this hooks to get some data used to calculate total cost + total consumption.
    const {
        data: additionalMetricsData,
        getMetricsWithParams: getAdditionalMetricsWithParams,
        isMetricsLoading: isAdditionalMetricsLoading,
    } = useAdditionalMetrics({
        interval: metricsInterval,
        range: range,
        targets: [],
        filters,
    })
    // Using ConsumptionChartData allow the front end to add additional chart data not only those from useMetrics.
    // Such as totalOffIdleConsumption
    // TODO Remove with Echarts now (and everything that set consumptionChart, let only target with setTargets).
    const [consumptionChartData, setConsumptionChartData] = useState<IMetric[]>(data)

    // MetricRequest shouldn't be allowed when period is daily (metric interval is '1m' or '30m' and targets include euros or idle).
    const isMetricRequestNotAllowed = useMemo(() => {
        return (
            ['1m', '30m'].includes(metricsInterval) &&
            targets.some((target) =>
                [
                    ...eurosConsumptionTargets,
                    ...eurosIdleConsumptionTargets,
                    metricTargetsEnum.idleConsumption,
                ].includes(target),
            )
        )
    }, [targets, metricsInterval])

    const getMetrics = useCallback(async () => {
        if (isMetricRequestNotAllowed) return
        await getMetricsWithParams({ interval: metricsInterval, range, targets, filters })
    }, [getMetricsWithParams, metricsInterval, range, targets, filters, isMetricRequestNotAllowed])

    const isEurosButtonToggled = useMemo(
        () => targets.some((target) => [...eurosConsumptionTargets, ...eurosIdleConsumptionTargets].includes(target)),
        [targets],
    )

    const isIdleSwitchToggled = useMemo(
        () =>
            targets.some((target) =>
                (
                    [metricTargetsEnum.idleConsumption, metricTargetsEnum.eurosIdleConsumption] as metricTargetType[]
                ).includes(target),
            ),
        [targets],
    )
    const targetMenuActiveButton = useMemo(() => {
        if (
            targets.includes(metricTargetsEnum.internalTemperature) ||
            targets.includes(metricTargetsEnum.externalTemperature)
        )
            return 'temperature'
        else if (targets.includes(metricTargetsEnum.pMax)) return 'Pmax'
        return 'reset'
    }, [targets])

    // To avoid multiple rerendering and thus calculation in MyConsumptionChart, CosnumptionChartData change only once, when targets change or when the first getMetrics targets is loaded, thus avoiding to rerender when the second getMetrics is loaded with all targets which should only happen in the background.
    useEffect(() => {
        if (data.length > 0) {
            let chartData = data
            // When it's idleConsumption, chartData is handled differently from filteredMetricsData
            const totalOffIdleConsumptionData = getTotalOffIdleConsumptionData(chartData)
            if (totalOffIdleConsumptionData) {
                chartData = nullifyTodayIdleConsumptionValue([totalOffIdleConsumptionData, ...chartData])
            } else {
                // Filter target cases.
                const fileteredMetricsData = filterMetricsData(chartData, period, consumptionToggleButton)
                if (fileteredMetricsData.length > 0) chartData = fileteredMetricsData
            }
            setConsumptionChartData(chartData)
        } else {
            setConsumptionChartData(data)
        }
        // Only use data & targets as dependencies.
        // TODO REMOVE this exhausitve-deps due to filteredMetricsData
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, targets])

    /**
     * Handler when clicking on temperature or pMax menu.
     *
     * @param targets Targets related to pMaxOrTemperatureMenu.
     */
    const onTemperatureOrPmaxMenuClick = useCallback(async (targets: metricTargetType[]) => {
        if (targets.length)
            setTargets((prevTargets) => [
                ...prevTargets.filter((target) => !temperatureOrPmaxTargets.includes(target)),
                ...targets,
            ])
        else setTargets((prevTargets) => prevTargets.filter((target) => !temperatureOrPmaxTargets.includes(target)))
    }, [])

    /**
     * OnEurosConsumptionToggl Handler Function.
     *
     * @param isEuroToggled Indicates if the EurosToggl is set to Euros and was clicked.
     */
    const onEurosConsumptionButtonToggle = useCallback(
        (isEuroToggled: boolean) => {
            setTargets((_prevTargets) => {
                let newVisibleTargets: metricTargetType[] = []
                if (isEuroToggled) {
                    newVisibleTargets = isIdleSwitchToggled ? eurosIdleConsumptionTargets : eurosConsumptionTargets
                } else {
                    newVisibleTargets = isIdleSwitchToggled
                        ? idleConsumptionTargets
                        : getDefaultConsumptionTargets(SwitchConsumptionButtonTypeEnum.Consumption)
                }
                return newVisibleTargets
            })
        },
        [isIdleSwitchToggled],
    )

    const getConsumptionTargets = useCallback(() => {
        if (period === 'daily') {
            setMetricsInterval('1m')
        }
        return isEurosButtonToggled
            ? eurosConsumptionTargets
            : [metricTargetsEnum.consumptionByTariffComponent, metricTargetsEnum.consumption]
    }, [isEurosButtonToggled, period, setMetricsInterval])

    const getAutoconsumptionProductionTargets = useCallback(() => {
        if (period === 'daily') {
            setMetricsInterval('30m')
        }
        return isEurosButtonToggled
            ? eurosConsumptionTargets
            : [metricTargetsEnum.autoconsumption, metricTargetsEnum.consumption]
    }, [isEurosButtonToggled, period, setMetricsInterval])

    /**
     * Handler when clicking on switch consumption button.
     *
     * @param buttonType Switch consumption button type.
     */
    const onSwitchConsumptionButton = useCallback(
        (buttonType: SwitchConsumptionButtonTypeEnum) => {
            setTargets((prev) => {
                switch (buttonType) {
                    case SwitchConsumptionButtonTypeEnum.Idle:
                        return isEurosButtonToggled ? eurosIdleConsumptionTargets : idleConsumptionTargets
                    case SwitchConsumptionButtonTypeEnum.Consumption:
                        return getConsumptionTargets()
                    case SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction:
                        return getAutoconsumptionProductionTargets()
                    default:
                        // Reset to prev when user click on the same button.
                        return prev
                }
            })
        },
        [getAutoconsumptionProductionTargets, getConsumptionTargets, isEurosButtonToggled],
    )

    // When switching to period daily, if Euros Charts or Idle charts buttons are selected, metrics should be reset to default.
    useEffect(() => {
        if (isMetricRequestNotAllowed) {
            setTargets(getDefaultConsumptionTargets(SwitchConsumptionButtonTypeEnum.Consumption))
        }
    }, [isMetricRequestNotAllowed])

    // Happens every time getMetrics dependencies change, and doesn't execute when hook is instantiated.
    useEffect(() => {
        getMetrics()
    }, [getMetrics])
    // Callback use to fetch the some metrics
    const getAdditionalMetrics = useCallback(async () => {
        await getAdditionalMetricsWithParams({
            interval: metricsInterval,
            range,
            targets: [metricTargetsEnum.consumption, metricTargetsEnum.eurosConsumption],
            filters,
        })
    }, [getAdditionalMetricsWithParams, metricsInterval, range, filters])

    const isTotalsOnChartTooltipDisplayed =
        consumptionToggleButton === SwitchConsumptionButtonTypeEnum.Consumption && period !== 'daily'
    // Effect used to get additional metrics.
    useEffect(() => {
        if (isTotalsOnChartTooltipDisplayed) {
            getAdditionalMetrics()
        }
    }, [getAdditionalMetrics, isTotalsOnChartTooltipDisplayed])
    /**
     * Calculates the total consumption based on the additional metrics data.
     * If `isTotalsOnChartTooltipDisplayed` is true and `additionalMetricsData` has items,
     * the total consumption is computed using the `computeTotalConsumption` function.
     * Otherwise, it returns undefined.
     *
     * @param additionalMetricsData - The additional metrics data used to calculate the total consumption.
     * @param isTotalsOnChartTooltipDisplayed - A flag indicating whether to display the total consumption on the chart tooltip.
     * @returns The total consumption or undefined.
     */
    const totalConsumption = useMemo(() => {
        if (isTotalsOnChartTooltipDisplayed && additionalMetricsData.length > 0) {
            return computeTotalConsumption(additionalMetricsData)
        }
        return undefined
    }, [additionalMetricsData, isTotalsOnChartTooltipDisplayed])

    /**
     * Calculates the total cost in euros based on the additional metrics data.
     * If isTotalsOnChartTooltipDisplayed is true and additionalMetricsData has at least one item,
     * the total cost is computed using the computeTotalEuros function.
     * Otherwise, the total cost is undefined.
     *
     * @param additionalMetricsData - The additional metrics data used to calculate the total cost.
     * @param isTotalsOnChartTooltipDisplayed - A flag indicating whether to display the total cost on the chart tooltip.
     * @returns The total cost in euros or undefined.
     */
    const totalEuroCost = useMemo(() => {
        if (isTotalsOnChartTooltipDisplayed && additionalMetricsData.length > 0) {
            return computeTotalEuros(additionalMetricsData)
        }
        return undefined
    }, [additionalMetricsData, isTotalsOnChartTooltipDisplayed])

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
                !enedisSgeOff &&
                date.getFullYear() <
                    new Date().getFullYear() - NUMBER_OF_LAST_YEARS_TO_DISPLAY_IN_DATE_PICKER_OF_YEARLY_VIEW
            )
        },
        [enedisSgeOff, period],
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
            !enedisSgeOff &&
            range &&
            getDateWithTimezoneOffset(range.from).getFullYear() <=
                new Date().getFullYear() - NUMBER_OF_LAST_YEARS_TO_DISPLAY_IN_DATE_PICKER_OF_YEARLY_VIEW
        )
    }, [enedisSgeOff, period, range])

    const onDisplayTooltipLabel = useCallback(
        (label) => {
            return period === PeriodEnum.DAILY ? true : label.value !== null && label.value !== undefined
        },
        [period],
    )

    return (
        <div className="mb-12">
            {(isIdleShown || isAutoConsumptionProductionShown) && (
                <div className="pb-16 w-full flex justify-center">
                    <SwitchConsumptionButton
                        onSwitchConsumptionButton={onSwitchConsumptionButton}
                        isIdleShown={isIdleShown}
                        isAutoConsumptionProductionShown={isAutoConsumptionProductionShown}
                    />
                </div>
            )}

            <div className="px-16 sm:py-16 flex justify-center">
                <Title>
                    {period === 'daily' ? 'Ma puissance' : 'Ma consommation'}&nbsp;
                    {showPerPeriodText('consumption', period, isEurosButtonToggled)}
                </Title>
            </div>
            <div
                className="px-16 mt-22 h-28 flex justify-evenly items-center sm:justify-center sm:gap-12 sm:pb-12 sm:h-auto"
                style={{ marginTop: 22 }}
            >
                {period !== 'daily' && (
                    <EurosConsumptionButtonToggler
                        onChange={() => onEurosConsumptionButtonToggle(!isEurosButtonToggled)}
                        checked={isEurosButtonToggled}
                        inputProps={{ 'aria-label': 'euros-consumption-switcher' }}
                    />
                )}
                <div style={{ height: 28 }}>
                    <MyConsumptionPeriod
                        setPeriod={onPeriodChange}
                        setRange={onRangeChange}
                        setMetricsInterval={setMetricsInterval}
                        range={range}
                    />
                </div>
                <TargetMenuGroup
                    removeTargets={() => onTemperatureOrPmaxMenuClick([])}
                    addTargets={onTemperatureOrPmaxMenuClick}
                    hidePmax={hidePmax}
                    activeButton={targetMenuActiveButton}
                />
                {!mdDown && period === 'daily' && <ConsumptionIdentifierButton size="small" className="px-16" />}
            </div>
            <div>
                <MyConsumptionDatePicker
                    period={period}
                    setRange={onRangeChange}
                    range={range}
                    handleYears={handleYearsOfDatePicker}
                    isPreviousButtonDisabling={disablePreviousYearOfNavigationButton}
                />
            </div>

            {isMetricsLoading || isAdditionalMetricsLoading ? (
                <div className="flex h-full w-full flex-col items-center justify-center" style={{ height: '320px' }}>
                    <CircularProgress style={{ color: theme.palette.background.paper }} />
                </div>
            ) : (
                <MyConsumptionChart
                    data={consumptionChartData}
                    period={period}
                    axisColor={theme.palette.common.black}
                    totalConsumption={totalConsumption}
                    totalEuroCost={totalEuroCost}
                    onDisplayTooltipLabel={onDisplayTooltipLabel}
                />
            )}
            <DefaultContractWarning isShowWarning={isEurosButtonToggled && Boolean(hasMissingHousingContracts)} />
            <ConsumptionEnedisSgeWarning isShowWarning={enedisSgeOff && sgeConsentFeatureState} />
            {mdDown && period === 'daily' && (
                <div className="flex justify-center px-24 py-8">
                    <ConsumptionIdentifierButton fullWidth />
                </div>
            )}
        </div>
    )
}
