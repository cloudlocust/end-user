import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import MyConsumptionChart from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { useTheme } from '@mui/material'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { IMetric, metricTargetsEnum, metricTargetType } from 'src/modules/Metrics/Metrics.d'
import { ConsumptionChartContainerProps } from 'src/modules/MyConsumption/myConsumptionTypes'
import CircularProgress from '@mui/material/CircularProgress'
import EurosConsumptionButtonToggler from 'src/modules/MyConsumption/components/EurosConsumptionButtonToggler'
import {
    getTotalOffIdleConsumptionData,
    getVisibleTargetCharts,
    showPerPeriodText,
} from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import {
    DefaultContractWarning,
    ConsumptionEnedisSgeWarning,
} from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartWarnings'
import { sgeConsentFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import TargetMenuGroup from 'src/modules/MyConsumption/components/TargetMenuGroup'
import { SwitchIdleConsumption } from 'src/modules/MyConsumption/components/SwitchIdleConsumption'

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
    // Indicates if enphaseConsentState is not ACTIVE
    const enphaseOff = enphaseConsent?.enphaseConsentState !== 'ACTIVE'
    const [visibleTargetCharts, setVisibleTargetsCharts] = useState<metricTargetType[]>(
        getVisibleTargetCharts(enphaseOff),
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
    const [consumptionChartData, setConsumptionChartData] = useState<IMetric[]>(data)

    // This state represents whether or not the chart is stacked: true.
    const isStackedEnabled = useMemo(() => {
        // eslint-disable-next-line sonarjs/prefer-single-boolean-return
        if (
            period !== 'daily' &&
            visibleTargetCharts.some(
                (target) =>
                    target === metricTargetsEnum.pMax ||
                    target === metricTargetsEnum.internalTemperature ||
                    target === metricTargetsEnum.externalTemperature,
            )
        ) {
            return false
        } else if (
            period === 'daily' &&
            visibleTargetCharts.includes(metricTargetsEnum.consumption || metricTargetsEnum.baseConsumption)
        ) {
            return false
        } else {
            return true
        }
    }, [period, visibleTargetCharts])

    const isEurosConsumptionChart = useMemo(
        () => visibleTargetCharts.includes(metricTargetsEnum.baseEuroConsumption),
        [visibleTargetCharts],
    )

    const isEurosConsumptionDisabled = !isEurosConsumptionChart && period === 'daily'

    const getMetrics = useCallback(async () => {
        await getMetricsWithParams({ interval: metricsInterval, range, targets: visibleTargetCharts, filters })
    }, [getMetricsWithParams, metricsInterval, range, visibleTargetCharts, filters])

    // Happens everytime getMetrics dependencies change, and doesn't execute when hook is instanciated.
    useEffect(() => {
        getMetrics()
    }, [getMetrics])

    useEffect(() => {
        // To avoid multiple rerendering and thus calculation in MyConsumptionChart, CosnumptionChartData change only once, when visibleTargetChart change or when the first getMetrics targets is loaded, thus avoiding to rerender when the second getMetrics is loaded with all targets which should only happen in the background.
        if (data.length > 0) {
            let chartData = data.filter((datapoint) => visibleTargetCharts.includes(datapoint.target))
            const totalOffIdleConsumptionData = getTotalOffIdleConsumptionData(chartData)
            if (totalOffIdleConsumptionData) chartData = [totalOffIdleConsumptionData, ...chartData]
            setConsumptionChartData(chartData)
        }
    }, [data, visibleTargetCharts])

    /**
     * Show given metric target chart.
     *
     * @param targets Metric targets.
     */
    const showMetricTargetChart = useCallback(
        async (targets: metricTargetType[], isEuroChart?: boolean) => {
            if (enphaseOff && targets.includes(metricTargetsEnum.autoconsumption)) return
            setVisibleTargetsCharts(isEuroChart ? [...targets] : [...getVisibleTargetCharts(enphaseOff), ...targets])
        },
        [enphaseOff],
    )

    /**
     * Hide given metric target chart.
     */
    const resetMetricsTargets = useCallback(async () => {
        setVisibleTargetsCharts([...getVisibleTargetCharts(enphaseOff)])
    }, [enphaseOff])

    /**
     * Handler when switching to IdleTarget On ConsumptionSwitchButton.
     */
    const onIdleConsumptionSwitchButton = useCallback(async () => {
        setVisibleTargetsCharts([metricTargetsEnum.idleConsumption, ...getVisibleTargetCharts(true)])
    }, [])

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
                    removeTarget={resetMetricsTargets}
                    addTarget={showMetricTargetChart}
                    showEurosConsumption={!isEurosConsumptionChart}
                    disabled={isEurosConsumptionDisabled}
                />
                <SwitchIdleConsumption
                    removeIdleTarget={resetMetricsTargets}
                    addIdleTarget={onIdleConsumptionSwitchButton}
                    isIdleConsumptionButtonDisabled={period === 'daily'}
                />
                <TargetMenuGroup
                    removeTarget={resetMetricsTargets}
                    addTarget={showMetricTargetChart}
                    hidePmax={hidePmax}
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
                    range={range}
                    isStackedEnabled={isStackedEnabled}
                    chartType="consumption"
                    chartLabel={enphaseOff ? 'Consommation totale' : 'Electricité achetée sur le réseau'}
                    metricsInterval={metricsInterval}
                    enphaseOff={enphaseOff}
                />
            )}
            <DefaultContractWarning isShowWarning={isEurosConsumptionChart && Boolean(hasMissingHousingContracts)} />
            <ConsumptionEnedisSgeWarning isShowWarning={enedisSgeOff && sgeConsentFeatureState} />
        </div>
    )
}
