import { Grid, useTheme } from '@mui/material'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { Widget } from 'src/modules/MyConsumption/components/Widget'
import { widgetType } from 'src/modules/MyConsumption/components/Widget/Widget'
import { IMetric, metricFiltersType, metricIntervalType, metricRangeType } from 'src/modules/Metrics/Metrics'
import {
    computePMax,
    computeTemperature,
    computeTotalConsumption,
} from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { ceil } from 'lodash'

const widgetsList: widgetType = [
    {
        type: 'consumption_metrics',
        title: 'Consommation Totale',
        /**
         * Unit function.
         *
         * @param data Metrics data.
         * @returns W, kWh or MWh depending on the length of the value.
         */
        unit: (data: IMetric[]) => computeTotalConsumption(data)!.unit,
        // eslint-disable-next-line jsdoc/require-jsdoc
        computeValue: (data: IMetric[]) => ceil(computeTotalConsumption(data)!.value),
    },
    {
        type: 'enedis_max_power',
        title: 'Puissance Maximale',
        /**
         * Unit function.
         *
         * @param data Metrics data.
         * @returns VA, kVa depending on the length of the value.
         */
        // eslint-disable-next-line jsdoc/require-jsdoc
        unit: (data: IMetric[]) => computePMax(data).unit,
        // eslint-disable-next-line jsdoc/require-jsdoc
        computeValue: (data: IMetric[]) => computePMax(data).value,
    },
    {
        type: 'external_temperature_metrics',
        title: 'Température Extérieure',
        /**
         * Unit function.
         *
         * @param data Metrics data.
         * @returns Celcius unit.
         */
        unit: (data: IMetric[]) => computeTemperature(data)!.unit,
        // eslint-disable-next-line jsdoc/require-jsdoc
        computeValue: (data: IMetric[]) => computeTemperature(data)!.value,
    },
    {
        type: 'nrlink_internal_temperature_metrics',
        title: 'Température Intérieure',
        /**
         * Unit function.
         *
         * @param data Metrics data.
         * @returns Celcius unit.
         */
        unit: (data: IMetric[]) => computeTemperature(data)!.unit,
        // eslint-disable-next-line jsdoc/require-jsdoc
        computeValue: (data: IMetric[]) => computeTemperature(data)!.value,
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
                            value={widget.computeValue}
                            {...props}
                        />
                    )
                })}
            </Grid>
        </div>
    )
}
