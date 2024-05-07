import { useState, useEffect, useMemo, useCallback } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import dayjs from 'dayjs'
import { useHistory } from 'react-router-dom'
import { useMetrics, useAdditionalMetrics } from 'src/modules/Metrics/metricsHook'
import { useTheme, Typography } from '@mui/material'
import { IMetric, metricTargetsEnum, metricTargetType, metricIntervalType } from 'src/modules/Metrics/Metrics.d'
import { ConsumptionChartContainerProps } from 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChartTypes.d'
import CircularProgress from '@mui/material/CircularProgress'
import EurosConsumptionButtonToggler from 'src/modules/MyConsumption/components/EurosConsumptionButtonToggler'
import {
    getTotalOffIdleConsumptionData,
    filterMetricsData,
    getDefaultConsumptionTargets,
    nullifyTodayIdleConsumptionValue,
    getDateWithTimezoneOffset,
    getRangeV2,
} from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import {
    DefaultContractWarning,
    ConsumptionEnedisSgeWarning,
    MissingDataWarning,
} from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartWarnings'
import { sgeConsentFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import TargetMenuGroup from 'src/modules/MyConsumption/components/TargetMenuGroup'
import { SwitchConsumptionButton } from 'src/modules/MyConsumption/components/SwitchConsumptionButton'
import {
    eurosConsumptionTargets,
    eurosIdleConsumptionTargets,
    idleConsumptionTargets,
    temperatureOrPmaxTargets,
    dataConsumptionPeriod,
} from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import MyConsumptionChart from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { SwitchConsumptionButtonTypeEnum } from 'src/modules/MyConsumption/components/SwitchConsumptionButton/SwitchConsumptionButton.types'
import { useMyConsumptionStore } from 'src/modules/MyConsumption/store/myConsumptionStore'
import { useIntl } from 'src/common/react-platform-translation'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { getMessageOfSuccessiveMissingDataOfCurrentDay } from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartFunctions'
import { MyConsumptionPeriod } from 'src/modules/MyConsumption'
import MyConsumptionDatePicker from 'src/modules/MyConsumption/components/MyConsumptionDatePicker'
import {
    EChartTooltipFormatterParams,
    TooltipValueFormatter,
} from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartTooltip/ConsumptionChartTooltip.types'
import { ConsumptionChartTooltip } from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartTooltip'
import { parseXAxisLabelToDate } from 'src/modules/MyConsumption/components/MyConsumptionChart/consumptionChartOptions'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'
import { ConsumptionChartHeaderButton } from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartHeaderButton'
import { URL_CONSUMPTION_LABELIZATION } from 'src/modules/MyConsumption/MyConsumptionConfig'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'

/**
 * Const represent how many years we want to display on the calender in the yearly view.
 */
export const NUMBER_OF_LAST_YEARS_TO_DISPLAY_IN_DATE_PICKER_OF_YEARLY_VIEW = 3

/**
 * The URL for the solar installation recommendation.
 */
export const URL_SOLAR_INSTALLATION_RECOMMENDATION = 'https://e0vzc8h9q32.typeform.com/to/pNFEjfzU'

/**
 * Function to get the url for the housing information page.
 *
 * @param housingId The housing id.
 * @returns The url for the housing information page.
 */
export const URL_HOUSING_INFORMATION = (housingId: number) => `/my-houses/${housingId}/information`

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
}: // eslint-disable-next-line sonarjs/cognitive-complexity
ConsumptionChartContainerProps) => {
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const history = useHistory()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { consumptionToggleButton, setConsumptionToggleButton, setPartiallyYearlyDataExist } = useMyConsumptionStore()

    // Handling the targets makes it simpler instead of the useMetrics as it's a straightforward array of metricTargetType
    const [targets, setTargets] = useState<metricTargetType[]>(
        getDefaultConsumptionTargets(SwitchConsumptionButtonTypeEnum.Consumption),
    )
    const isAutoConsumptionProductionShown = !isSolarProductionConsentOff

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
            // If the user is on daily view and clicks on the idle button, we should switch to weekly view.
            if (buttonType === SwitchConsumptionButtonTypeEnum.Idle && period === PeriodEnum.DAILY) {
                const dataConsumptionWeeklyPeriod = dataConsumptionPeriod.find(
                    (item) => item.period === PeriodEnum.WEEKLY,
                )!
                onPeriodChange(dataConsumptionWeeklyPeriod.period)
                onRangeChange(getRangeV2(dataConsumptionWeeklyPeriod.period))
                setMetricsInterval(dataConsumptionWeeklyPeriod.interval as metricIntervalType)
            }
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
        [
            getAutoconsumptionProductionTargets,
            getConsumptionTargets,
            isEurosButtonToggled,
            onPeriodChange,
            onRangeChange,
            period,
            setMetricsInterval,
        ],
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
     * Callback to return the total consumption of hovered element based on the additional metrics data.
     * If `isTotalsOnChartTooltipDisplayed` is true and `additionalMetricsData` has items.
     * Otherwise, it returns undefined.
     *
     * @param additionalMetricsData - The additional metrics data used to calculate the total consumption.
     * @param isTotalsOnChartTooltipDisplayed - A flag indicating whether to display the total consumption on the chart tooltip.
     * @returns The total consumption or undefined.
     */
    const getTotalConsumption = useCallback(
        (index: number) => {
            if (isTotalsOnChartTooltipDisplayed && additionalMetricsData.length > 0) {
                const consumptionMetrics = additionalMetricsData.find(
                    (item) => item.target === metricTargetsEnum.consumption,
                )
                const originalValue = consumptionMetrics!.datapoints[index][0]
                if (originalValue !== null) {
                    return consumptionWattUnitConversion(originalValue)
                }
            }
        },
        [additionalMetricsData, isTotalsOnChartTooltipDisplayed],
    )

    /**
     * Callback to calculates the total cost in euros of hovered element based on the additional metrics data.
     * If isTotalsOnChartTooltipDisplayed is true and additionalMetricsData has at least one item.
     * Otherwise, the total cost is undefined.
     *
     * @param additionalMetricsData - The additional metrics data used to calculate the total cost.
     * @param isTotalsOnChartTooltipDisplayed - A flag indicating whether to display the total cost on the chart tooltip.
     * @returns The total cost in euros or undefined.
     */
    const getTotalEuroCost = useCallback(
        (index: number) => {
            if (isTotalsOnChartTooltipDisplayed && additionalMetricsData.length > 0) {
                const eurosConsumptionMetrics = additionalMetricsData.find(
                    (item) => item.target === metricTargetsEnum.eurosConsumption,
                )
                const originalValue = eurosConsumptionMetrics!.datapoints[index][0]
                if (originalValue !== null)
                    return {
                        value: Number(originalValue.toFixed(2)),
                        unit: '€',
                    }
            }
        },
        [additionalMetricsData, isTotalsOnChartTooltipDisplayed],
    )

    const messageOfSuccessiveMissingDataOfCurrentDay = useMemo(() => {
        return getMessageOfSuccessiveMissingDataOfCurrentDay(consumptionChartData, period, range)
    }, [consumptionChartData, period, range])

    // Callback to check if the range is in the current year.
    const isRangeInCurrentYear = useCallback(() => {
        return new Date(range.from).getFullYear() === new Date().getFullYear()
    }, [range.from])

    /**
     * Checks if all yearly consumption data is available.
     *
     * @returns {boolean} True if all yearly data is available, false otherwise.
     */
    const checkIfAllYearlyDataExist = useCallback(() => {
        return (
            consumptionChartData.length > 0 &&
            Array.from({ length: 12 }).every((_element, index) => {
                // In the current year, we ignore the future months.
                if (isRangeInCurrentYear() && index > new Date().getMonth()) return true
                return consumptionChartData.some((item) => {
                    return item.datapoints[index] && !!item.datapoints[index][0]
                })
            })
        )
    }, [consumptionChartData, isRangeInCurrentYear])

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
     * We use this hook to check if the data is partially available for yearly period.
     */
    useEffect(() => {
        if (period === PeriodEnum.YEARLY && !isRangeInCurrentYear()) {
            setPartiallyYearlyDataExist(consumptionChartData.length > 0)
        }
    }, [consumptionChartData, period, setPartiallyYearlyDataExist, isRangeInCurrentYear, range])

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

    const onDisplayTooltipLabel = useCallback((label) => {
        return label.value !== null && label.value !== undefined
    }, [])

    /**
     *  Function for rendering a component when all labels are missing in the tooltip.
     */
    const renderComponentOnMissingLabels = useCallback(
        (params: EChartTooltipFormatterParams) => {
            // get the xAxis value.
            const xAxisValue = params[0].axisValue
            const xAxisValueDate = parseXAxisLabelToDate(xAxisValue, period, range)
            const currentDate = dayjs()
            // check if the xAxis value is in the past using dayjs (in the weekly and monthly periods, we don't have the data for the current day, so we don't count it).
            const isHoveredOnPastTime = xAxisValueDate.isBefore(
                // in yealy
                period === PeriodEnum.DAILY || period === PeriodEnum.YEARLY
                    ? currentDate
                    : currentDate.subtract(1, 'day'),
            )
            // display message only if the xAxis value is in the past.
            if (isHoveredOnPastTime) {
                return (
                    <div className="py-6 max-w-320 whitespace-pre-wrap">
                        <p>
                            {formatMessage({
                                id: 'Aucune donnée transmise par le Linky ou par le nrLINK',
                                defaultMessage: 'Aucune donnée transmise par le Linky ou par le nrLINK',
                            })}
                        </p>
                    </div>
                )
            }
            return null
        },
        [formatMessage, period, range],
    )

    /**
     * Handles the change of period.
     *
     * @param {PeriodEnum} value - The new period value.
     */
    const handlePeriodChange = (value: PeriodEnum) => {
        // if the user on the idle view and click on the daily button, we should switch to the consumption view.
        if (value === PeriodEnum.DAILY && consumptionToggleButton === SwitchConsumptionButtonTypeEnum.Idle) {
            setConsumptionToggleButton(SwitchConsumptionButtonTypeEnum.Consumption)
            onSwitchConsumptionButton(SwitchConsumptionButtonTypeEnum.Consumption)
        }
        onPeriodChange(value)
    }

    /**
     * Function to navigate to the consumption labeliation page.
     */
    const navigateToConsumptionLabelizationPage = () => {
        history.push(URL_CONSUMPTION_LABELIZATION)
    }

    /**
     * Function to navigate to the solar installation form.
     */
    const navigateToSolarInstallationForm = () => {
        if (currentHousing?.id) {
            history.push(URL_HOUSING_INFORMATION(currentHousing.id), {
                focusOnInstallationForm: true,
            })
        }
    }

    /**
     * Function that open the solar installation recommendation page on a new tab.
     */
    const openSolarInstallationRecommendationPage = () => {
        window.open(URL_SOLAR_INSTALLATION_RECOMMENDATION, '_blank', 'noopener noreferrer')
    }

    const NAVIGATE_TO_LABELIZATION_PAGE_BUTTON_TEXT = formatMessage({
        id: 'Identifier un pic de conso',
        defaultMessage: 'Identifier un pic de conso',
    })

    const NAVIGATE_TO_SOLAR_INSTALLATION_FORM_BUTTON_TEXT = formatMessage({
        id: 'Mon installation solaire',
        defaultMessage: 'Mon installation solaire',
    })

    const RECOMMEND_INSTALLER_BUTTON_TEXT = formatMessage({
        id: 'Recommander mon installateur',
        defaultMessage: 'Recommander mon installateur',
    })

    return (
        <div className="mb-12">
            {(isIdleShown || isAutoConsumptionProductionShown) && (
                <div className="pb-8 w-full flex justify-center">
                    <SwitchConsumptionButton
                        onSwitchConsumptionButton={onSwitchConsumptionButton}
                        isIdleShown={isIdleShown}
                        isAutoConsumptionProductionShown={isAutoConsumptionProductionShown}
                    />
                </div>
            )}

            <div className="flex flex-col items-start gap-8 my-8">
                {consumptionToggleButton === SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction ? (
                    <>
                        <ConsumptionChartHeaderButton
                            text={NAVIGATE_TO_SOLAR_INSTALLATION_FORM_BUTTON_TEXT}
                            icon="⚙️"
                            buttonColor="#EDECEC"
                            textColor="#818A91"
                            clickHandler={navigateToSolarInstallationForm}
                            data-testid="linkToSolarInstallationForm"
                        />
                        <ConsumptionChartHeaderButton
                            text={RECOMMEND_INSTALLER_BUTTON_TEXT}
                            icon="💖"
                            buttonColor="#F9E1E1"
                            textColor="#818A91"
                            clickHandler={openSolarInstallationRecommendationPage}
                            data-testid="solarInstallationRecommendationButton"
                        />
                    </>
                ) : (
                    period === 'daily' && (
                        <ConsumptionChartHeaderButton
                            text={NAVIGATE_TO_LABELIZATION_PAGE_BUTTON_TEXT}
                            hasBorder
                            clickHandler={navigateToConsumptionLabelizationPage}
                            data-testid="linkToLabelizationPage"
                        />
                    )
                )}
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
                        setPeriod={handlePeriodChange}
                        setRange={onRangeChange}
                        setMetricsInterval={setMetricsInterval}
                        range={range}
                        period={period}
                        hidePeriods={
                            // Hide daily period when the consumption toggle button is on idle.
                            consumptionToggleButton === SwitchConsumptionButtonTypeEnum.Idle ? [PeriodEnum.DAILY] : []
                        }
                    />
                </div>
                <TargetMenuGroup
                    removeTargets={() => onTemperatureOrPmaxMenuClick([])}
                    addTargets={onTemperatureOrPmaxMenuClick}
                    hidePmax={hidePmax}
                    activeButton={targetMenuActiveButton}
                />
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
                <>
                    {messageOfSuccessiveMissingDataOfCurrentDay && (
                        <div className="flex justify-center mt-32">
                            <Typography
                                className="max-w-screen-md text-center"
                                style={{ color: theme.palette.common.black }}
                            >
                                {messageOfSuccessiveMissingDataOfCurrentDay}
                            </Typography>
                        </div>
                    )}
                    <MyConsumptionChart
                        data={consumptionChartData}
                        period={period}
                        axisColor={theme.palette.common.black}
                        tooltipFormatter={(
                            params: EChartTooltipFormatterParams,
                            valueFormatter?: TooltipValueFormatter,
                        ) =>
                            renderToStaticMarkup(
                                <ConsumptionChartTooltip
                                    params={params}
                                    valueFormatter={valueFormatter}
                                    getTotalConsumption={getTotalConsumption}
                                    getTotalEuroCost={getTotalEuroCost}
                                    onDisplayTooltipLabel={onDisplayTooltipLabel}
                                    renderComponentOnMissingLabels={renderComponentOnMissingLabels}
                                />,
                            )
                        }
                    />
                </>
            )}
            {period === PeriodEnum.YEARLY && !isMetricsLoading && !checkIfAllYearlyDataExist() && (
                <MissingDataWarning />
            )}
            <DefaultContractWarning isShowWarning={isEurosButtonToggled && Boolean(hasMissingHousingContracts)} />
            <ConsumptionEnedisSgeWarning isShowWarning={enedisSgeOff && sgeConsentFeatureState} />
        </div>
    )
}
