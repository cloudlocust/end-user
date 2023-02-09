import React from 'react'
import { IMetric, metricTargetType } from 'src/modules/Metrics/Metrics'
import {
    ConsumptionWidgetsMetricsContextType,
    ConsumptionWidgetsMetricsProviderProps,
} from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/ConsumptionWidgetsMetricsContext/index.d'

/**
 * Consumption Metrics Widgets Context.
 */
export const ConsumptionWidgetsMetricsContext = React.createContext<ConsumptionWidgetsMetricsContextType | null>(null)

/**
 * ConsumptionWidgetsMetrics Provider.
 *
 * @param param0 N/A.
 * @param param0.children Children.
 * @returns Context values/functions.
 */
export const ConsumptionWidgetsMetricsProvider = ({ children }: ConsumptionWidgetsMetricsProviderProps) => {
    const metricsData = new Map<metricTargetType, IMetric[]>()
    const oldMetricsData = new Map<metricTargetType, IMetric[]>()

    /**
     * Function to save metrics data {key:target, value:data} in (metricsData) Map or in (oldMetricsData) if isOld is true.
     *
     * @param target Target type.
     * @param data Metrics data.
     * @param isOldData Boolean var for know if the data metrics is the current data or the previous data.
     */
    const saveMetricsData = (target: metricTargetType, data: IMetric[], isOldData: boolean = false) => {
        if (isOldData) {
            oldMetricsData.set(target, data)
        } else {
            metricsData.set(target, data)
        }
    }

    return (
        <ConsumptionWidgetsMetricsContext.Provider value={{ metricsData, oldMetricsData, saveMetricsData }}>
            {children}
        </ConsumptionWidgetsMetricsContext.Provider>
    )
}
