import { metricTargetType, IMetric } from 'src/modules/Metrics/Metrics'

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
 * Widget Props.
 */
export interface IWidgetProps {
    /**
     * Widget type.
     */
    type: metricTargetType
    /**
     * Metrics loading state.
     */
    isMetricsLoading: boolean
    /**
     * Function that renders widget assets: value & unit.
     */
    computeAssets:
        | /**
         *
         */
        {
              /**
               *
               */
              unit: totalConsumptionUnits
              /**
               *
               */
              value: number
          }
        | /**
         *
         */ {
              /**
               *
               */
              unit: 'VA' | 'kVa'
              /**
               *
               */
              value: number
          }
        | /**
         *
         */ {
              /**
               *
               */
              unit: '°C'
              /**
               *
               */
              value: number
          }
}

/**
 * WidgetList Props.
 */
export interface IWidgetListProps {
    /**
     * Metrics data.
     */
    data: IMetric[]
    /**
     * Loading state from useMetrics hook.
     */
    isMetricsLoading: boolean
}
