import { useState } from 'react'
import { API_RESOURCES_URL } from 'src/configs'

/**
 * Metrics endpoint.
 */
export const METRICS_API = `${API_RESOURCES_URL}/metrics`

/**
 * Metrics hook.
 *
 * @returns Metrics hook.
 */
export function useMetrics() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isMetricsLoading, setIsMetricsLoading] = useState(false)

    /**
     * Get the metrics of all the meters.
     */
    const getMetrics = async () => {}

    /**
     * Get the metric of single meter.
     */
    const getOneMetric = async () => {}

    return { isMetricsLoading, getMetrics, getOneMetric }
}
