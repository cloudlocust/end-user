import React, { useCallback, useState } from 'react'
import { IMetric, metricTargetsEnum, metricTargetType } from 'src/modules/Metrics/Metrics.d'
import {
    ConsumptionWidgetsMetricsContextType,
    ConsumptionWidgetsMetricsProviderProps,
} from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/ConsumptionWidgetsMetricsContext/index.d'

/**
 * Consumption Metrics Widgets Context.
 */
export const ConsumptionWidgetsMetricsContext = React.createContext<ConsumptionWidgetsMetricsContextType>(
    {} as ConsumptionWidgetsMetricsContextType,
)

/**
 * ConsumptionWidgetsMetrics Provider.
 *
 * @param param0 N/A.
 * @param param0.children Children.
 * @returns Context values/functions.
 */
export const ConsumptionWidgetsMetricsProvider = ({ children }: ConsumptionWidgetsMetricsProviderProps) => {
    const [currentRangeMetricWidgetsData, setCurrentRangeMetricWidgetsData] = useState<IMetric[]>([])
    const [oldRangeMetricWidgetsData, setOldRangeMetricWidgetsData] = useState<IMetric[]>([])

    /**
     * Function to save metrics (data) in (currentRangeMetricWidgetsData) or in (oldRangeMetricWidgetsData) if isOld is true.
     * If isOld is false then it witt save the metrics in (currentRangeMetricWidgetsData), otherwise it will save the metrics in (oldRangeMetricWidgetsData).
     *
     * @param data Metrics data.
     * @param isOldData Boolean var for know if the data metrics is the current data or the previous data. Default value is false.
     */
    const storeWidgetMetricsData = useCallback((data: IMetric[], isOldData: boolean = false) => {
        if (data.length) {
            if (isOldData) {
                saveDataInCorrectArray(setOldRangeMetricWidgetsData, data)
            } else {
                saveDataInCorrectArray(setCurrentRangeMetricWidgetsData, data)
            }
        }
        // This functions should be created only in the first render and shouldn't have any dependencies, because we don't want to have a new function every time the state changes.
    }, [])

    /**
     * Function to get metrics of the widgets targets from (currentRangeMetricWidgetsData) or from (oldRangeMetricWidgetsData) if fromOldData is true.
     * If fromOldData is false then it witt get the metrics from (oldRangeMetricWidgetsData), otherwise it will get the metrics from (currentRangeMetricWidgetsData).
     *
     * @param targets Targets widgets types.
     * @param fromOldData Boolean to specifies where we get our data.
     * @returns Metrics data.
     */
    const getMetricsWidgetsData = useCallback(
        (targets: metricTargetType[], fromOldData: boolean = false): IMetric[] => {
            if (fromOldData) {
                return oldRangeMetricWidgetsData.filter((item) => targets.includes(item.target))
            } else {
                return currentRangeMetricWidgetsData.filter((item) => targets.includes(item.target))
            }
        },
        [currentRangeMetricWidgetsData, oldRangeMetricWidgetsData],
    )

    /**
     * Function to reset the metrics data - reset (currentRangeMetricWidgetsData & oldRangeMetricWidgetsData) to [] -.
     */
    const resetMetricsWidgetData = useCallback(() => {
        setCurrentRangeMetricWidgetsData([])
        setOldRangeMetricWidgetsData([])
    }, [])

    /**
     * Function to save all the metrics data (metric) in the correct (currentRangeMetricWidgetsData / oldRangeMetricWidgetsData) Array using setMetricsData.
     * If the metric data doesn't exists in the Array, it will be added. Otherwise, it will be replaced.
     *
     * @param setMetricsData Set Function to update the metricsData.
     * @param data Metrics data.
     */
    const saveDataInCorrectArray = (setMetricsData: typeof setOldRangeMetricWidgetsData, data: IMetric[]) => {
        data.forEach((metric) => {
            //* Save only the consumption metric & autoconsumption metric data & euroconsumption.
            if (
                metric.target === metricTargetsEnum.consumption ||
                metric.target === metricTargetsEnum.autoconsumption ||
                metric.target === metricTargetsEnum.eurosConsumption ||
                metric.target === metricTargetsEnum.injectedProduction
            )
                // Replace the old metric of target with the new one.
                setMetricsData((prevMetrics) => [
                    ...prevMetrics.filter((item) => item.target !== metric.target),
                    metric,
                ])
        })
    }

    return (
        <ConsumptionWidgetsMetricsContext.Provider
            value={{
                currentRangeMetricWidgetsData,
                oldRangeMetricWidgetsData,
                storeWidgetMetricsData,
                getMetricsWidgetsData,
                resetMetricsWidgetData,
            }}
        >
            {children}
        </ConsumptionWidgetsMetricsContext.Provider>
    )
}
