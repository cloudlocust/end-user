import React, { useCallback, useState } from 'react'
import { IMetric, metricTargetType } from 'src/modules/Metrics/Metrics'
import {
    ConsumptionWidgetsMetricsContextType,
    ConsumptionWidgetsMetricsProviderProps,
} from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/ConsumptionWidgetsMetricsContext/index.d'

/**
 * Consumption Metrics Widgets Context.
 */
export const ConsumptionWidgetsMetricsContext = React.createContext<ConsumptionWidgetsMetricsContextType>({
    currentMetricsWidgets: [],
    oldMetricsWidgets: [],
    /**
     * Default addMetrics function.
     */
    addMetrics: () => {},
    /**
     * Default getMetrics function.
     *
     * @returns [].
     */
    getMetrics: () => [],
    /**
     * Default resetMetrics function.
     */
    resetMetrics: () => {},
})

/**
 * ConsumptionWidgetsMetrics Provider.
 *
 * @param param0 N/A.
 * @param param0.children Children.
 * @returns Context values/functions.
 */
export const ConsumptionWidgetsMetricsProvider = ({ children }: ConsumptionWidgetsMetricsProviderProps) => {
    const [currentMetricsWidgets, setCurrentMetricsWidgets] = useState<IMetric[]>([])
    const [oldMetricsWidgets, setOldMetricsWidgets] = useState<IMetric[]>([])

    /**
     * Function to save metrics (data) in (currentMetricsWidgets) or in (oldMetricsWidgets) if isOld is true.
     * If isOld is false then it witt save the metrics in (currentMetricsWidgets), otherwise it will save the metrics in (oldMetricsWidgets).
     *
     * @param data Metrics data.
     * @param isOldData Boolean var for know if the data metrics is the current data or the previous data. Default value is false.
     */
    const addMetrics = useCallback(
        (data: IMetric[], isOldData: boolean = false) => {
            if (isOldData) {
                saveDataInCorrectArray(oldMetricsWidgets, setOldMetricsWidgets, data)
            } else {
                saveDataInCorrectArray(currentMetricsWidgets, setCurrentMetricsWidgets, data)
            }
        },
        [currentMetricsWidgets, oldMetricsWidgets],
    )

    /**
     * Function to get metrics of the widgets targets from (currentMetricsWidgets) or from (oldMetricsWidgets) if fromOldData is true.
     * If fromOldData is false then it witt get the metrics from (oldMetricsWidgets), otherwise it will get the metrics from (currentMetricsWidgets).
     *
     * @param targets Targets widgets types.
     * @param fromOldData Boolean to specifies where we get our data.
     * @returns Metrics data.
     */
    const getMetrics = useCallback(
        (targets: metricTargetType[], fromOldData: boolean = false): IMetric[] => {
            if (fromOldData) {
                return oldMetricsWidgets.filter((item) => targets.includes(item.target))
            } else {
                return currentMetricsWidgets.filter((item) => targets.includes(item.target))
            }
        },
        [currentMetricsWidgets, oldMetricsWidgets],
    )

    /**
     * Function to reset the metrics data - reset (currentMetricsWidgets & oldMetricsWidgets) to [] -.
     */
    const resetMetrics = useCallback(() => {
        setCurrentMetricsWidgets([])
        setOldMetricsWidgets([])
    }, [])

    /**
     * Function to save all the metrics data (metric) in the correct (metricsData) Array.
     * If the metric data doesn't exists in the Array, it will be added. Otherwise, it will be ignored.
     *
     * @param metricsData MetricsData Array.
     * @param setMetricsData Set Function to update the metricsData.
     * @param data Metrics data.
     */
    const saveDataInCorrectArray = (
        metricsData: IMetric[],
        setMetricsData: typeof setOldMetricsWidgets,
        data: IMetric[],
    ) => {
        data.forEach((metric) => {
            if (metricsData.every((item) => item.target !== metric.target)) {
                setMetricsData((prevMetrics) => [...prevMetrics, metric])
            }
        })
    }

    return (
        <ConsumptionWidgetsMetricsContext.Provider
            value={{
                currentMetricsWidgets,
                oldMetricsWidgets,
                addMetrics,
                getMetrics,
                resetMetrics,
            }}
        >
            {children}
        </ConsumptionWidgetsMetricsContext.Provider>
    )
}
