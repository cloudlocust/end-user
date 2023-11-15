import { useEffect, useMemo } from 'react'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widget/Widget'
import { WidgetItem } from 'src/modules/MyConsumption/components/WidgetItem'
import {
    getWidgetPreviousRange,
    isRangeWithinToday,
    renderWidgetTitle,
} from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { computePercentageChange } from 'src/modules/Analysis/utils/computationFunctions'
import { computeWidgetAssets } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { getWidgetRange } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { Grid, Card, CircularProgress, useTheme } from '@mui/material'
import { DEFAULT_NO_VALUE_MESSAGE } from 'src/modules/MyConsumption/components/Widget'

const emptyValueUnit = { value: 0, unit: '' }

/**
 * WidgetConsumption Component.
 *
 * @param props Same Props as Widget Idle Consumption Component.
 * @returns WidgetConsumption Component.
 */
const WidgetIdleConsumption = (props: IWidgetProps) => {
    const { filters, period, range, targets, infoIcons, metricsInterval } = props
    const target = targets[0]
    const theme = useTheme()

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

    useEffect(() => {
        setMetricsInterval('1d')
        setMetricsIntervalPrevious('1d')
    }, [setMetricsInterval, period, setMetricsIntervalPrevious])

    useEffect(() => {
        if (period === 'daily') {
            setRange(getWidgetRange(range, period))
            setRangePrevious(getWidgetPreviousRange(range, period))
        } else {
            const widgetRange = getWidgetRange(range, period)
            setRange(widgetRange)
            setRangePrevious(getWidgetPreviousRange(widgetRange, period))
        }
    }, [period, range, setRange, setRangePrevious, target])

    const { unit, value } = useMemo(
        () => (!data.length ? emptyValueUnit : computeWidgetAssets(data, metricTargetsEnum.idleConsumption)),
        [data],
    )

    const { value: oldDataValue } = useMemo(
        () => (!oldData.length ? emptyValueUnit : computeWidgetAssets(oldData, metricTargetsEnum.idleConsumption)),
        [oldData],
    )

    const percentageChange = useMemo(
        () => computePercentageChange(oldDataValue as number, value as number),
        [value, oldDataValue],
    )

    const isMessageShown = isRangeWithinToday(range.from, range.to)

    return (
        <Grid item xs={6} sm={6} md={4} lg={3} xl={3} className="flex">
            <Card className="w-full rounded-20 shadow sm:m-4" variant="outlined" style={{ minHeight: '170px' }}>
                {isMetricsLoading ? (
                    <div
                        className="flex flex-col justify-center items-center w-full h-full"
                        style={{ height: '170px' }}
                    >
                        <CircularProgress style={{ color: theme.palette.primary.main }} />
                    </div>
                ) : (
                    <div className="h-full flex flex-col">
                        <WidgetItem
                            target={target}
                            title={renderWidgetTitle(target)}
                            infoIcon={infoIcons && infoIcons[target]}
                            value={!isMessageShown ? value : ''}
                            unit={unit}
                            percentageChange={percentageChange}
                            noValueMessage={
                                isMessageShown ? (
                                    <TypographyFormatMessage style={{ maxWidth: '90%' }}>
                                        La consommation de veille n’est pas disponible sur la journée en cours
                                    </TypographyFormatMessage>
                                ) : (
                                    <TypographyFormatMessage>{DEFAULT_NO_VALUE_MESSAGE}</TypographyFormatMessage>
                                )
                            }
                        />
                    </div>
                )}
            </Card>
        </Grid>
    )
}

export default WidgetIdleConsumption
