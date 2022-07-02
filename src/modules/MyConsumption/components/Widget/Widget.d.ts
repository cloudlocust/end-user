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
    unit: ((data: IMetric[], type: metricTargetType) => 'kWh' | 'MWh') | 'kVa' | '°C'
    /**
     * Format data according to widget type.
     */
    onFormat: (data: IMetric[]) => number
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
     * Widget unit.
     */
    unit: ((data: IMetric[], type: metricTargetType) => string) | 'kVa' | '°C'
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
     * Format data according to widget type.
     */
    onFormat: (data: IMetric[], type: metricTargetType) => number
}

/**
 * Consumption Metrics and Enedis Max Power type.
 */
export type consumptionAndMaxPowerTypes = Exclude<
    metricTargetType,
    'external_temperature_metrics' | 'nrlink_internal_temperature_metrics'
>

/**
 * Temperature types.
 */
export type temperatureTypes = Exclude<metricTargetType, 'consumption_metrics' | 'enedis_max_power'>
