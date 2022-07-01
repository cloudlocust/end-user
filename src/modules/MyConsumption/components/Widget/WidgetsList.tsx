import { Grid, useTheme } from '@mui/material'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { Widget } from 'src/modules/MyConsumption/components/Widget'
import { widgetType } from 'src/modules/MyConsumption/components/Widget/Widget'
import {
    IMetric,
    metricFiltersType,
    metricIntervalType,
    metricRangeType,
    metricTargetType,
} from 'src/modules/Metrics/Metrics'
import { convertMetricsDataToApexChartsAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import _ from 'lodash'

/**
 * Function that handles values from metrics data.
 *
 * @param data Metrics data.
 * @param type Metrics type.
 * @returns Values according to metrics type.
 */
const handleWidgetFormat = (data: IMetric[], type: metricTargetType) => {
    // The values to be used in the widget are the values of the Y axis in the chart.
    const { yAxisSeries } = convertMetricsDataToApexChartsAxisValues(data)
    let values: number[] = []
    yAxisSeries.forEach((el) => el.data.forEach((number) => values.push(number as number)))
    if (type === 'consumption_metrics' && data.find((el) => el.target === type)) {
        const totalConsumptionValueKwh = _.sum(values)
        // If the number has more than 3 digits, we convert it into Mega Watt (MWh)
        if (totalConsumptionValueKwh.toString().length > 3) {
            return (totalConsumptionValueKwh / 1000).toFixed(2)
        } else {
            return totalConsumptionValueKwh
        }
    } else if (type === 'enedis_max_power' && data.find((el) => el.target === type)) {
        return _.max(values) as number
    } else if (type === 'external_temperature_metrics' && data.find((el) => el.target === type)) {
        return Math.ceil(_.mean(values))
    } else if (type === 'nrlink_internal_temperature_metrics' && data.find((el) => el.target === type)) {
        return Math.ceil(_.mean(values))
    }
}

const widgetsList: widgetType = [
    {
        type: 'consumption_metrics',
        title: 'Consommation Totale',
        // eslint-disable-next-line jsdoc/require-jsdoc
        unit: (data: IMetric[]) =>
            handleWidgetFormat(data, 'consumption_metrics')?.toString().length! > 3 ? 'MWh' : 'kWh',
        // eslint-disable-next-line jsdoc/require-jsdoc
        onFormat: (data: IMetric[], type: metricTargetType) =>
            handleWidgetFormat(data, 'consumption_metrics') as number,
    },
    {
        type: 'enedis_max_power',
        title: 'Puissance Maximale',
        unit: 'kVa',
        // eslint-disable-next-line jsdoc/require-jsdoc
        onFormat: (data: IMetric[], type: metricTargetType) => handleWidgetFormat(data, 'enedis_max_power')! as number,
    },
    {
        type: 'external_temperature_metrics',
        title: 'Température Intérieure',
        unit: '°C',
        // eslint-disable-next-line jsdoc/require-jsdoc
        onFormat: (data: IMetric[], type: metricTargetType) =>
            handleWidgetFormat(data, 'external_temperature_metrics') as number,
    },
    {
        type: 'nrlink_internal_temperature_metrics',
        title: 'Température Extérieure',
        unit: '°C',
        // eslint-disable-next-line jsdoc/require-jsdoc
        onFormat: (data: IMetric[], type: metricTargetType) =>
            handleWidgetFormat(data, 'nrlink_internal_temperature_metrics') as number,
    },
]

/**
 * Widget List component that contains every widget.
 *
 * @param props N/A.
 * @param props.period Period from parent component.
 * @param props.metricsInterval MetricsInterval from parent component.
 * @param props.filters Filters from parent component.
 * @param props.range Range from parent component.
 * @returns WidgetsList component.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export const WidgetList = (props: {
    // eslint-disable-next-line jsdoc/require-jsdoc
    period: periodType
    // eslint-disable-next-line jsdoc/require-jsdoc
    metricsInterval: metricIntervalType
    // eslint-disable-next-line jsdoc/require-jsdoc
    filters: metricFiltersType
    // eslint-disable-next-line jsdoc/require-jsdoc
    range: metricRangeType
}) => {
    const theme = useTheme()

    return (
        <div style={{ background: theme.palette.grey[100] }} className="w-full my-8">
            <Grid container spacing={{ xs: 1, md: 2 }}>
                {widgetsList.map((widget) => {
                    return (
                        <Widget
                            key={widget.title}
                            type={widget.type}
                            title={widget.title}
                            unit={widget.unit}
                            onFormat={widget.onFormat}
                            {...props}
                        />
                    )
                })}
            </Grid>
        </div>
    )
}
