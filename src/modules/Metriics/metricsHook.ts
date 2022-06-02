import dayjs from 'dayjs'
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

const DEFAULT_RANGE: metricRange = {
    from: dayjs().startOf('day').toDate().toISOString(),
    to: dayjs().toDate().toISOString(),
}

const DEFAULT_TARGET: metricTargets = [
    {
        target: 'nrlink_consumption_metrics',
        type: 'timeseries',
    },
]

/**
 * Consumption Metrics hook.
 *
 * @returns Consumption metrics hook.
 */
export function useConsumptionMetrics() {
    const [isMetricsLoading, setIsMetricsLoading] = useState(false)
    const [data, setData] = useState<IMetrics>()
    const [range, setRange] = useState<metricRange>(DEFAULT_RANGE)
    const [interval, setPeriod] = useState<metricInterval>('1min')
    const [targets, setTargets] = useState<metricTargets>(DEFAULT_TARGET)
    const [filters, setFilters] = useState<metricFilters>()

    /**
     * Get Metrics function: Everytime filters or range or interval or targets has changed, it triggers the effect.
     */
    const getMetrics = useCallback(async () => {
        try {
            setIsMetricsLoading(true)
            const response = await axios.post(METRICS_API, {
                range,
                interval,
                targets,
                addHookFilters: filters,
            } as getMetricType)
            setData(response.data)
            setIsMetricsLoading(false)
        } catch (error) {
            setIsMetricsLoading(false)
        }
    }, [filters, range, interval, targets])

    useEffect(() => {
        getMetrics()
    }, [getMetrics])

    return { isMetricsLoading, data, targets, setPeriod, setFilters, setRange, setTargets, getMetrics }
}
