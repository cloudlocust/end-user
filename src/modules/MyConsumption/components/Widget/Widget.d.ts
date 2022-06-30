import { metricTargetType } from 'src/modules/Metrics/Metrics'

/**
 * Widget Title type.
 */
export type widgetTitleType =
    | 'Consommation Totale'
    | 'Puissance Maximale'
    | 'Température Intérieure'
    | 'Température Extérieure'

/**
 * Widget unit type.
 */
export type widgetUnitType = 'kWh' | 'kVh' | '°C'

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
    unit: widgetUnitType
}[]

/**
 * Widget Props.
 */
export interface IWidgetProps {
    /**
     * Widget title.
     */
    title: widgetTitleType
    /**
     * Widget unit.
     */
    unit: widgetUnitType
    /**
     * Widget value. TODO in 2623.
     */
    value?: number
}
