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
import { consentsType, IEnedisConsent, INrlinkConsent } from 'src/modules/Meters/Meters'

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
    const [consents, setConsents] = useState<consentsType>()

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
        if (filters.length === 0) return
        if (filters.length > 0) {
            const meterGuidValue = filters[0].value
            try {
                await Promise.all([
                    axios.get<INrlinkConsent>(`${NRLINK_CONSENT_API}?meter_guid=${meterGuidValue}`),
                    axios.get<IEnedisConsent>(`${ENEDIS_CONSENT_API}?meter_guid=${meterGuidValue}`),
                ]).then(([nrlinkConsentResponse, enedisConsentResponse]) => {
                    setConsents({
                        nrlinkConsent: nrlinkConsentResponse.data,
                        enedisConsent: enedisConsentResponse.data,
                    })
                })
            } catch (errors) {
                enqueueSnackbar(
                    formatMessage({
                        id: 'Erreur lors de la récupération des consentements',
                        defaultMessage: 'Erreur lors de la récupération des consentements',
                    }),
                    {
                        variant: 'error',
                        autoHideDuration: 5000,
                    },
                )
            }
        }
    }, [filters, enqueueSnackbar, formatMessage])

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
        consents,
        setPeriod,
        setFilters,
        setRange,
        setTargets,
        getMetrics,
        checkConsents,
    }
}
