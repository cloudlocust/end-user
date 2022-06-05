import { useCallback, useEffect, useState } from 'react'
import { axios } from 'src/common/react-platform-components'
import { API_RESOURCES_URL } from 'src/configs'
import {
    getMetricType,
    metricInterval,
    metricTargets,
    IMetrics,
    metricRange,
    metricFilters,
} from 'src/modules/Metriics/Metrics'

/**
 * Metrics endpoint.
 */
export const METRICS_API = `${API_RESOURCES_URL}/metrics`

/**
 * Consumption Metrics hook.
 *
 * @param initialState Initial State of the hook.
 * @returns Consumption metrics hook.
 */
export function useConsumptionMetrics(initialState: getMetricType) {
    const [isMetricsLoading, setIsMetricsLoading] = useState(false)
    const [data, setData] = useState<IMetrics>()
    const [range, setRange] = useState<metricRange>(initialState.range)
    const [interval, setPeriod] = useState<metricInterval>(initialState.interval)
    const [targets, setTargets] = useState<metricTargets>(initialState.targets)
    const [filters, setFilters] = useState<metricFilters>(
        initialState.addHookFilters ? initialState.addHookFilters : [],
    )

    /**
     * Get Metrics function: Everytime filters or range or interval or targets has changed, it triggers the function call.
     */
    const getMetrics = useCallback(async () => {
        setIsMetricsLoading(true)
        try {
            const response = await axios.post(METRICS_API, {
                interval,
                range,
                targets,
                addHookFilters: filters,
            })
            setData(response.data)
            setIsMetricsLoading(false)
        } catch (error) {
            setIsMetricsLoading(false)
        }
    }, [interval, range, targets, filters])

    useEffect(() => {
        getMetrics()
    }, [getMetrics])

    return { isMetricsLoading, data, targets, interval, range, setPeriod, setFilters, setRange, setTargets, getMetrics }
}
