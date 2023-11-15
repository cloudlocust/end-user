import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useTheme } from '@mui/material'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { IMetric, metricTargetsEnum, metricTargetType } from 'src/modules/Metrics/Metrics.d'
import { ConsumptionChartContainerProps } from 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChartTypes.d'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
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
} from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartWarnings'
import { isProductionActiveAndHousingHasAccess, sgeConsentFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import TargetMenuGroup from 'src/modules/MyConsumption/components/TargetMenuGroup'
import CloseIcon from '@mui/icons-material/Close'
import { SwitchIdleConsumption } from 'src/modules/MyConsumption/components/SwitchIdleConsumption'
import {
    eurosConsumptionTargets,
    eurosIdleConsumptionTargets,
    idleConsumptionTargets,
    temperatureOrPmaxTargets,
} from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import MyConsumptionChart from 'src/modules/MyConsumption/components/MyConsumptionChart'

/**
 * MyConsumptionChartContainer Component.
 *
 * @param props N/A.
 * @param props.period Indicates the current selected Period if it's monthly or daily or yearly or weekly so that we format tooltip and xAxis of chart according to the period.
 * @param props.range Current range so that we handle the xAxis values according to period and range selected.
 * @param props.metricsInterval Boolean state to know whether the stacked option is true or false.
 * @param props.filters Consumption or production chart type.
 * @param props.hasMissingHousingContracts Consumption or production chart type.
 * @param props.enedisSgeConsent Consumption or production chart type.
 * @param props.isSolarProductionConsentOff Boolean indicating if solar production consent is off.
 * @param props.currentHousingScopes Current housingscopes.
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
    currentHousingScopes,
}: ConsumptionChartContainerProps) => {
    const theme = useTheme()
    const [isShowIdleConsumptionDisabledInfo, setIsShowIdleConsumptionDisabledInfo] = useState(false)

    // Handling the targets makes it simpler instead of the useMetrics as it's a straightforward array of metricTargetType
    // Meanwhile the setTargets for useMetrics needs to add {type: 'timeserie'} everytime...
    const [targets, setTargets] = useState<metricTargetType[]>(
        getDefaultConsumptionTargets(isSolarProductionConsentOff),
    )

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

    // When switching to period daily, if Euros Charts or Idle charts buttons are selected, metrics should be reset.
    // This useEffect reset metrics.
    useEffect(() => {
        if (isMetricRequestNotAllowed) setTargets(getDefaultConsumptionTargets(isSolarProductionConsentOff))
    }, [isMetricRequestNotAllowed, isSolarProductionConsentOff])

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

    const isEurosConsumptionDisabled = !isEurosButtonToggled && period === 'daily'

    const getMetrics = useCallback(async () => {
        if (isMetricRequestNotAllowed) return
        setIsShowIdleConsumptionDisabledInfo(false)
        await getMetricsWithParams({ interval: metricsInterval, range, targets, filters })
    }, [getMetricsWithParams, metricsInterval, range, targets, filters, isMetricRequestNotAllowed])

    // Happens everytime getMetrics dependencies change, and doesn't execute when hook is instanciated.
    useEffect(() => {
        getMetrics()
    }, [getMetrics])

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
                const fileteredMetricsData = filterMetricsData(chartData, period, isSolarProductionConsentOff)
                if (fileteredMetricsData) chartData = fileteredMetricsData
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
                        : getDefaultConsumptionTargets(isSolarProductionConsentOff)
                }
                return newVisibleTargets
            })
        },
        [isSolarProductionConsentOff, isIdleSwitchToggled],
    )

    /**
     * Handler when switching to IdleTarget On ConsumptionSwitchButton.
     *
     * @param isIdleConsumptionToggled Indicates if the idleConsumption was selected.
     */
    const onIdleConsumptionSwitchButton = useCallback(
        async (isIdleConsumptionToggled: boolean) => {
            setTargets((_prevTargets) => {
                if (isIdleConsumptionToggled)
                    return isEurosButtonToggled ? eurosIdleConsumptionTargets : idleConsumptionTargets
                return isEurosButtonToggled
                    ? eurosConsumptionTargets
                    : getDefaultConsumptionTargets(isSolarProductionConsentOff)
            })
        },
        [isEurosButtonToggled, isSolarProductionConsentOff],
    )

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
                        style={{ color: theme.palette.primary.contrastText }}
                    >
                        {period === 'daily' ? 'Ma puissance' : 'Ma consommation'}
                    </TypographyFormatMessage>
                    {/* Consommation Watt par jour / Semaine / Mois / Année */}
                    <TypographyFormatMessage variant="h5" style={{ color: theme.palette.primary.contrastText }}>
                        {showPerPeriodText('consumption', period, isEurosButtonToggled)}
                    </TypographyFormatMessage>
                </motion.div>
            </div>

            {/* SwitchIdleConsumption Info Text*/}
            {isShowIdleConsumptionDisabledInfo && !isProductionActiveAndHousingHasAccess(currentHousingScopes) && (
                <Box
                    className="flex items-center justify-between text-13 md:text-16 w-full p-16 my-16"
                    sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}
                >
                    <TypographyFormatMessage
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        Les informations de veille ne sont pas disponibles pour cette pèriode
                    </TypographyFormatMessage>
                    <CloseIcon className="cursor-pointer" onClick={() => setIsShowIdleConsumptionDisabledInfo(false)} />
                </Box>
            )}

            <div className="my-16 flex justify-between">
                <EurosConsumptionButtonToggler
                    onEuroClick={() => onEurosConsumptionButtonToggle(true)}
                    onConsumptionClick={() => onEurosConsumptionButtonToggle(false)}
                    showEurosConsumption={!isEurosButtonToggled}
                    disabled={isEurosConsumptionDisabled}
                />
                <SwitchIdleConsumption
                    removeIdleTarget={() => onIdleConsumptionSwitchButton(false)}
                    addIdleTarget={() => onIdleConsumptionSwitchButton(true)}
                    isIdleConsumptionButtonDisabled={
                        period === 'daily' || isProductionActiveAndHousingHasAccess(currentHousingScopes)
                    }
                    onClickIdleConsumptionDisabledInfoIcon={() => setIsShowIdleConsumptionDisabledInfo(true)}
                    isIdleConsumptionButtonSelected={isIdleSwitchToggled}
                />
                <TargetMenuGroup
                    removeTargets={() => onTemperatureOrPmaxMenuClick([])}
                    addTargets={onTemperatureOrPmaxMenuClick}
                    hidePmax={hidePmax}
                    activeButton={targetMenuActiveButton}
                />
            </div>

            {isMetricsLoading ? (
                <div className="flex h-full w-full flex-col items-center justify-center" style={{ height: '320px' }}>
                    <CircularProgress style={{ color: theme.palette.background.paper }} />
                </div>
            ) : (
                <MyConsumptionChart
                    data={consumptionChartData}
                    period={period}
                    isSolarProductionConsentOff={isSolarProductionConsentOff}
                />
            )}
            <DefaultContractWarning isShowWarning={isEurosButtonToggled && Boolean(hasMissingHousingContracts)} />
            <ConsumptionEnedisSgeWarning isShowWarning={enedisSgeOff && sgeConsentFeatureState} />
        </div>
    )
}
