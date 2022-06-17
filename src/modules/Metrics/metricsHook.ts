import { useCallback, useEffect, useRef, useState } from 'react'
import { API_RESOURCES_URL } from 'src/configs'
import {
    getMetricType,
    metricInterval,
    metricTargets,
    IMetrics,
    metricRange,
    metricFilters,
} from 'src/modules/Metrics/Metrics'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { axios } from 'src/common/react-platform-components'

/**
 * Metrics endpoint.
 */
export const METRICS_API = `${API_RESOURCES_URL}/query`

/**
 * Consumption Metrics hook.
 *
 * @param initialState Initial State of the hook.
 * @returns Consumption metrics hook.
 */
export function useMetrics(initialState: getMetricType) {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const [isMetricsLoading, setIsMetricsLoading] = useState(false)
    const [data, setData] = useState<IMetrics | []>([])
    const [range, setRange] = useState<metricRange>(initialState.range)
    const [interval, setMetricInterval] = useState<metricInterval>(initialState.interval)
    const [targets, setTargets] = useState<metricTargets>(initialState.targets)
    const [filters, setFilters] = useState<metricFilters>(initialState.filters ? initialState.filters : [])
    const isInitialMount = useRef(false)

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
                adHocFilters: filters,
            })
            setData(response.data)
        } catch (error) {
            setIsMetricsLoading(false)
            enqueueSnackbar(
                formatMessage({
                    id: 'Erreur de chargement de vos données de consommation',
                    defaultMessage: 'Erreur de chargement de vos données de consommation',
                }),
                {
                    variant: 'error',
                    autoHideDuration: 5000,
                },
            )
        }
        setIsMetricsLoading(false)
    }, [interval, range, targets, filters, enqueueSnackbar, formatMessage])

    // Useeffect is called whenever the hook is instantiated or whenever the dependencies changes.
    useEffect(() => {
        isInitialMount.current = true
        if (isInitialMount.current) {
            getMetrics()
        }

        // Return here is to replicate componentDidUnmount
        return () => {
            isInitialMount.current = false
        }
    }, [getMetrics])

    return {
        isMetricsLoading,
        data,
        targets,
        range,
        interval,
        filters,
        setData,
        setMetricInterval,
        setFilters,
        setRange,
        setTargets,
        getMetrics,
    }
}
