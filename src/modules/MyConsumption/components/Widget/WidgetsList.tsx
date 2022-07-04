import { Grid, useTheme } from '@mui/material'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { Widget } from 'src/modules/MyConsumption/components/Widget'
import {
    consumptionAndMaxPowerTypes,
    temperatureTypes,
    widgetType,
} from 'src/modules/MyConsumption/components/Widget/Widget'
import {
    ApexAxisChartSerie,
    IMetric,
    metricFiltersType,
    metricIntervalType,
    metricRangeType,
} from 'src/modules/Metrics/Metrics'
import { convertMetricsDataToApexChartsAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { sum, max, mean } from 'lodash'

/**
 * Function that returns values from yAxis of the graph.
 *
 * @param data Metrics data.
 * @returns Values.
 */
const getDataFromYAxis = (data: IMetric[]) => {
    // The values to be used in the widget are the values of the Y axis in the chart.
    const { yAxisSeries } = convertMetricsDataToApexChartsAxisValues(data)
    const values: number[] = []
    yAxisSeries.forEach((el: ApexAxisChartSerie) => el.data.map((number) => values.push(number as number)))

    return values
}

/**
 * Function that handles temperature format values from metrics data.
 *
 * @param data Metrics data.
 * @param type Metrics type.
 * @returns Values according to metrics type.
 */
const handleTemperatureFormat = (data: IMetric[], type: temperatureTypes) => {
    const values = getDataFromYAxis(data)
    if (
        (type === 'nrlink_internal_temperature_metrics' || type === 'external_temperature_metrics') &&
        data.find((el) => el.target === type)
    ) {
        return Math.ceil(mean(values))
    }
}

/**
 * Function that handles Consumption Metrics & Max power format values from metrics data.
 *
 * @param data Metrics data.
 * @param type Metrics target.
 * @returns Value according to type.
 */
const handleConsumptionMetricsAndMaxPowerFormat = (data: IMetric[], type: consumptionAndMaxPowerTypes) => {
    const values = getDataFromYAxis(data)
    if (type === 'consumption_metrics' && data.find((el) => el.target === type)) {
        const totalConsumptionValueKwh = sum(values)
        // If the number has more than 3 digits, we convert it into Mega Watt (MWh)
        if (totalConsumptionValueKwh > 999) {
            // This will return in MWh
            return (totalConsumptionValueKwh / 1000).toFixed(2)
        } else {
            return totalConsumptionValueKwh.toFixed(2)
        }
    }

    if (type === 'enedis_max_power' && data.find((el) => el.target === type)) {
        const maxPowerVA = max(values) as number
        // If the number has more than 3 digits, we convert from VA to kVA
        if (maxPowerVA > 999) {
            // This will return in kVA
            return (maxPowerVA / 1000).toFixed(2)
        } else {
            return maxPowerVA
        }
    }
}

const widgetsList: widgetType = [
    {
        type: 'consumption_metrics',
        title: 'Consommation Totale',
        // eslint-disable-next-line jsdoc/require-jsdoc
        unit: (data: IMetric[]) =>
            handleConsumptionMetricsAndMaxPowerFormat(data, 'consumption_metrics')?.toString().length! > 3
                ? 'MWh'
                : 'kWh',
        // eslint-disable-next-line jsdoc/require-jsdoc
        onFormat: (data: IMetric[]) =>
            handleConsumptionMetricsAndMaxPowerFormat(data, 'consumption_metrics')! as number,
        // eslint-disable-next-line jsdoc/require-jsdoc
        onError: (data: IMetric[]) => Boolean(handleConsumptionMetricsAndMaxPowerFormat(data, 'consumption_metrics')),
    },
    {
        type: 'enedis_max_power',
        title: 'Puissance Maximale',
        // eslint-disable-next-line jsdoc/require-jsdoc
        unit: (data: IMetric[]) =>
            handleConsumptionMetricsAndMaxPowerFormat(data, 'enedis_max_power')?.toString().length! > 3 ? 'kVa' : 'VA',
        // eslint-disable-next-line jsdoc/require-jsdoc
        onFormat: (data: IMetric[]) => handleConsumptionMetricsAndMaxPowerFormat(data, 'enedis_max_power')! as number,
        // eslint-disable-next-line jsdoc/require-jsdoc
        onError: (data: IMetric[]) => Boolean(handleConsumptionMetricsAndMaxPowerFormat(data, 'enedis_max_power')),
    },
    {
        type: 'external_temperature_metrics',
        title: 'Température Extérieure',
        unit: '°C',
        // eslint-disable-next-line jsdoc/require-jsdoc
        onFormat: (data: IMetric[]) => handleTemperatureFormat(data, 'external_temperature_metrics')! as number,
        // eslint-disable-next-line jsdoc/require-jsdoc
        onError: (data: IMetric[]) => Boolean(handleTemperatureFormat(data, 'external_temperature_metrics')),
    },
    {
        type: 'nrlink_internal_temperature_metrics',
        title: 'Température Intérieure',
        unit: '°C',
        // eslint-disable-next-line jsdoc/require-jsdoc
        onFormat: (data: IMetric[]) => handleTemperatureFormat(data, 'nrlink_internal_temperature_metrics')! as number,
        // eslint-disable-next-line jsdoc/require-jsdoc
        onError: (data: IMetric[]) => Boolean(handleTemperatureFormat(data, 'nrlink_internal_temperature_metrics')),
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
                            onError={widget.onError}
                            {...props}
                        />
                    )
                })}
            </Grid>
        </div>
    )
}
