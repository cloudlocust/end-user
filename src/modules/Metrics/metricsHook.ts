import { useCallback, useEffect, useRef, useState } from 'react'
import { API_RESOURCES_URL } from 'src/configs'
import {
    getMetricType,
    metricIntervalType,
    metricTargetsType,
    IMetric,
    metricRangeType,
    metricFiltersType,
    metricTargetType,
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
 * @param immediate Indicates if getMetrics will execute when useMetrics instanciated, by default its false because usually the filters meterGuid param is empty thus the getMetrics will always show an error on instaciation of the hook when filters meterGuid is not set.
 * @returns Consumption metrics hook.
 */
export function useMetrics(initialState: getMetricType, immediate: boolean = false) {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const [isMetricsLoading, setIsMetricsLoading] = useState(false)
    const [data, setData] = useState<IMetric[] | []>([])
    const [range, setRange] = useState<metricRangeType>(initialState.range)
    const [metricsInterval, setMetricsInterval] = useState<metricIntervalType>(initialState.interval)
    const [targets, setTargets] = useState<metricTargetsType>(initialState.targets)
    const [filters, setFilters] = useState<metricFiltersType>(initialState.filters ? initialState.filters : [])
    const isInitialMount = useRef(true)

    /**
     * Get Metrics function: Everytime filters or range or targets or metricsInterval has changed, it triggers the function call.
     */
    const getMetrics = useCallback(async () => {
        setIsMetricsLoading(true)
        try {
            const response = await axios.post(METRICS_API, {
                interval: metricsInterval,
                range,
                targets,
                adhocFilters: filters,
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
    }, [enqueueSnackbar, filters, formatMessage, metricsInterval, range, targets])

    // Happens everytime getMetrics dependencies change, doesn't happen first time hook is instanciated.
    useEffect(() => {
        if (!isInitialMount.current) {
            getMetrics()
        }
    }, [getMetrics])

    // Happens only once on instanciation of hook. getMetrics execute if we want to fire it right away.
    // Otherwise execute can be called later, such as when filters change
    useEffect(() => {
        if (isInitialMount.current) {
            immediate && getMetrics()
            isInitialMount.current = false
        }
    }, [immediate, getMetrics])

    /**
     * Add a target in the metrics request.
     *
     * @param target Target to be added.
     */
    const addTarget = (target: metricTargetType) => {
        if (!targets.find((targetEl) => targetEl.target === target)) {
            setTargets((prevState) => {
                return [...prevState, { type: 'timeserie', target }]
            })
        }
    }
    /**
     * Remove a target in the metrics request.
     *
     * @param target Target to be removed.
     */
    const removeTarget = (target: metricTargetType) => {
        setTargets((prevState) => prevState.filter((targetEl) => targetEl.target !== target))
    }

    return {
        isMetricsLoading,
        data,
        targets,
        range,
        metricsInterval,
        filters,
        setData,
        setMetricsInterval,
        setFilters,
        setRange,
        setTargets,
        addTarget,
        removeTarget,
    }
}
