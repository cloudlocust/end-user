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
     * Function to save metrics data {key:target, value:data} in (metricsData) Map or in (oldMetricsData) if isOld is true.
     */
    saveMetricsData: (target: metricTargetType, data: IMetric[], isOldData?: boolean = false) => void
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
