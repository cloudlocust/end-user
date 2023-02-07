import { ReactChildren, ReactElement, ReactNode } from 'react'
import { IMetric, metricTargetType } from 'src/modules/Metrics/Metrics'

/**
 * Type of consumption widgets metrics context for saving the metrics of the widgets.
 */
export type ConsumptionWidgetsMetricsContextType = /**
 *
 */ {
    /**
     * Map to save the previous metrics of the widgets that are according to the previous range.
     */
    oldMetricsData: Map<metricTargetType, IMetric[]>
    /**
     * Map to save the current metrics of the widgets.
     */
    metricsData: Map<metricTargetType, IMetric[]>
    /**
     * Function for save the previous metrics (save the data with the target key in oldMetricsData Map).
     */
    saveOldMetricsData: (target: metricTargetType, data: IMetric[]) => void
    /**
     * Function for save the current metrics (save the data value with the target key in metricsData Map).
     */
    saveMetricsData: (target: metricTargetType, data: IMetric[]) => void
}

/**
 * Consumption widgets metrics Provider Props.
 */
export type ConsumptionWidgetsMetricsProviderProps = /**
 *
 */ {
    /**
     * Children.
     */
    children: ReactNode | ReactChildren | ReactElement
}
