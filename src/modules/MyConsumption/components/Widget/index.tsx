import { memo, useMemo, useEffect, useRef, useContext } from 'react'
import { Grid, Card, CircularProgress, useTheme } from '@mui/material'
import { IWidgetProps, targetsInfosType } from 'src/modules/MyConsumption/components/Widget/Widget'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import {
    computeWidgetAssets,
    getWidgetPreviousRange,
    getWidgetRange,
    checkIfDataForConsumptionRelatedTargetWithNullValue,
    renderWidgetTitle,
    checkIfItIsCurrentDayRange,
} from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { computePercentageChange } from 'src/modules/Analysis/utils/computationFunctions'
import { WidgetItem } from 'src/modules/MyConsumption/components/WidgetItem'
import { ConsumptionWidgetsMetricsContext } from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/ConsumptionWidgetsMetricsContext'
import { metricTargetType, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useMyConsumptionStore } from 'src/modules/MyConsumption/store/myConsumptionStore'
import { SwitchConsumptionButtonTypeEnum } from 'src/modules/MyConsumption/components/SwitchConsumptionButton/SwitchConsumptionButton.types'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { useCurrentDayConsumption } from 'src/modules/MyConsumption/components/Widget/currentDayConsumptionHook'
const emptyValueUnit = { value: 0, unit: '' }

/**
 * Default no value message.
 */
export const DEFAULT_NO_VALUE_MESSAGE = 'Aucune donnée disponible'

/**
 * Widget Component.
 *
 * @param props N/A.
 * @param props.range Current range so that we handle the xAxis values according to period and range selected.
 * @param props.filters Metrics Filters.
 * @param props.infoIcons InfoIcon showed in top right of widgets.
 * @param props.targets Targets of the widget.
 * @param props.period Current Period.
 * @param props.childrenPosition .
 * @returns Widget Component.
 */
export const Widget = memo(
    ({
        filters,
        range,
        infoIcons,
        metricsInterval,
        targets,
        period,
        enphaseOff,
        children,
        childrenPosition = 'top',
    }: // eslint-disable-next-line sonarjs/cognitive-complexity
    IWidgetProps) => {
        const { consumptionToggleButton } = useMyConsumptionStore()
        const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
        const {
            currentDayConsumption,
            currentDayAutoConsumption,
            currentDayEuroConsumption,
            getCurrentDayConsumption,
            getCurrentDayEuroConsumption,
        } = useCurrentDayConsumption(currentHousing?.id)

        const isConsumptionTarget = useMemo(
            () =>
                targets.includes(metricTargetsEnum.consumption) ||
                targets.includes(metricTargetsEnum.autoconsumption) ||
                targets.includes(metricTargetsEnum.eurosConsumption),
            [targets],
        )

        const isCurrentDayRange = useMemo(() => checkIfItIsCurrentDayRange(period, range.from), [period, range.from])

        const { data, setMetricsInterval, getMetricsWithParams, setRange, isMetricsLoading } = useMetrics({
            interval: isConsumptionTarget && !isCurrentDayRange ? '1d' : metricsInterval,
            range: getWidgetRange(range, period),
            targets: targets.map((target) => ({
                target: target,
                type: 'timeserie',
            })),
            filters,
        })
        const {
            data: oldData,
            setMetricsInterval: setMetricsIntervalPrevious,
            getMetricsWithParams: getMetricsWithParamsPrevious,
            setRange: setRangePrevious,
        } = useMetrics({
            interval: isConsumptionTarget && !isCurrentDayRange ? '1d' : metricsInterval,
            range: getWidgetPreviousRange(getWidgetRange(range, period), period),
            targets: targets.map((target) => ({
                target: target,
                type: 'timeserie',
            })),
            filters,
        })

        const { storeWidgetMetricsData, currentRangeMetricWidgetsData } = useContext(ConsumptionWidgetsMetricsContext)

        useEffect(() => {
            storeWidgetMetricsData(data)
        }, [data, storeWidgetMetricsData])

        useEffect(() => {
            storeWidgetMetricsData(oldData, true)
        }, [oldData, storeWidgetMetricsData])

        const theme = useTheme()

        useEffect(() => {
            if (isCurrentDayRange) {
                if (
                    targets.includes(metricTargetsEnum.consumption) ||
                    targets.includes(metricTargetsEnum.autoconsumption)
                ) {
                    getCurrentDayConsumption()
                }
                if (targets.includes(metricTargetsEnum.eurosConsumption)) {
                    getCurrentDayEuroConsumption()
                }
            }
            // ! Don't remove the eslint-disable. These dependencies must not contain the targets prop.
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [getCurrentDayConsumption, getCurrentDayEuroConsumption, isCurrentDayRange])

        const targetsInfos = useMemo(() => {
            const targetsInfos: targetsInfosType = {}
            targets.forEach((target) => {
                let unit: string | null = null
                let value: number | null = null
                if (
                    [
                        metricTargetsEnum.consumption,
                        metricTargetsEnum.autoconsumption,
                        metricTargetsEnum.eurosConsumption,
                    ].includes(target as metricTargetsEnum) &&
                    isCurrentDayRange
                ) {
                    switch (target) {
                        case metricTargetsEnum.consumption:
                            if (currentDayConsumption !== null) {
                                const consumptionWidgetAssets = consumptionWattUnitConversion(currentDayConsumption)
                                unit = consumptionWidgetAssets.unit
                                value = consumptionWidgetAssets.value
                            }
                            break
                        case metricTargetsEnum.autoconsumption:
                            if (currentDayAutoConsumption !== null) {
                                const autoConsumptionWidgetAssets =
                                    consumptionWattUnitConversion(currentDayAutoConsumption)
                                unit = autoConsumptionWidgetAssets.unit
                                value = autoConsumptionWidgetAssets.value
                            }
                            break
                        case metricTargetsEnum.eurosConsumption:
                            if (currentDayEuroConsumption !== null) {
                                unit = '€'
                                value = Number(currentDayEuroConsumption.toFixed(2))
                            }
                            break
                    }
                }
                if (value === null || unit === null) {
                    const widgetAssets = !data.length ? emptyValueUnit : computeWidgetAssets(data, target)
                    unit = widgetAssets.unit
                    value = widgetAssets.value
                }

                const { value: oldValue } = !oldData.length ? emptyValueUnit : computeWidgetAssets(oldData, target)
                const percentageChange = computePercentageChange(oldValue as number, value as number)
                const targetInfos = {
                    unit,
                    value,
                    oldValue,
                    percentageChange,
                }
                if (target === metricTargetsEnum.injectedProduction) {
                    // in injection production we display the target only if value of it exists.
                    if (value) {
                        targetsInfos[target] = targetInfos
                    }
                } else {
                    targetsInfos[target] = targetInfos
                }
            })
            return targetsInfos
        }, [
            currentDayAutoConsumption,
            currentDayConsumption,
            currentDayEuroConsumption,
            data,
            isCurrentDayRange,
            oldData,
            targets,
        ])

        // Props to track the change of range change, so that we call getMetrics only when range change, instead of when both range and period change.
        const isRangeChanged = useRef(false)

        // When range change, set isRangedChanged
        useEffect(() => {
            isRangeChanged.current = true
        }, [range])

        // get metrics when metricsInterval change.
        useEffect(() => {
            setMetricsInterval(isConsumptionTarget && !isCurrentDayRange ? '1d' : metricsInterval)
            setMetricsIntervalPrevious(isConsumptionTarget && !isCurrentDayRange ? '1d' : metricsInterval)
        }, [
            isConsumptionTarget,
            isCurrentDayRange,
            metricsInterval,
            period,
            range,
            setMetricsInterval,
            setMetricsIntervalPrevious,
        ])

        // get metrics when consumptionToggleButton change.
        useEffect(() => {
            getMetricsWithParams({
                interval: isConsumptionTarget && !isCurrentDayRange ? '1d' : metricsInterval,
                range: getWidgetRange(range, period),
                targets: targets,
                filters,
            })
            getMetricsWithParamsPrevious({
                interval: isConsumptionTarget && !isCurrentDayRange ? '1d' : metricsInterval,
                range: getWidgetPreviousRange(getWidgetRange(range, period), period),
                targets: targets,
                filters,
            })
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [consumptionToggleButton])

        // Reset the metrics interval to his origin when the data value in null with the interval 1d for the consumption or the cost.
        useEffect(() => {
            if (checkIfDataForConsumptionRelatedTargetWithNullValue(data)) {
                setMetricsInterval(metricsInterval)
            }
        }, [data, metricsInterval, setMetricsInterval])

        useEffect(() => {
            if (checkIfDataForConsumptionRelatedTargetWithNullValue(oldData)) {
                setMetricsIntervalPrevious(metricsInterval)
            }
        }, [metricsInterval, oldData, setMetricsIntervalPrevious])

        // When period or range changes
        useEffect(() => {
            // If period just changed block the call of getMetrics, because period and range changes at the same time, so to avoid two call of getMetrics
            // 1 call when range change and the other when period change, then only focus on when range changes.
            if (isRangeChanged.current) {
                const widgetRange = getWidgetRange(range, period)
                setRange(widgetRange)
                setRangePrevious(getWidgetPreviousRange(widgetRange, period))
                // reset isRangdChanged
                isRangeChanged.current = false
            }
        }, [period, range, setRange, setRangePrevious])

        // We use this hook to check if the injectedProduction metrics exists in the currentRangeMetricWidgetsData and their value are not null.
        const isInjectedProductionAvailable = useMemo(() => {
            if (targets.includes(metricTargetsEnum.autoconsumption)) {
                const injectedProductionMetrics = currentRangeMetricWidgetsData.find(
                    (item) => item.target === metricTargetsEnum.injectedProduction,
                )
                return injectedProductionMetrics?.datapoints.some((item) => item[0] !== null) ?? false
            }
            return false
        }, [currentRangeMetricWidgetsData, targets])

        const isAutoconsmptionProductionTab =
            consumptionToggleButton === SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction
        // display the widget autoconsumption only if isInjectedProductionAvailable is true.
        if (
            targets.includes(metricTargetsEnum.autoconsumption) &&
            isAutoconsmptionProductionTab &&
            !isInjectedProductionAvailable
        )
            return null

        return (
            <Grid item xs={6} sm={6} md={4} lg={3} xl={3} className="flex" data-testid="widget">
                <Card className="w-full rounded-20 shadow sm:m-4" variant="outlined" style={{ minHeight: '170px' }}>
                    <>
                        {isMetricsLoading ? (
                            <div
                                className="flex flex-col justify-center items-center w-full h-full"
                                style={{ height: '170px' }}
                            >
                                <CircularProgress style={{ color: theme.palette.primary.main }} />
                            </div>
                        ) : (
                            <div className="h-full flex flex-col">
                                {childrenPosition === 'top' ? children : <></>}
                                {(Object.keys(targetsInfos) as metricTargetType[]).map((target, index) => (
                                    <WidgetItem
                                        key={index}
                                        target={target}
                                        title={renderWidgetTitle(target, enphaseOff, consumptionToggleButton)}
                                        infoIcon={infoIcons && infoIcons[target]}
                                        value={targetsInfos[target].value}
                                        unit={targetsInfos[target].unit}
                                        percentageChange={targetsInfos[target].percentageChange}
                                        noValueMessage={
                                            <TypographyFormatMessage>
                                                {DEFAULT_NO_VALUE_MESSAGE}
                                            </TypographyFormatMessage>
                                        }
                                    />
                                ))}
                                {childrenPosition === 'bottom' ? children : <></>}
                            </div>
                        )}
                    </>
                </Card>
            </Grid>
        )
    },
)
