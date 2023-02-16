import { ReactElement, ReactNode } from 'react'
import { IMetric, metricTargetType } from 'src/modules/Metrics/Metrics'

/**
 * Type of consumption widgets metrics context for saving the metrics of the widgets.
 */
export interface ConsumptionWidgetsMetricsContextType {
    /**
     * Track the previous metrics of the widgets that are according to the previous range.
     */
    oldRangeMetricWidgetsData: IMetric[]
    /**
     * Track the current metrics of the widgets.
     */
    currentRangeMetricWidgetsData: IMetric[]
    /**
     * Function to save metrics (data) in (currentRangeMetricWidgetsData) or in (oldRangeMetricWidgetsData) if isOld is true.
     */
    storeWidgetMetricsData: (data: IMetric[], isOldData?: boolean = false) => void
    /**
     * Function to get metrics of the widgets targets from (currentRangeMetricWidgetsData) or from (oldRangeMetricWidgetsData) if fromOldData is true.
     */
    getMetricsWidgetsData: (targets: metricTargetType[], fromOldData?: boolean = false) => IMetric[]
    /**
     * Function to reset the metrics context.
     */
    resetMetricsWidgetData: () => void
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
    children: ReactNode | ReactElement
}
