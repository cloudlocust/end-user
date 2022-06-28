import { Card, Typography, CircularProgress } from '@mui/material'
import { IWidgetAssets, IWidgetProps } from 'src/modules/MyConsumption/components/Widgets/Widget'
import { useTheme } from '@mui/material'
import { convertMetricsDataToApexChartsAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { getMetricType, IMetric } from 'src/modules/Metrics/Metrics'
import Grid from '@mui/material/Grid'
import _ from 'lodash'
import { useEffect } from 'react'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { initialMetricsHookValues } from 'src/modules/MyConsumption/MyConsumptionContainer'
import { getRange } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'

/**
 * Function to get the values from data.
 *
 * @param data Data.
 * @returns Array of values.
 */
const getValuesFromData = (data: IMetric[]): number[] => {
    // The values to be used in the widget are the values of the Y axis in the chart.
    const { yAxisSeries } = convertMetricsDataToApexChartsAxisValues(data)
    let values: number[] = []
    yAxisSeries.forEach((el) => el.data.forEach((number) => values.push(number as number)))

    return values
}

/**
 * Render widgetr function.
 *
 * @param title Title of widget.
 * @param unit Unit of widget.
 * @param value Value of widget.
 * @returns Widget component.
 */
const renderWidget = (title: string, unit: string, value: number) => {
    return (
        <div className="p-16 flex flex-col justify-between">
            <Typography className="sm:text-17 md:text-18 font-normal" style={{ minHeight: '65px' }}>
                {title}
            </Typography>
            <div className="flex flex-row flex-wrap mt-12 items-end">
                {/* Widget value */}
                <Typography className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tighter items-end mr-auto">
                    {value}
                </Typography>
                <div className="flex flex-col">
                    {/* Widget unit */}
                    <Typography className="text-18 font-medium mb-24" color="textSecondary">
                        {unit}
                    </Typography>
                    {/* TODDO MYEM-2588*/}
                    {/* Widget arrow */}
                    {/* <Typography className="font-medium text-base" color="textSecondary">Arrow</Typography> */}
                </div>
            </div>
        </div>
    )
}

/**
 * Reusable widget component.
 *
 * @param root0 N/A.
 * @param root0.type Widget type.
 * @param root0.period Period props.
 * @returns Widget component.
 */
export const Widget = ({ type, period }: IWidgetProps) => {
    const widgetInitialMetricsValues: getMetricType = {
        ...initialMetricsHookValues,
        targets: [
            {
                target: type,
                type: 'timeseries',
            },
        ],
    }
    const theme = useTheme()
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

    /**
     * Function that return value according to the type of widget.
     *
     * @param type Type from props.
     * @returns Data according to widget type.
     */
    const getValueAccordingToWidgetType = (type: IWidgetProps['type']) => {
        let totalConsumption: number = 0
        let maxPower: number = 0
        let averageInteranalTemp: number = 0
        let averageExternalTemp: number = 0

        if (type === 'consumption_metrics' && data.find((el) => el.target === type)) {
            const values = getValuesFromData(data)
            totalConsumption = _.sum(values)
            return totalConsumption
        }

        if (type === 'enedis_max_power' && data.find((el) => el.target === type)) {
            const values = getValuesFromData(data)
            maxPower = _.max(values) as number
            return maxPower
        }

        if (type === 'external_temperature_metrics' && data.find((el) => el.target === type)) {
            const values = getValuesFromData(data)
            averageExternalTemp = _.mean(values)
            return averageExternalTemp
        }

        if (type === 'nrlink_internal_temperature_metrics' && data.find((el) => el.target === type)) {
            const values = getValuesFromData(data)
            averageInteranalTemp = _.mean(values)
            return averageInteranalTemp
        }
    }

    /**
     * Function that returns widget title, unit, and value according to type.
     *
     * @param type Widget type.
     * @returns Widget with its assets.
     */
    const renderWidgetAssets = (type: IWidgetProps['type']) => {
        let widgetTitle: string
        let widgetUnit: string
        let widgetValue: number
        // Render widget information according to the type from props.
        switch (type) {
            case 'consumption_metrics':
                widgetTitle = 'Consommation totale' as IWidgetAssets['title']
                widgetUnit = 'kWh' as IWidgetAssets['unit']
                widgetValue = getValueAccordingToWidgetType('consumption_metrics') as number
                return renderWidget(widgetTitle, widgetUnit, widgetValue)
            case 'enedis_max_power':
                widgetTitle = 'Puissance max' as IWidgetAssets['title']
                widgetUnit = 'kVa' as IWidgetAssets['unit']
                widgetValue = getValueAccordingToWidgetType('enedis_max_power') as number
                return renderWidget(widgetTitle, widgetUnit, widgetValue)
            case 'nrlink_internal_temperature_metrics':
                widgetTitle = 'Température intérieure' as IWidgetAssets['title']
                widgetUnit = '°C' as IWidgetAssets['unit']
                widgetValue = getValueAccordingToWidgetType('nrlink_internal_temperature_metrics') as number
                return renderWidget(widgetTitle, widgetUnit, widgetValue)
            case 'external_temperature_metrics':
                widgetTitle = 'Température extérieure' as IWidgetAssets['title']
                widgetUnit = '°C' as IWidgetAssets['unit']
                widgetValue = getValueAccordingToWidgetType('external_temperature_metrics') as number
                return renderWidget(widgetTitle, widgetUnit, widgetValue)
            default:
                break
        }
    }

    // If there is no data, the widget is not displayed.
    if (data.length === 0) return null

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
                    renderWidgetAssets(type)
                )}
            </Card>
        </Grid>
    )
}
