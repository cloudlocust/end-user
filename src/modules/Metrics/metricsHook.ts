import { useEffect, useState } from 'react'
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
 * @returns Consumption metrics hook.
 */
export function useMetrics(initialState: getMetricType) {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const [isMetricsLoading, setIsMetricsLoading] = useState(false)
    const [data, setData] = useState<IMetric[] | []>([])
    const [range, setRange] = useState<metricRangeType>(initialState.range)
    const [metricsInterval, setMetricsInterval] = useState<metricIntervalType>(initialState.interval)
    const [targets, setTargets] = useState<metricTargetsType>(initialState.targets)
    const [filters, setFilters] = useState<metricFiltersType>(initialState.filters ? initialState.filters : [])

    // UseEffect is called whenever the hook is instantiated or whenever the dependencies changes.
    useEffect(() => {
        /**
         * Get Metrics function: Everytime filters or range or targets or metricsInterval has changed, it triggers the function call.
         */
        ;(async () => {
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
        })()
    }, [enqueueSnackbar, filters, formatMessage, metricsInterval, range, targets])

    /**
     * Add a target in the metrics request.
     *
     * @param target Target to be added.
     */
    const addTarget = (target: metricTargetType) => {
        const isExistTarget = targets.find((targetEl) => targetEl.target === target)
        if (!isExistTarget) {
            setTargets((prevState) => {
                const newTarget = [...prevState]
                newTarget.push({
                    type: 'timeseries',
                    target,
                })
                return newTarget
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
        addTarget,
        removeTarget,
        setData,
        setMetricsInterval,
        setFilters,
        setRange,
        setTargets,
    }
}
