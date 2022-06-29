import { Typography, Grid, Card, CircularProgress, useTheme } from '@mui/material'
import { useEffect } from 'react'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { getMetricType, IMetric } from 'src/modules/Metrics/Metrics'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widgets/Widget'
import { initialMetricsHookValues } from 'src/modules/MyConsumption/MyConsumptionContainer'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { convertMetricsDataToApexChartsAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { getRange } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import _ from 'lodash'

/**
 * Function to get the values from data.
 *
 * @param data UseMetrics Data.
 * @param type Widget type.
 * @returns Value.
 */
const getValueFromData = (data: IMetric[], type?: IWidgetProps['type']) => {
    // The values to be used in the widget are the values of the Y axis in the chart.
    const { yAxisSeries } = convertMetricsDataToApexChartsAxisValues(data)
    let totalConsumptionValue!: number
    let maxPowerValue!: number
    let avgExternalTemperatureValue!: number
    let avgInternalTemperatureValue!: number

    let values: number[] = []
    yAxisSeries.forEach((el) => el.data.forEach((number) => values.push(number as number)))

    if (type === 'consumption_metrics' && data.find((el) => el.target === type)) {
        totalConsumptionValue = _.sum(values)
        return totalConsumptionValue
    } else if (type === 'enedis_max_power' && data.find((el) => el.target === type)) {
        maxPowerValue = _.max(values) as number
        return maxPowerValue
    } else if (type === 'external_temperature_metrics' && data.find((el) => el.target === type)) {
        avgExternalTemperatureValue = Math.ceil(_.mean(values))
        return avgExternalTemperatureValue
    } else if (type === 'nrlink_internal_temperature_metrics' && data.find((el) => el.target === type)) {
        avgInternalTemperatureValue = Math.ceil(_.mean(values))
        return avgInternalTemperatureValue
    }
}

/**
 * Single Widget component.
 *
 * @param root0 N/A.
 * @param root0.title Widget title.
 * @param root0.unit Widget unit.
 * @param root0.type Widget type.
 * @param root0.period Period date.
 * @returns Single Widget component.
 */
export const Widget = ({ title, unit, type, period }: IWidgetProps) => {
    const theme = useTheme()
    const widgetInitialMetricsValues: getMetricType = {
        ...initialMetricsHookValues,
        targets: [
            {
                target: type,
                type: 'timeseries',
            },
        ],
    }
    const { setMetricsInterval, data, setRange, isMetricsLoading } = useMetrics(widgetInitialMetricsValues)

    /**
     * Widget component is reloaded whenever period changes.
     */
    useEffect(() => {
        /**
         * Function that set the range according to the period chosen in the parent component: MyConsumptionContainer.
         *
         * @param period Period chosen in the metric interval.
         */
        const onHandletRangeFromPeriod = (period: periodType) => {
            if (period === 'daily') {
                setRange(getRange('day'))
                setMetricsInterval('1min')
            } else if (period === 'weekly') {
                setRange(getRange('week'))
                setMetricsInterval('1d')
            } else if (period === 'monthly') {
                setRange(getRange('month'))
                setMetricsInterval('1d')
            } else if (period === 'yearly') {
                setRange(getRange('year'))
                setMetricsInterval('1m')
            }
        }
        onHandletRangeFromPeriod(period)
    }, [period, setMetricsInterval, setRange])

    return (
        <Grid item xs={6} sm={6} md={4} lg={3} xl={3}>
            <Card className="w-full rounded-20 shadow sm:m-4 " variant="outlined">
                {isMetricsLoading ? (
                    <div
                        className="flex flex-col justify-center items-center w-full h-full"
                        style={{ height: '170px' }}
                    >
                        <CircularProgress style={{ color: theme.palette.primary.main }} />
                    </div>
                ) : (
                    <div className="p-16 flex flex-col justify-between">
                        {/* Widget title */}
                        <TypographyFormatMessage
                            className="sm:text-17 md:text-18 font-normal"
                            style={{ minHeight: '65px' }}
                        >
                            {title}
                        </TypographyFormatMessage>
                        <div className="flex flex-row flex-wrap mt-12 items-end">
                            {/* Widget value */}
                            <Typography className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tighter items-end mr-auto">
                                {getValueFromData(data, type)}
                            </Typography>
                            <div className="flex flex-col">
                                {/* Widget unit */}
                                <Typography className="text-18 font-medium mb-24" color="textSecondary">
                                    {unit}
                                </Typography>
                                {/* TODDO MYEM-2588*/}
                                {/* Widget arrow */}
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </Grid>
    )
}
