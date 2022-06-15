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
import { IEnedisConsent, INrlinkConsent } from 'src/modules/Consents/Consents'

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
// eslint-disable-next-line sonarjs/cognitive-complexity
export function useMetrics(initialState: getMetricType) {
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
    const [nrlinkConsent, setNrlinkConsent] = useState<INrlinkConsent>()
    const [enedisConsent, setEnedisConsent] = useState<IEnedisConsent>()

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
    const getConsents = useCallback(async () => {
        // Filters is used when we want to get the data of a specific meter.
        // We only check the consents of the meter when the state is populated.
        if (filters.length === 0) return
        if (filters.length > 0) {
            const meterGuidValue = filters[0].value

            // Used Promise.allSettled() instead of Promise.all to return a promise that resolves after all of the given requests have either been fulfilled or rejected.
            // Because Promise.all() throws only when the first promise you pass it rejects and it returns only that rejection.
            const [nrlinkConsent, enedisConsent] = await Promise.allSettled([
                axios.get<INrlinkConsent>(`${NRLINK_CONSENT_API}?meter_guid=${meterGuidValue}`),
                axios.get<IEnedisConsent>(`${ENEDIS_CONSENT_API}?meter_guid=${meterGuidValue}`),
            ])

            // If the promise status is "fulfilled" it returns value
            // If it's "rejetected" it returns reason

            // Nrlink consent.
            if (nrlinkConsent.status === 'fulfilled') {
                setNrlinkConsent(nrlinkConsent.value?.data)
            }

            if (nrlinkConsent.status === 'rejected') {
                enqueueSnackbar('Erreur lors de la récupération du consentement Nrlink', {
                    variant: 'error',
                    autoHideDuration: 5000,
                })
            }

            // Enedis consent.
            if (enedisConsent.status === 'fulfilled') {
                setEnedisConsent(enedisConsent.value?.data)
            }

            if (enedisConsent.status === 'rejected') {
                enqueueSnackbar('Erreur lors de la récupération du consentement Enedis', {
                    variant: 'error',
                    autoHideDuration: 5000,
                })
            }
        }
    }, [filters, enqueueSnackbar])

    // Useeffect is called whenever the hook is instantiated or whenever the dependencies changes.
    useEffect(() => {
        isInitialMount.current = true
        getMetrics()

        // Return here is to replicate componentDidUnmount
        return () => {
            isInitialMount.current = false
        }
    }, [getMetrics, getConsents])

    useEffect(() => {
        getConsents()
    }, [getConsents])

    return {
        isMetricsLoading,
        data,
        targets,
        range,
        interval,
        filters,
        nrlinkConsent,
        enedisConsent,
        setPeriod,
        setFilters,
        setRange,
        setTargets,
        getMetrics,
    }
}
