import {
    metricTargetType,
    metricIntervalType,
    metricFiltersType,
    metricRangeType,
    IMetric,
} from 'src/modules/Metrics/Metrics'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'

/**
 * Widget Title type.
 */
export type widgetTitleType =
    | 'Consommation Totale'
    | 'Puissance Maximale'
    | 'Température Intérieure'
    | 'Température Extérieure'

/**
 * Total Consumption Units types.
 */
export type totalConsumptionUnits = 'Wh' | 'kWh' | 'MWh'

/**
 * Widget list type.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type widgetType = {
    /**
     * Widget type.
     */
    type: metricTargetType
    /**
     * Widget title.
     */
    title: widgetTitleType
    /**
     * Widget unit.
     */
    computeUnit: (data: IMetric[]) => 'Wh' | 'kWh' | 'MWh' | 'VA' | 'kVa' | '°C'
    /**
     * Function that returns the value of the specific widget type.
     */
    computeValue: (data: IMetric[]) => number
}[]

/**
 * Widget Props.
 */
export interface IWidgetProps {
    /**
     * Widget type.
     */
    type: metricTargetType
    /**
     * Widget title.
     */
    title: widgetTitleType
    /**
     * Period: "day", "week", "month", "year".
     */
    period: periodType
    /**
     * Metrics interval.
     */
    metricsInterval: metricIntervalType
    /**
     * Metrics filters.
     */
    filters: metricFiltersType
    /**
     * Metrics Range.
     */
    range: metricRangeType
    /**
     * Widget unit.
     */
    unit: (data: IMetric[]) => 'Wh' | 'kWh' | 'MWh' | 'VA' | 'kVa' | '°C'
    /**
     * Widget value.
     */
    value: (data: IMetrc[]) => number
}
