import { useCallback, useEffect, useRef, useState } from 'react'
import { API_RESOURCES_URL } from 'src/configs'
import { IEcowattAlerts, IEcowattSignalsData } from 'src/modules/Ecowatt/ecowatt'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { axios } from 'src/common/react-platform-components'
import { orderBy } from 'lodash'

/**
 * Ecowatt signals endpoint.
 */
export const ECOWATT_SIGNALS_ENDPOINT = `${API_RESOURCES_URL}/rte/ecowatt/signals`

/**
 * Function that returns endpoint with housing id.
 *
 * @param houseId House id of the current housing.
 * @returns Endpoint.
 */
export const ECOWATT_ALERTS_ENDPOINT = (houseId: number) => `/housings/${houseId}/ecowatt-alerts`

/**
 * UseEcowatt hook.
 *
 * @param immediate Indicates if getEcowattSignals will execute when useEcowatt is instanciated.
 * @returns UseEcowatt.
 */
export function useEcowatt(immediate: boolean = false) {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const [ecowattSignalsData, setEcowattSignalsData] = useState<IEcowattSignalsData | null>(null)
    const [ecowattAlerts, setEcowattAlerts] = useState<IEcowattAlerts | null>(null)
    const [isLoadingInProgress, setIsLoadingInProgress] = useState(false)
    const isInitialMount = useRef(true)

    /**
     * Get ecowatt signals.
     */
    const getEcowattSignals = useCallback(async () => {
        try {
            setIsLoadingInProgress(true)
            const { data: responseData } = await axios.get<IEcowattSignalsData>(ECOWATT_SIGNALS_ENDPOINT)
            if (responseData) {
                // Sort ecowatt data asc.
                const sortedData = orderBy(responseData, [(obj) => new Date(obj.readingAt)], ['asc'])
                setEcowattSignalsData(sortedData)
            }
            setIsLoadingInProgress(false)
        } catch (error) {
            setIsLoadingInProgress(false)
            enqueueSnackbar(
                formatMessage({
                    id: 'Erreur lors de la récupération des données de Ecowatt',
                    defaultMessage: 'Erreur lors de la récupération des données de Ecowatt',
                }),
                { variant: 'error', autoHideDuration: 5000 },
            )
        }
    }, [enqueueSnackbar, formatMessage])

    const getEcowattAlerts = useCallback(
        async (houseId: number) => {
            try {
                setIsLoadingInProgress(true)
                const { data: responseData } = await axios.get<IEcowattAlerts>(ECOWATT_ALERTS_ENDPOINT(houseId))
                if (responseData) {
                    setEcowattAlerts(responseData)
                }
                setIsLoadingInProgress(false)
            } catch (error) {
                setIsLoadingInProgress(false)
                enqueueSnackbar(
                    formatMessage({
                        id: 'Erreur lors de la récupération des alertes Ecowatts',
                        defaultMessage: 'Erreur lors de la récupération des alertes Ecowatts',
                    }),
                    { variant: 'error', autoHideDuration: 5000 },
                )
            }
        },
        [enqueueSnackbar, formatMessage],
    )

    const updateEcowattAlert = useCallback(
        async (houseId: number, alerts: IEcowattAlerts) => {
            try {
                const { data: responseData } = await axios.post<IEcowattAlerts>(
                    ECOWATT_ALERTS_ENDPOINT(houseId),
                    alerts,
                )
                if (responseData) {
                    setEcowattAlerts(responseData)
                }
            } catch (error) {
                enqueueSnackbar(
                    formatMessage({
                        id: "Erreur lors de la modification d'une alerte Ecowatts",
                        defaultMessage: "Erreur lors de la modification d'une alerte Ecowatts",
                    }),
                    { variant: 'error', autoHideDuration: 5000 },
                )
            }
        },
        [enqueueSnackbar, formatMessage],
    )

    useEffect(() => {
        if (isInitialMount.current) {
            immediate && getEcowattSignals()
            isInitialMount.current = false
        }
    }, [immediate, getEcowattSignals])

    return {
        isLoadingInProgress,
        setIsLoadingInProgress,
        ecowattSignalsData,
        setEcowattSignalsData,
        ecowattAlerts,
        getEcowattAlerts,
        updateEcowattAlert,
    }
}
