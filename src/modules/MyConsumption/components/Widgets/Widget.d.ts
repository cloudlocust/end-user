import { IMetric, metricTargetType } from 'src/modules/Metrics/Metrics'

/**
 * Widget type.
 */
export type widgetType = metricTargetType
/**

/**
 * Widget Props Type.
 */
export interface IWidgetProps {
    /**
     * Widget type.
     */
    type: widgetType
    /**
     * Widget data.
     */
    data: IMetric[]
    /**
     * Widget metrics loading.
     */
    isMetricsLoading: boolean
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
