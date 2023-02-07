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
     * Function to save current metrics data {key:target, value:data} in (metricsData) Map.
     *
     * @param target Target type.
     * @param data Metrics data.
     */
    const saveMetricsData = (target: metricTargetType, data: IMetric[]) => {
        metricsData.set(target, data)
    }

    /**
     * Function to save current metrics data {key:target, value:data} in (oldMetricsData) Map.
     *
     * @param target Target type.
     * @param data Metrics data.
     */
    const saveOldMetricsData = (target: metricTargetType, data: IMetric[]) => {
        oldMetricsData.set(target, data)
    }

    return (
        <ConsumptionWidgetsMetricsContext.Provider
            value={{ metricsData, oldMetricsData, saveMetricsData, saveOldMetricsData }}
        >
            {children}
        </ConsumptionWidgetsMetricsContext.Provider>
    )
}
