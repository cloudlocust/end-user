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
    const currentMetricsWidgets: IMetric[] = []
    const oldMetricsWidgets: IMetric[] = []

    /**
     * Function to save metrics (data) in (currentMetricsWidgets) or in (oldMetricsWidgets) if isOld is true.
     * If isOld is false then it witt save the metrics in (currentMetricsWidgets), otherwise it will save the metrics in (oldMetricsWidgets).
     *
     * @param data Metrics data.
     * @param isOldData Boolean var for know if the data metrics is the current data or the previous data. Default value is false.
     */
    const addMetrics = (data: IMetric[], isOldData: boolean = false) => {
        if (data.length > 0) {
            if (isOldData) {
                saveDataInCorrectArray(oldMetricsWidgets, data)
            } else {
                saveDataInCorrectArray(currentMetricsWidgets, data)
            }
        }
    }

    /**
     * Function to get metrics of the widgets targets from (currentMetricsWidgets) or from (oldMetricsWidgets) if fromOldData is true.
     * If fromOldData is false then it witt get the metrics from (oldMetricsWidgets), otherwise it will get the metrics from (currentMetricsWidgets).
     *
     * @param targets Targets widgets types.
     * @param fromOldData Boolean to specifies where we get our data.
     * @returns Metrics data.
     */
    const getMetrics = (targets: metricTargetType[], fromOldData: boolean = false): IMetric[] => {
        if (fromOldData) {
            return oldMetricsWidgets.filter((item) => targets.includes(item.target))
        } else {
            return currentMetricsWidgets.filter((item) => targets.includes(item.target))
        }
    }

    /**
     * Function to save all the metrics data (metric) in the correct (metricsData) Array.
     * If the metric data exists in the Array, it will be replaced. Otherwise, it will be added.
     *
     * @param metricsData MetricsData Array.
     * @param data Metrics data.
     */
    const saveDataInCorrectArray = (metricsData: IMetric[], data: IMetric[]) => {
        for (const metric of data) {
            const indexOfMetric = metricsData.findIndex((item) => item.target === metric.target)
            if (indexOfMetric !== -1) {
                metricsData[indexOfMetric] = metric
            } else {
                metricsData.push(metric)
            }
        }
    }

    return (
        <ConsumptionWidgetsMetricsContext.Provider
            value={{
                currentMetricsWidgets,
                oldMetricsWidgets,
                addMetrics,
                getMetrics,
            }}
        >
            {children}
        </ConsumptionWidgetsMetricsContext.Provider>
    )
}
