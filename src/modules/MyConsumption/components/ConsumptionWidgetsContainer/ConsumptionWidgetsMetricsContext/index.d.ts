import { ReactChildren, ReactElement, ReactNode } from 'react'
import { IMetric, metricTargetType } from 'src/modules/Metrics/Metrics'

/**
 * Type of consumption widgets metrics context for saving the metrics of the widgets.
 */
export type ConsumptionWidgetsMetricsContextType = /**
 *
 */ {
    /**
     * Track the previous metrics of the widgets that are according to the previous range.
     */
    oldMetricsWidgets: IMetric[]
    /**
     * Track the current metrics of the widgets.
     */
    currentMetricsWidgets: IMetric[]
    /**
     * Function to save metrics (data) in (currentMetricsData) or in (oldMetricsData) if isOld is true.
     */
    addMetrics: (data: IMetric[], isOldData?: boolean = false) => void
    /**
     * Function to get metrics of the widgets targets from (currentMetricsWidgets) or from (oldMetricsWidgets) if fromOldData is true.
     */
    getMetrics: (targets: metricTargetType[], fromOldData: boolean = false) => IMetric[]
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
