import { useCallback, useEffect, useRef, useState } from 'react'
import { API_RESOURCES_URL } from 'src/configs'
import { IEcowattSignalsData } from 'src/modules/Ecowatt/ecowatt'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { axios } from 'src/common/react-platform-components'
import { useAxiosCancelToken } from 'src/hooks/AxiosCancelToken/'
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
export const ECOWATT_ALERTS_ENDPOINT = (houseId: number) => `${API_RESOURCES_URL}/housings/${houseId}/ecowatt-alerts`

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
    const [isLoadingInProgress, setIsLoadingInProgress] = useState(false)
    const isInitialMount = useRef(true)
    const { isCancel, source } = useAxiosCancelToken()

    /**
     * Get ecowatt signals.
     */
    const getEcowattSignals = useCallback(async () => {
        try {
            setIsLoadingInProgress(true)
            const { data: responseData } = await axios.get<IEcowattSignalsData>(ECOWATT_SIGNALS_ENDPOINT, {
                cancelToken: source.current.token,
            })
            if (responseData) {
                // Sort ecowatt data asc.
                const sortedData = orderBy(responseData, [(obj) => new Date(obj.readingAt)], ['asc'])
                setEcowattSignalsData(sortedData)
            }
            setIsLoadingInProgress(false)
        } catch (error) {
            if (isCancel(error)) return
            setIsLoadingInProgress(false)
            enqueueSnackbar(
                formatMessage({
                    id: 'Erreur lors de la récupération des données de Ecowatt',
                    defaultMessage: 'Erreur lors de la récupération des données de Ecowatt',
                }),
                { variant: 'error', autoHideDuration: 5000 },
            )
        }
    }, [enqueueSnackbar, formatMessage, isCancel, source])

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
    }
}
