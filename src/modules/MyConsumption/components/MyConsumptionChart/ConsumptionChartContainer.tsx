import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import MyConsumptionChart from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { useTheme } from '@mui/material'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { IMetric, metricTargetsEnum, metricTargetType } from 'src/modules/Metrics/Metrics.d'
import { ConsumptionChartContainerProps } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import CircularProgress from '@mui/material/CircularProgress'
import EurosConsumptionButtonToggler from 'src/modules/MyConsumption/components/EurosConsumptionButtonToggler'
import {
    filterPmaxAndEurosConsumptionTargetFromVisibleChartTargets,
    showPerPeriodText,
} from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import {
    ConsumptionChartTargets,
    EnphaseOffConsumptionChartTargets,
} from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { targetOptions } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import {
    DefaultContractWarning,
    ConsumptionEnedisSgeWarning,
} from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartWarnings'
import { sgeConsentFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import TargetMenuGroup from 'src/modules/MyConsumption/components/TargetMenuGroup'

/**
 * MyConsumptionChart Component.
 *
 * @param props N/A.
 * @param props.period Indicates the current selected Period if it's monthly or daily or yearly or weekly so that we format tooltip and xAxis of chart according to the period.
 * @param props.range Current range so that we handle the xAxis values according to period and range selected.
 * @param props.metricsInterval Boolean state to know whether the stacked option is true or false.
 * @param props.filters Consumption or production chart type.
 * @param props.hasMissingHousingContracts Consumption or production chart type.
 * @param props.enedisSgeConsent Consumption or production chart type.
 * @param props.enphaseConsent Consumption or production chart type.
 * @returns MyConsumptionChart Component.
 */
export const ConsumptionChartContainer = ({
    period,
    range,
    metricsInterval,
    filters,
    hasMissingHousingContracts,
    enedisSgeConsent,
    enphaseConsent,
}: ConsumptionChartContainerProps) => {
    const theme = useTheme()
    // This state represents whether or not the chart is displaying a spinner, which should happen only when we request the current metrics, not the request of all metrics that happens in the background.
    const [isConsumptionChartLoading, setIsConsumptionChartLoading] = useState<boolean>(true)
    // Indicates if enphaseConsentState is not ACTIVE
    const enphaseOff = enphaseConsent?.enphaseConsentState !== 'ACTIVE'
    // Visible Targets will influence k
    const [visibleTargetCharts, setVisibleTargetsCharts] = useState<metricTargetType[]>(
        enphaseOff
            ? [metricTargetsEnum.consumption]
            : [metricTargetsEnum.autoconsumption, metricTargetsEnum.consumption],
    )
    // Indicates if enedisSgeConsent is not Connected
    const enedisSgeOff = enedisSgeConsent?.enedisSgeConsentState !== 'CONNECTED'
    const hidePmax = period === 'daily' || enedisSgeOff

    // Track the change of visibleTargetCharts, so that we don't call getMetrics when visibleTargetCharts change (and thus no request when showing / hiding target in MyConsumptionChart).
    const isVisibleTargetChartsChanged = useRef(false)
    const { data, getMetricsWithParams } = useMetrics({
        interval: metricsInterval,
        range: range,
        targets: [
            {
                target: metricTargetsEnum.consumption,
                type: 'timeserie',
            },
            {
                target: metricTargetsEnum.autoconsumption,
                type: 'timeserie',
            },
        ],
        filters,
    })

    const [consumptionChartData, setConsumptionChartData] = useState<IMetric[]>(data)

    // This state represents whether or not the chart is stacked: true.
    const isStackedEnabled = useMemo(
        () =>
            !visibleTargetCharts.some((visibleTargetChart) =>
                targetOptions.includes(visibleTargetChart as metricTargetsEnum),
            ),
        [visibleTargetCharts],
    )

    const isEurosConsumptionChart = useMemo(
        () => visibleTargetCharts.includes(metricTargetsEnum.eurosConsumption),
        [visibleTargetCharts],
    )

    const isEurosConsumptionDisabled = !isEurosConsumptionChart && period === 'daily'

    // State that stores if visibleTargetCharts contains pMax or eurosConsumption when period is euros, so that when period is "daily". With this variable we prevent getMetrics to execute until we remove € and pMax targets.
    const isEurosConsumptionOrPmaxVisibleTargetChartOnPeriodDaily = useMemo(() => {
        return (
            period === 'daily' &&
            (visibleTargetCharts.includes(metricTargetsEnum.eurosConsumption) ||
                visibleTargetCharts.includes(metricTargetsEnum.pMax))
        )
    }, [period, visibleTargetCharts])

    useEffect(() => {
        // When period is daily, remove target pMax or eurosConsumption from visibleTargetCharts and thus when calling getMetrics it won't have these targets.
        if (period === 'daily') {
            setVisibleTargetsCharts((prevState) =>
                filterPmaxAndEurosConsumptionTargetFromVisibleChartTargets(prevState),
            )
        }
    }, [period])

    useEffect(() => {
        // Resetting isVisibleTargetChartsChanged when range, filters or metricsInterval change so that we can call getMetrics only when these change.
        isVisibleTargetChartsChanged.current = false
    }, [filters, range, metricsInterval])

    const customEnphaseOffConsumptionChartTargets = useMemo(
        () =>
            metricsInterval === '1d' || metricsInterval === '1M'
                ? [...EnphaseOffConsumptionChartTargets, metricTargetsEnum.subscriptionPrices]
                : EnphaseOffConsumptionChartTargets,
        [metricsInterval],
    )

    // Desire behaviour is to focus on calling getMetrics on the active target show in MyConsumptionChart, and handle the spinner only for those targets.
    // Then in the background fetching the remaining targets, and will not show a spinner and will be done without any user experience knowing it.
    const getMetrics = useCallback(async () => {
        // Condition !isVisibleTargetCharts responsible for not calling getMetrics when toggling between targets through UI Buttons (€ consumption, Temperature, pMax)
        // Condition !isEurosConsumptionOrPmaxVisibleTargetCharts responsible for preventing getMetrics to be called when period changes to daily and there'll is pMax or eurosConsumption targets in the request. Those will be removed in a useEffect and getMetrics will be called.
        if (!isVisibleTargetChartsChanged.current && !isEurosConsumptionOrPmaxVisibleTargetChartOnPeriodDaily) {
            setIsConsumptionChartLoading(true)
            await getMetricsWithParams({ interval: metricsInterval, range, targets: visibleTargetCharts, filters })
            setIsConsumptionChartLoading(false)
            getMetricsWithParams({
                interval: metricsInterval,
                range,
                targets: enphaseOff ? customEnphaseOffConsumptionChartTargets : ConsumptionChartTargets,
                filters,
            })
        }
    }, [
        isEurosConsumptionOrPmaxVisibleTargetChartOnPeriodDaily,
        getMetricsWithParams,
        metricsInterval,
        range,
        visibleTargetCharts,
        filters,
        enphaseOff,
        customEnphaseOffConsumptionChartTargets,
    ])

    // Happens everytime getMetrics dependencies change, and doesn't execute when hook is instanciated.
    useEffect(() => {
        getMetrics()
    }, [getMetrics])

    useEffect(() => {
        // To avoid multiple rerendering and thus calculation in MyConsumptionChart, CosnumptionChartData change only once, when visibleTargetChart change or when the first getMetrics targets is loaded, thus avoiding to rerender when the second getMetrics is loaded with all targets which should only happen in the background.
        if (isVisibleTargetChartsChanged.current || data.length < EnphaseOffConsumptionChartTargets.length)
            setConsumptionChartData(data.filter((datapoint) => visibleTargetCharts.includes(datapoint.target)))
    }, [data, visibleTargetCharts])

    /**
     * Show given metric target chart.
     *
     * @param target Indicated target.
     */
    const showMetricTargetChart = (target: metricTargetType) => {
        if (enphaseOff && target === metricTargetsEnum.autoconsumption) return
        isVisibleTargetChartsChanged.current = true
        setVisibleTargetsCharts((prevState) => [...prevState, target])
    }

    /**
     * Hide given metric target chart.
     *
     * @param target Indicated target.
     */
    const hideMetricTargetChart = (target: metricTargetType) => {
        isVisibleTargetChartsChanged.current = true
        setVisibleTargetsCharts((prevState) => prevState.filter((visibleTarget) => visibleTarget !== target))
    }

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
                        {showPerPeriodText('consumption', period, isEurosConsumptionChart)}
                    </TypographyFormatMessage>
                </motion.div>
            </div>

            <div className="my-16 flex justify-between">
                <EurosConsumptionButtonToggler
                    removeTarget={hideMetricTargetChart}
                    addTarget={showMetricTargetChart}
                    showEurosConsumption={!isEurosConsumptionChart}
                    disabled={isEurosConsumptionDisabled}
                />
                <TargetMenuGroup
                    removeTarget={hideMetricTargetChart}
                    addTarget={showMetricTargetChart}
                    hidePmax={hidePmax}
                />
            </div>

            {isConsumptionChartLoading ? (
                <div className="flex h-full w-full flex-col items-center justify-center" style={{ height: '320px' }}>
                    <CircularProgress style={{ color: theme.palette.background.paper }} />
                </div>
            ) : (
                <MyConsumptionChart
                    data={consumptionChartData}
                    period={period}
                    range={range}
                    isStackedEnabled={isStackedEnabled}
                    chartType="consumption"
                    chartLabel={enphaseOff ? 'Consommation totale' : 'Electricité achetée sur le réseau'}
                    metricsInterval={metricsInterval}
                />
            )}
            <DefaultContractWarning isShowWarning={isEurosConsumptionChart && Boolean(hasMissingHousingContracts)} />
            <ConsumptionEnedisSgeWarning isShowWarning={enedisSgeOff && sgeConsentFeatureState} />
        </div>
    )
}
