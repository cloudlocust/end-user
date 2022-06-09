import { useCallback, useEffect, useRef, useState } from 'react'
import { API_RESOURCES_URL } from 'src/configs'
import {
    getMetricType,
    metricInterval,
    metricTargets,
    IMetrics,
    metricRange,
    metricFilters,
} from 'src/modules/Metriics/Metrics'
import applyCaseMiddleware from 'axios-case-converter'
import baseAxios from 'axios'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'

// Axios with preservedKeys. It was copied from src/common/react-platform-components/utils/mm.tsx in order not to modify the original axios.
const axios = applyCaseMiddleware(baseAxios, {
    ignoreHeaders: true,
    caseFunctions: {
        /**
         * TODO Document.
         *
         * @param input TODO Document.
         * @param options TODO Document.
         * @returns TODO Document.
         */
        //TODO Correct this
        //@ts-ignore
        snake: (input: string, options: never) => {
            return input
                .split(/(?=[A-Z])/)
                .join('_')
                .toLowerCase()
        },
    },
    // PreservedKeys are keys that we don't want them to be snake case.
    preservedKeys: ['addHookFilters'],
})

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
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const [isMetricsLoading, setIsMetricsLoading] = useState(false)
    const [data, setData] = useState<IMetrics | []>([])
    const [range, setRange] = useState<metricRange>(initialState.range)
    const [interval, setPeriod] = useState<metricInterval>(initialState.interval)
    const [targets, setTargets] = useState<metricTargets>(initialState.targets)
    const [filters, setFilters] = useState<metricFilters>(
        initialState.addHookFilters ? initialState.addHookFilters : [],
    )
    const isInitialMount = useRef(true)

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interval, range, targets, filters])

    useEffect(() => {
        getMetrics()
    }, [getMetrics])

    // UseEffect executes on initial intantiation, responsible for getMetrics on initialLoad.
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false
            getMetrics()
        }
    }, [getMetrics])

    return { isMetricsLoading, data, targets, interval, range, setPeriod, setFilters, setRange, setTargets, getMetrics }
}
