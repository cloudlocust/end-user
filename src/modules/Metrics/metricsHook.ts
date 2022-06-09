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
 * Nrlink consent endpoint.
 */
export const NRLINK_CONSENT_API = `${API_RESOURCES_URL}/nrlink/consent`

/**
 * Nrlink consent endpoint.
 */
export const ENEDIS_CONSENT_API = `${API_RESOURCES_URL}/enedis/consent`

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
    }, [interval, range, targets, filters, enqueueSnackbar, formatMessage])

    /**
     * Check Consents function.
     */
    const checkConsents = useCallback(async () => {
        if (filters.length > 0) {
            const meterGuid = filters[0].value

            const nrlinkConsentRequest = await axios.get(`${NRLINK_CONSENT_API}/meter_guid=${meterGuid}`)
            const enedisConsentRequest = await axios.get(`${ENEDIS_CONSENT_API}/meter_guid=${meterGuid}`)

            try {
                const responses = await Promise.all([nrlinkConsentRequest, enedisConsentRequest])

                // eslint-disable-next-line no-console
                console.log(responses)
            } catch (errors) {
                // eslint-disable-next-line no-console
                console.error(errors)
            }
        }
    }, [filters])

    // Useeffect is called whenever the hook is instantiated or whenever the dependencies changes.
    useEffect(() => {
        isInitialMount.current = true
        getMetrics()

        // Return here is to replicate componentDidUnmount
        return () => {
            isInitialMount.current = false
        }
    }, [getMetrics])

    useEffect(() => {
        checkConsents()
    }, [checkConsents])

    return {
        isMetricsLoading,
        data,
        targets,
        range,
        interval,
        filters,
        setPeriod,
        setFilters,
        setRange,
        setTargets,
        getMetrics,
        checkConsents,
    }
}
