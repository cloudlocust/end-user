import { Typography, Grid, Card, CircularProgress, useTheme } from '@mui/material'
import { useEffect } from 'react'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { getMetricType } from 'src/modules/Metrics/Metrics'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widget/Widget'

/**
 * Single Widget component.
 *
 * @param root0 N/A.
 * @param root0.title Widget title.
 * @param root0.unit Widget unit.
 * @param root0.type Widget type.
 * @param root0.period Period date.
 * @param root0.filters Filters from parent component.
 * @param root0.metricsInterval MetricsInterval from parent component.
 * @param root0.range Range from parent component.
 * @param root0.onFormat Function that format data according to widget type.
 * @param root0.onError Function that handles widget error message.
 * @returns Single Widget component.
 */
export const Widget = ({
    title,
    unit,
    type,
    period,
    filters,
    metricsInterval,
    range,
    onFormat,
    onError,
}: IWidgetProps) => {
    const theme = useTheme()
    const widgetInitialMetricsValues: getMetricType = {
        range,
        interval: metricsInterval,
        filters,
        targets: [
            {
                target: type,
                type: 'timeserie',
            },
        ],
    }
    const { setMetricsInterval, data, setRange, isMetricsLoading, setFilters } = useMetrics(widgetInitialMetricsValues)

    /**
     * Widget component is reloaded whenever period, range or interval changes.
     */
    useEffect(() => {
        /**
         * In order to retrieve data for the widgets of a specific range, period or interval. We passed range, period and interval from MyConsumptionContainer to this component as props
         * And used a new instantiation of useMetrics to make API calls with those props.
         */
        setFilters(filters)
        setMetricsInterval(metricsInterval)
        setRange(range)
    }, [filters, metricsInterval, period, range, setFilters, setMetricsInterval, setRange])

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
                    <>
                        <div className="p-16 flex flex-col justify-between h-full">
                            {/* Widget title */}
                            <TypographyFormatMessage className="sm:text-16 font-medium md:text-17">
                                {title}
                            </TypographyFormatMessage>
                            {/* If onError returns true, it will display an error message for the widget type */}
                            {!onError(data) ? (
                                <div className="mb-44 text-center">
                                    <TypographyFormatMessage>Aucune donnée disponnible</TypographyFormatMessage>
                                </div>
                            ) : (
                                <div className="flex flex-row flex-wrap mt-12 items-end">
                                    {/* Widget value */}
                                    <Typography className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tighter items-end mr-auto">
                                        {onFormat(data, type)}
                                    </Typography>
                                    <div className="flex flex-col">
                                        {/* Widget unit */}
                                        <Typography className="text-14 font-medium mb-24" color="textSecondary">
                                            {typeof unit === 'function'
                                                ? unit(data, 'consumption_metrics' || ' "enedis_max_power"')
                                                : unit}
                                        </Typography>
                                        {/* TODDO MYEM-2588*/}
                                        {/* Widget arrow */}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </Card>
        </Grid>
    )
}
