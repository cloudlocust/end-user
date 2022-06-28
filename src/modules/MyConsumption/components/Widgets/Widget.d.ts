import { metricTargetType } from 'src/modules/Metrics/Metrics'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'

/**
 * Widget type.
 */
export type widgetType = metricTargetType

/**
 * Widget Props Type.
 */
export interface IWidgetProps {
    /**
     * Widget type.
     */
    type: widgetType
    /**
     * Period.
     */
    period: periodType
}

/**
 * Widget Assets.
 */
export interface IWidgetAssets {
    /**
     * Widget title.
     */
    title: 'Consommation totale' | 'Puissance max' | 'Température intérieure' | 'Température extérieure'
    /**
     * Widget unit.
     */
    unit: 'kWh' | 'kVa' | '°C'
}
