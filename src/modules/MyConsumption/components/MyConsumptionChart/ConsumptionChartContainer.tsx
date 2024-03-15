import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useTheme } from '@mui/material'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
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
} from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import MyConsumptionChart from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { SwitchConsumptionButtonTypeEnum } from 'src/modules/MyConsumption/components/SwitchConsumptionButton/SwitchConsumptionButton.types'
import { useMyConsumptionStore } from 'src/modules/MyConsumption/store/myConsumptionStore'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'

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
}: ConsumptionChartContainerProps) => {
    const theme = useTheme()

    //! This change is temporary, do not delete the commented code.
    // const history = useHistory()
    // /**
    //  * Redirect to Labelization page.
    //  */
    // const handleClick = () => {
    //     history.push(URL_CONSUMPTION_LABELIZATION)
    // }

    const { consumptionToggleButton, setConsumptionToggleButton, setPartiallyYearlyDataExist } = useMyConsumptionStore()

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

    // Happens everytime getMetrics dependencies change, and doesn't execute when hook is instanciated.
    useEffect(() => {
        getMetrics()
    }, [getMetrics])

    /**
     * Checks if all yearly consumption data is available.
     *
     * @returns {boolean} True if all yearly data is available, false otherwise.
     */
    const checkIfAllYearlyDataExist = useCallback(() => {
        return (
            consumptionChartData.length > 0 &&
            Array.from({ length: 12 }).every((_element, index) => {
                return consumptionChartData.some((item) => {
                    return item.datapoints[index] && !!item.datapoints[index][0]
                })
            })
        )
    }, [consumptionChartData])

    // Callback to check if the range is in the current year.
    const isRangeInCurrentYear = useCallback(() => {
        return new Date(range.from).getFullYear() === new Date().getFullYear()
    }, [range])

    /**
     * We use this hook to check if the data is partially available for yearly period.
     */
    useEffect(() => {
        if (period === PeriodEnum.YEARLY && !isRangeInCurrentYear()) {
            setPartiallyYearlyDataExist(consumptionChartData.length > 0)
        }
    }, [consumptionChartData, period, setPartiallyYearlyDataExist, isRangeInCurrentYear, range])

    const isDefaultContractWarningShown = isEurosButtonToggled && Boolean(hasMissingHousingContracts)
    const isConsumptionEnedisSgeWarningShown = enedisSgeOff && sgeConsentFeatureState

    return (
        <div className="mb-12">
            <div className="relative flex flex-col md:flex-row items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-10 md:mb-0 flex flex-col items-center md:flex-row text-center"
                >
                    <TypographyFormatMessage
                        variant="h5"
                        className="sm:mr-8"
                        style={{ color: theme.palette.common.black }}
                    >
                        {period === 'daily' ? 'Ma puissance' : 'Ma consommation'}
                    </TypographyFormatMessage>
                    {/* Consommation Watt par jour / Semaine / Mois / Année */}
                    <TypographyFormatMessage variant="h5" style={{ color: theme.palette.common.black }}>
                        {showPerPeriodText('consumption', period, isEurosButtonToggled)}
                    </TypographyFormatMessage>
                </motion.div>
            </div>

            <div className="my-16 flex justify-between gap-10 h-40">
                {period !== 'daily' ? (
                    <div className="flex justify-center items-center mr-28">
                        <EurosConsumptionButtonToggler
                            onEurosConsumptionButtonToggle={onEurosConsumptionButtonToggle}
                            isEurosButtonToggled={isEurosButtonToggled}
                        />
                    </div>
                ) : (
                    //! This change is temporary, do not delete the commented code.
                    // <div style={{ width: 209 }} />
                    <div style={{ width: 64 }} />
                )}
                <div className="flex flex-auto justify-center" style={{ minWidth: 170 }}>
                    {(isIdleShown || isAutoConsumptionProductionShown) && (
                        <SwitchConsumptionButton
                            onSwitchConsumptionButton={onSwitchConsumptionButton}
                            isIdleShown={isIdleShown}
                            isAutoConsumptionProductionShown={isAutoConsumptionProductionShown}
                        />
                    )}
                </div>
                <div className="flex flex-row">
                    {/* 
                        //! This change is temporary, do not delete the commented code.
                        {period === 'daily' && (
                        <Button
                            onClick={handleClick}
                            sx={{
                                backgroundColor: 'primary.main',
                                color: 'primary.contrastText',
                                fontWeight: 500,
                                '&:hover': {
                                    backgroundColor: 'primary.light',
                                },
                            }}
                        >
                            Identifier une&nbsp;conso
                        </Button>
                    )} */}
                    <TargetMenuGroup
                        removeTargets={() => onTemperatureOrPmaxMenuClick([])}
                        addTargets={onTemperatureOrPmaxMenuClick}
                        hidePmax={hidePmax}
                        activeButton={targetMenuActiveButton}
                    />
                </div>
            </div>

            {isMetricsLoading ? (
                <div className="flex h-full w-full flex-col items-center justify-center" style={{ height: '320px' }}>
                    <CircularProgress style={{ color: theme.palette.background.paper }} />
                </div>
            ) : (
                <MyConsumptionChart
                    data={consumptionChartData}
                    period={period}
                    axisColor={theme.palette.common.black}
                />
            )}
            {period === PeriodEnum.YEARLY &&
                !isDefaultContractWarningShown &&
                !isConsumptionEnedisSgeWarningShown &&
                !isMetricsLoading &&
                !checkIfAllYearlyDataExist() && <MissingDataWarning />}
            <DefaultContractWarning isShowWarning={isDefaultContractWarningShown} />
            <ConsumptionEnedisSgeWarning isShowWarning={isConsumptionEnedisSgeWarningShown} />
        </div>
    )
}
