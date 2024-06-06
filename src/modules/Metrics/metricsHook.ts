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
    getMetricsWithParamsType,
    metricHistoryTargetsEnum,
} from 'src/modules/Metrics/Metrics'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { axios } from 'src/common/react-platform-components'
import { useAxiosCancelToken } from 'src/hooks/AxiosCancelToken'
import { getOptimalTargets, reverseTargetHistoryMapping } from 'src/modules/Metrics/metricsFunctions'

/**
 * Get Metrics Error Message.
 */
export const GET_METRICS_ERROR_MESSAGE =
    'Nous rencontrons une erreur lors de la récupération de vos données de consommation. Veuillez réessayer plus tard'
/**
 * Metrics endpoint.
 */
export const METRICS_API = `${API_RESOURCES_URL}/query`

const defaultInitialState: getMetricType = {
    range: {
        from: '',
        to: '',
    },
    interval: '30m',
    targets: [],
}

/**
 * Consumption Metrics hook.
 *
 * @param initialState Initial State of the hook.
 * @param immediate Indicates if getMetrics will execute when useMetrics instanciated, by default its false because usually the filters meterGuid param is empty thus the getMetrics will always show an error on instaciation of the hook when filters meterGuid is not set.
 * @param isUsingHistoryTargets Boolean indicating that we should use history targets instaed of the simple targets.
 * @returns Consumption metrics hook.
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export function useMetrics(
    initialState: getMetricType = defaultInitialState,
    immediate: boolean = false,
    isUsingHistoryTargets: boolean = false,
) {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const [isMetricsLoading, setIsMetricsLoading] = useState(false)
    const [data, setData] = useState<IMetric[] | []>([])
    const [range, setRange] = useState<metricRangeType>(initialState.range)
    const [metricsInterval, setMetricsInterval] = useState<metricIntervalType>(initialState.interval)
    const [targets, setTargets] = useState<metricTargetsType>(initialState.targets)
    const [filters, setFilters] = useState<metricFiltersType>(initialState.filters ? initialState.filters : [])
    const isInitialMount = useRef(true)
    const { isCancel, source } = useAxiosCancelToken()

    /**
     * Get Metrics function: Everytime filters or range or targets or metricsInterval has changed, it triggers the function call.
     */
    const getMetrics = useCallback(async () => {
        if (!targets?.length) {
            setData([])
            return
        }
        setIsMetricsLoading(true)
        try {
            const { data: metricsData } = await axios.post<IMetric[]>(
                METRICS_API,
                {
                    interval: metricsInterval,
                    range,
                    targets: isUsingHistoryTargets ? getOptimalTargets(targets, metricsInterval) : targets,
                    adhocFilters: filters,
                },
                {
                    cancelToken: source.current.token,
                },
            )
            setData(
                metricsData.map((metric) => ({
                    ...metric,
                    target: reverseTargetHistoryMapping[metric.target as metricHistoryTargetsEnum] ?? metric.target,
                })),
            )
        } catch (error) {
            if (isCancel(error)) {
                setIsMetricsLoading(false)
                return
            }
            enqueueSnackbar(
                formatMessage({
                    id: GET_METRICS_ERROR_MESSAGE,
                    defaultMessage: GET_METRICS_ERROR_MESSAGE,
                }),
                {
                    variant: 'error',
                    autoHideDuration: 5000,
                },
            )
            setData([])
        }
        setIsMetricsLoading(false)
    }, [
        enqueueSnackbar,
        filters,
        formatMessage,
        isCancel,
        isUsingHistoryTargets,
        metricsInterval,
        range,
        source,
        targets,
    ])

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
            if (immediate) getMetrics()
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

    /**
     * Get Metrics function with params to make the /query request by calling this function.
     *
     * @param params Params of getMetricsWithParams.
     * @param params.interval Interval metrics request.
     * @param params.range Range metrics request.
     * @param params.targets Targets metrics request.
     * @param params.filters Adhoc Filters request.
     */
    const getMetricsWithParams = useCallback(
        async (params: getMetricsWithParamsType, isSettingData: boolean = true): Promise<IMetric[]> => {
            if (!params.targets?.length) {
                if (isSettingData) {
                    setData([])
                }
                return []
            }
            setIsMetricsLoading(true)
            const targetsBody: metricTargetsType = params.targets.map((target) => ({ target, type: 'timeserie' }))
            try {
                const { data: metricsData } = await axios.post<IMetric[]>(METRICS_API, {
                    interval: params.interval,
                    range: params.range,
                    targets: isUsingHistoryTargets ? getOptimalTargets(targetsBody, params.interval) : targetsBody,
                    adhocFilters: params.filters,
                })
                const metricDataWithoutHistoryTargets = metricsData.map((metric) => ({
                    ...metric,
                    target: reverseTargetHistoryMapping[metric.target as metricHistoryTargetsEnum] ?? metric.target,
                }))
                if (isSettingData) {
                    setData(metricDataWithoutHistoryTargets)
                }
                return metricDataWithoutHistoryTargets
            } catch (error) {
                enqueueSnackbar(
                    formatMessage({
                        id: GET_METRICS_ERROR_MESSAGE,
                        defaultMessage: GET_METRICS_ERROR_MESSAGE,
                    }),
                    {
                        variant: 'error',
                        autoHideDuration: 5000,
                    },
                )
                if (isSettingData) {
                    setData([])
                }
                return []
            } finally {
                setIsMetricsLoading(false)
            }
        },
        [enqueueSnackbar, formatMessage, isUsingHistoryTargets],
    )

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
        getMetricsWithParams,
    }
}

/**
 * Hook used to wrapper useMetrics for we can use it in the same component and mock it in the tests.
 *
 * @param initialState Initial State of the hook.
 * @param immediate Indicates if getMetrics will execute when useMetrics instantiated, by default its false because usually the filters meterGuid param is empty thus the getMetrics will always show an error on instaciation of the hook when filters meterGuid is not set.
 * @param isUsingHistoryTargets Boolean indicating that we should use history targets instaed of the simple targets.
 * @returns Consumption metrics hook.
 */
export function useAdditionalMetrics(
    initialState: getMetricType = defaultInitialState,
    immediate: boolean = false,
    isUsingHistoryTargets: boolean = false,
) {
    return useMetrics(initialState, immediate, isUsingHistoryTargets)
}
