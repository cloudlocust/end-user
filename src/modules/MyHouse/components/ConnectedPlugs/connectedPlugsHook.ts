import { useState, useCallback, useEffect, useRef } from 'react'
import { API_RESOURCES_URL } from 'src/configs'
import { axios } from 'src/common/react-platform-components'
import { useAxiosCancelToken } from 'src/hooks/AxiosCancelToken'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'

import {
    IConnectedPlug,
    IConnectedPlugApiResponse,
} from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugs.d'

/**
 * Connected Plug requests API.
 */
export const CONNECTED_PLUG_CONSENT_API = `${API_RESOURCES_URL}/shelly/consent`

/**
 * Hook to get Connected Plug Consent list.
 *
 * @param meterGuid Meter GUID.
 * @param immediate Indicates If useConnectedPlugList should be called on instanciation.
 * @returns Hook useConnectedPlugList.
 */
export function useConnectedPlugList(meterGuid: string, immediate: boolean = true) {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const [loadingInProgress, setLoadingInProgress] = useState(false)
    const [connectedPlugList, setConnectedPlugList] = useState<IConnectedPlug[] | []>([])
    const isInitialMount = useRef(true)
    const { isCancel, source } = useAxiosCancelToken()

    /**
     * Fetching Offers function.
     */
    const loadConnectedPlugList = useCallback(async () => {
        setLoadingInProgress(true)
        try {
            const { data: responseData } = await axios.get<IConnectedPlugApiResponse>(
                `${CONNECTED_PLUG_CONSENT_API}/${meterGuid}`,
                {
                    cancelToken: source.current.token,
                },
            )
            setConnectedPlugList(responseData.devices)
        } catch (error) {
            if (isCancel(error)) return
            enqueueSnackbar(
                formatMessage({
                    id: 'Erreur lors du chargement de vos prises',
                    defaultMessage: 'Erreur lors du chargement de vos prises',
                }),
                { variant: 'error' },
            )
        }
        setLoadingInProgress(false)
    }, [formatMessage, enqueueSnackbar, meterGuid, isCancel, source])

    // Happens everytime getMetrics dependencies change, doesn't happen first time hook is instanciated.
    useEffect(() => {
        if (!isInitialMount.current) {
            loadConnectedPlugList()
        }
    }, [loadConnectedPlugList])

    // Happens only once on instanciation of hook. getMetrics execute if we want to fire it right away.
    // Otherwise execute can be called later, such as when filters change
    useEffect(() => {
        if (isInitialMount.current) {
            if (immediate) loadConnectedPlugList()
            isInitialMount.current = false
        }
    }, [immediate, loadConnectedPlugList])

    return {
        loadingInProgress,
        loadConnectedPlugList,
        connectedPlugList,
    }
}
