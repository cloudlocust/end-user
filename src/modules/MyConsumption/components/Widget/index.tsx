import React, { memo, useMemo, useEffect, useRef, useContext } from 'react'
import { Typography, Grid, Card, CircularProgress, useTheme } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widget/Widget'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import {
    computeWidgetAssets,
    getWidgetPreviousRange,
    getWidgetRange,
    renderWidgetTitle,
} from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { computePercentageChange } from 'src/modules/Analysis/utils/computationFunctions'
import Icon from '@mui/material/Icon'
import { ConsumptionWidgetsMetricsContext } from 'src/modules/MyConsumption/Context/ConsumptionWidgetsMetricsContext'

const emptyValueUnit = { value: 0, unit: '' }

/**
 * Widget Component.
 *
 * @param props N/A.
 * @param props.range Current range so that we handle the xAxis values according to period and range selected.
 * @param props.filters Metrics Filters.
 * @param props.infoIcon InfoIcon showed in top right of widget.
 * @param props.target Target of the widget.
 * @param props.period Current Period.
 * @returns Widget Component.
 */
export const Widget = memo(({ filters, range, infoIcon, metricsInterval, target, period }: IWidgetProps) => {
    const { data, setMetricsInterval, setRange, isMetricsLoading } = useMetrics({
        interval: metricsInterval,
        range: getWidgetRange(range, period),
        targets: [
            {
                target: target,
                type: 'timeserie',
            },
        ],
        filters,
    })
    const {
        data: oldData,
        setMetricsInterval: setMetricsIntervalPrevious,
        setRange: setRangePrevious,
    } = useMetrics({
        interval: metricsInterval,
        range: getWidgetPreviousRange(getWidgetRange(range, period), period),
        targets: [
            {
                target: target,
                type: 'timeserie',
            },
        ],
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
    const { unit, value } = useMemo(
        () => (!data.length ? emptyValueUnit : computeWidgetAssets(data, target)),
        [data, target],
    )
    const { value: oldDataValue } = useMemo(
        () => (!oldData.length ? emptyValueUnit : computeWidgetAssets(oldData, target)),
        [oldData, target],
    )
    const percentageChange = useMemo(
        () => computePercentageChange(oldDataValue as number, value as number),
        [value, oldDataValue],
    )
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
                        <div className="p-16 flex flex-col justify-between h-full">
                            <div className="flex flex-row justify-between">
                                {/* Widget title */}
                                <TypographyFormatMessage className="sm:text-16 font-medium md:text-17">
                                    {renderWidgetTitle(target)}
                                </TypographyFormatMessage>
                                {/* Widget infoIcon */}
                                {infoIcon}
                            </div>
                            {!value ? (
                                <div className="mb-44 text-center">
                                    <TypographyFormatMessage>Aucune donnée disponible</TypographyFormatMessage>
                                </div>
                            ) : (
                                <div className="flex flex-row justify-between items-center gap-3">
                                    <div className="flex flex-row items-end gap-3">
                                        {/* Widget value */}
                                        <Typography className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tighter">
                                            {value}
                                        </Typography>
                                        {/* Widget unit */}
                                        <Typography className="text-16 md:text-20 font-medium" color="textSecondary">
                                            {unit}
                                        </Typography>
                                    </div>
                                    {/* Widget arrow */}
                                    {percentageChange !== 0 && (
                                        // Negative means decrease
                                        <div className="h-full flex items-center">
                                            {percentageChange < 0 ? (
                                                <Icon color="success" sx={{ fontSize: { xs: '24px', md: '32px' } }}>
                                                    trending_down
                                                </Icon>
                                            ) : (
                                                // Positive means increase
                                                <Icon color="error" sx={{ fontSize: { xs: '24px', md: '32px' } }}>
                                                    trending_up
                                                </Icon>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </>
            </Card>
        </Grid>
    )
})
