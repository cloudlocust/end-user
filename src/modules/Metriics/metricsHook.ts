import { useEffect, useState } from 'react'
import { axios } from 'src/common/react-platform-components'
import { API_RESOURCES_URL } from 'src/configs'

/**
 * Metric Targets.
 */
export enum MetricTargets {
    /**
     *
     */
    NRLINK_CONSUMPTION_METRICS = 'nrlink_consumption_metrics',
    /**
     *
     */
    ENEDIS_CONSUMPTION_METRICS = 'enedis_consumption_metrics',
    /**
     *
     */
    ENPHASE_CONSUMPTION_METRICS = 'enphase_consumption_metrics',
    /**
     *
     */
    ENPHASE_PRODUCTION_METRICS = 'enphase_production_metrics',
    /**
     *
     */
    EXTERNAL_TEMPERATURE_METRICS = 'external_temperature_metrics',
    /**
     *
     */
    NRLINK_INTERNAL_TEMPERATURE_METRICS = 'nrlink_internal_temperature_metrics',
}

/**
 * Metrics endpoint.
 */
export const METRICS_API = `${API_RESOURCES_URL}/metrics`

/**
 * Consumption Metrics hook.
 *
 * @returns Consumption metrics hook.
 */
export function useConsumptionMetrics() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isMetricsLoading, setIsMetricsLoading] = useState(false)
    const [data, setData] = useState()
    const [interval, setInterval] = useState<string>()
    const [filters, setFilters] = useState<string>('')
    const [range, setRange] = useState<string>()

    useEffect(() => {
        /**
         * Get Metrics function.
         */
        async function getMetrics() {
            setIsMetricsLoading(true)
            const response = await axios.post(METRICS_API, { filters, interval, range })
            setData(response.data)
            setIsMetricsLoading(false)
        }

        getMetrics()
    }, [filters, range, interval])

    return { data, setInterval, setFilters, setRange }
}
