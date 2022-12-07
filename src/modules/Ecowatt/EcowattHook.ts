import { useCallback, useEffect, useRef, useState } from 'react'
import { API_RESOURCES_URL } from 'src/configs'
import { IEcowattData } from 'src/modules/Ecowatt/ecowatt'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { axios } from 'src/common/react-platform-components'

/**
 * Ecowatt endpoint.
 */
export const ECOWATT_ENDPOINT = `${API_RESOURCES_URL}/rte/ecowatt/signals`

/**
 * UseEcowatt hook.
 *
 * @returns UseEcowatt.
 */
export function useEcowatt() {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const [ecowattData, setEcowattData] = useState<IEcowattData | null>(null)
    const [isLoadingInProgress, setIsLoadingInProgress] = useState(false)
    const isInitialMount = useRef(true)

    /**
     * Get ecowatt signals.
     */
    const getEcowattSignals = useCallback(async () => {
        try {
            setIsLoadingInProgress(true)
            const { data: responseData } = await axios.get<IEcowattData>(ECOWATT_ENDPOINT)
            if (responseData) {
                setEcowattData(responseData)
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

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false
            getEcowattSignals()
        }
    }, [getEcowattSignals])

    return {
        isLoadingInProgress,
        setIsLoadingInProgress,
        ecowattData,
        setEcowattData,
    }
}
