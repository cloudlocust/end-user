import { memo, useMemo, useEffect, useRef, useContext } from 'react'
import { Grid, Card, CircularProgress, useTheme } from '@mui/material'
import { IWidgetProps, targetsInfosType } from 'src/modules/MyConsumption/components/Widget/Widget'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import {
    computeWidgetAssets,
    getWidgetPreviousRange,
    getWidgetRange,
    renderWidgetTitle,
} from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { computePercentageChange } from 'src/modules/Analysis/utils/computationFunctions'
import { WidgetItem } from 'src/modules/MyConsumption/components/WidgetItem'
import { ConsumptionWidgetsMetricsContext } from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/ConsumptionWidgetsMetricsContext'
import { metricTargetType, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
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
 * @returns Widget Component.
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export const Widget = memo(
    ({ filters, range, infoIcons, metricsInterval, targets, period, enphaseOff, children }: IWidgetProps) => {
        const { data, setMetricsInterval, setRange, isMetricsLoading } = useMetrics({
            interval: metricsInterval,
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
            setRange: setRangePrevious,
        } = useMetrics({
            interval: metricsInterval,
            range: getWidgetPreviousRange(getWidgetRange(range, period), period),
            targets: targets.map((target) => ({
                target: target,
                type: 'timeserie',
            })),
            filters,
        })

        const { storeWidgetMetricsData } = useContext(ConsumptionWidgetsMetricsContext)

        useEffect(() => {
            storeWidgetMetricsData(data)
        }, [data, storeWidgetMetricsData])

        useEffect(() => {
            storeWidgetMetricsData(oldData, true)
        }, [oldData, storeWidgetMetricsData])

        const theme = useTheme()

        const targetsInfos = useMemo(() => {
            const targetsInfos: targetsInfosType = {}
            targets.forEach((target) => {
                const { unit, value } = !data.length ? emptyValueUnit : computeWidgetAssets(data, target)
                const { value: oldValue } = !oldData.length ? emptyValueUnit : computeWidgetAssets(oldData, target)
                const percentageChange = computePercentageChange(oldValue as number, value as number)
                const targetInfos = {
                    unit,
                    value,
                    oldValue,
                    percentageChange,
                }
                targetsInfos[target] = targetInfos
            })
            return targetsInfos
        }, [data, oldData, targets])

        // Props to track the change of range change, so that we call getMetrics only when range change, instead of when both range and period change.
        const isRangeChanged = useRef(false)

        // When range change, set isRangedChanged
        useEffect(() => {
            isRangeChanged.current = true
        }, [range])

        // get metrics when metricsInterval change.
        useEffect(() => {
            setMetricsInterval(metricsInterval)
            setMetricsIntervalPrevious(metricsInterval)
        }, [metricsInterval, setMetricsInterval, setMetricsIntervalPrevious])

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

        return (
            <Grid item xs={6} sm={6} md={4} lg={3} xl={3} className="flex">
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
                                {children}
                                {(Object.keys(targetsInfos) as metricTargetType[]).map((target, index) => (
                                    <WidgetItem
                                        key={index}
                                        target={target}
                                        title={renderWidgetTitle(target, enphaseOff)}
                                        infoIcon={infoIcons && infoIcons[target]}
                                        value={targetsInfos[target].value}
                                        unit={targetsInfos[target].unit}
                                        percentageChange={targetsInfos[target].percentageChange}
                                        period={period}
                                        noValueMessage={
                                            target === metricTargetsEnum.pMax && period === PeriodEnum.DAILY ? (
                                                // maxWidth to have a more balanced text.
                                                <TypographyFormatMessage style={{ maxWidth: '90%' }}>
                                                    La puissance maximale n'est pas disponible sur la journée en cours
                                                </TypographyFormatMessage>
                                            ) : (
                                                <TypographyFormatMessage>
                                                    {DEFAULT_NO_VALUE_MESSAGE}
                                                </TypographyFormatMessage>
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </>
                </Card>
            </Grid>
        )
    },
)
