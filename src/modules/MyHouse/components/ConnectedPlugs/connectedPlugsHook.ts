import { useState, useCallback, useRef } from 'react'
import { API_RESOURCES_URL } from 'src/configs'
import { axios } from 'src/common/react-platform-components'
import { useAxiosCancelToken } from 'src/hooks/AxiosCancelToken'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'

import {
    IConnectedPlug,
    IConnectedPlugApiResponse,
    IConnectedPlugTypeApiResponse,
    IShellyConnectedPlugLink,
    connectedPlugTypeEnum,
} from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugs.d'
import { isNull } from 'lodash'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'

/**
 * Connected Plug requests API.
 */
export const CONNECTED_PLUG_API = `${API_RESOURCES_URL}/shelly`

/**
 * Connected Plug Consent requests API.
 */
export const CONNECTED_PLUG_CONSENT_API = `${CONNECTED_PLUG_API}/consent`

/**
 * Connected Plug requests API.
 */
export const SHELLY_CONNECTED_PLUG_LINK_API = `${CONNECTED_PLUG_CONSENT_API}/link`

/**
 * API to associate a connected plug in production mode.
 */
export const ASSOCIATE_CONNECTED_PLUG_API = `${CONNECTED_PLUG_API}/associate`

/**
 * Function to GET_CONNECTED_PLUG_TYPE_API.
 *
 * @param housingId HousingId.
 * @returns API URL of Connected Plug Type.
 */
export const GET_CONNECTED_PLUG_TYPE_API = (housingId: number) => `${HOUSING_API}/${housingId}/plugs-associations`
/**
 * Hook to get Connected Plug Consent list.
 *
 * @param meterGuid Meter GUID.
 * @param housingId Housing Id.
 * @returns Hook useConnectedPlugList.
 */
export function useConnectedPlugList(meterGuid?: string, housingId?: number) {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const [loadingInProgress, setLoadingInProgress] = useState(false)
    const [connectedPlugList, setConnectedPlugList] = useState<IConnectedPlug[] | []>([])
    const { isCancel, source } = useAxiosCancelToken()

    /**
     * Fetching Offers function.
     */
    const loadConnectedPlugList = useCallback(async () => {
        setConnectedPlugList([])
        if (!meterGuid || !housingId) return
        setLoadingInProgress(true)
        /**
         * Used Promise.allSettled() instead of Promise.all to return a promise that resolves after all of the given requests have either been fulfilled or rejected.
         * Because Promise.all() throws only when the first promise is rejected and it returns only that rejection.
         * If the promise status is "fulfilled" it returns "value", If it's "rejetected" it returns "reason".
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled .
         */
        const [connectedPlugConsentData, connectedPlugTypeData] = await Promise.allSettled([
            axios.get<IConnectedPlugApiResponse>(`${CONNECTED_PLUG_CONSENT_API}/${meterGuid}`, {
                cancelToken: source.current.token,
            }),
            axios.get<IConnectedPlugTypeApiResponse>(GET_CONNECTED_PLUG_TYPE_API(housingId), {
                cancelToken: source.current.token,
            }),
        ])

        // Cancel previous request.
        if (connectedPlugConsentData.status === 'rejected' && isCancel(connectedPlugConsentData.reason)) return
        if (connectedPlugTypeData.status === 'rejected' && isCancel(connectedPlugTypeData.reason)) return

        // Set ConnectedPlugList when Fulfilled.
        if (connectedPlugConsentData.status === 'fulfilled' && connectedPlugTypeData.status === 'fulfilled') {
            const responseData: IConnectedPlug[] = connectedPlugConsentData.value?.data.devices.map(
                (connectedPlugConsent) => {
                    const foundConnectedPlugType = connectedPlugTypeData.value?.data.find(
                        (connectedPlugType) => connectedPlugType.deviceId === connectedPlugConsent.deviceId,
                    )
                    return {
                        ...connectedPlugConsent,
                        type: foundConnectedPlugType ? foundConnectedPlugType.type : null,
                    }
                },
            )

            setConnectedPlugList(responseData)
        }
        // Show error message when rejected.
        if (connectedPlugConsentData.status === 'rejected' || connectedPlugTypeData.status === 'rejected') {
            enqueueSnackbar(
                formatMessage({
                    id: 'Erreur lors du chargement de vos prises',
                    defaultMessage: 'Erreur lors du chargement de vos prises',
                }),
                {
                    variant: 'error',
                    autoHideDuration: 5000,
                },
            )
        }
        setLoadingInProgress(false)
    }, [meterGuid, housingId, source, isCancel, enqueueSnackbar, formatMessage])

    /**
     * Handler to set production mode in a connected plug.
     *
     * @param associate Indicate if the connected plug should be associated in production mode or not.
     */
    const associateConnectedPlug = useCallback(
        async (connectedPlugId: string, housingId: number, associate: boolean = true) => {
            setLoadingInProgress(true)
            try {
                await axios.post(
                    `${ASSOCIATE_CONNECTED_PLUG_API}`,
                    {
                        deviceId: connectedPlugId,
                        housingId,
                        state: associate ? 'production' : null,
                    },
                    {
                        cancelToken: source.current.token,
                    },
                )
                setLoadingInProgress(false)
                return true
            } catch (error) {
                if (isCancel(error)) return
                enqueueSnackbar(
                    formatMessage({
                        id: 'Erreur lors de la liaison de la prise connectée',
                        defaultMessage: 'Erreur lors de la liaison de la prise connectée',
                    }),
                    { variant: 'error' },
                )
                setLoadingInProgress(false)
            }
        },
        [enqueueSnackbar, formatMessage, isCancel, source],
    )

    /**
     * Get The Production mode Connected Plug if found.
     *
     * @returns The production mode connected plug if found.
     */
    const getProductionConnectedPlug = () => {
        return connectedPlugList.find((connectedPlug) => connectedPlug.type === connectedPlugTypeEnum.production)
    }
    return {
        loadingInProgress,
        loadConnectedPlugList,
        connectedPlugList,
        associateConnectedPlug,
        getProductionConnectedPlug,
    }
}

/**
 * Hook to handle shelly connected plugs functions.
 *
 * @param housingId Housing Id.
 * @returns Shelly Connected Plugs Link & Popup open.
 */
export const useShellyConnectedPlugs = (housingId?: number) => {
    const [loadingInProgress, setLoadingInProgress] = useState(false)
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    /**
     * This timer is used as a solution to detect the open of shellyWindow and does a polling that checks if a timer is closed or not.
     *
     * @see {@link Reference: https://stackoverflow.com/a/48240128}
     */
    const timerShellyWindowListener = useRef<NodeJS.Timer | null>(null)
    const shellyWindow = useRef<Window | null>(null)
    const { isCancel, source } = useAxiosCancelToken()

    /**
     * Display the shelly window.
     */
    const displayShellyWindow = useCallback(
        async (shellyUrl: string, onCloseShellyWindow?: () => void) => {
            try {
                const newShellyWindow = window.open(
                    shellyUrl,
                    '_blank',
                    `width=1024,height=768,left=${window.screen.availWidth / 2 - 200},top=${
                        window.screen.availHeight / 2 - 150
                    }`,
                )
                if (!newShellyWindow) throw Error()

                // Close previous window with previous timer, and allow only one.
                if (shellyWindow.current) {
                    shellyWindow.current.close()
                    // Clear previous timer.
                    if (!isNull(timerShellyWindowListener.current)) clearInterval(timerShellyWindowListener.current)
                }

                // Opens a popup and detect the close of the popup no matter the url in the popup.
                // Reference: https://stackoverflow.com/a/48240128
                if (onCloseShellyWindow) {
                    timerShellyWindowListener.current = setInterval(function () {
                        if (newShellyWindow.closed) {
                            onCloseShellyWindow()
                            // Clear The current timer.
                            if (!isNull(timerShellyWindowListener.current))
                                clearInterval(timerShellyWindowListener.current)
                        }
                    }, 1000)
                }

                shellyWindow.current = newShellyWindow
            } catch (error) {
                enqueueSnackbar(
                    `Nous ne pouvons pas afficher la fenêtre Shelly des prises connectées, veuillez autoriser les Pop-Ups dans les Paramètres du navigateur`,
                    { variant: 'error' },
                )
            }
        },
        [enqueueSnackbar],
    )

    /**
     * Open Shelly Connected Plugs Window handler.
     */
    const openShellyConnectedPlugsWindow = useCallback(
        async (onCloseShellyWindow?: () => void) => {
            if (!housingId) return
            setLoadingInProgress(true)
            try {
                const { data: responseData } = await axios.get<IShellyConnectedPlugLink>(
                    `${SHELLY_CONNECTED_PLUG_LINK_API}/${housingId}`,
                    {
                        cancelToken: source.current.token,
                    },
                )
                displayShellyWindow(responseData.url, onCloseShellyWindow)
            } catch (error) {
                if (isCancel(error)) return
                enqueueSnackbar(
                    formatMessage({
                        id: "Erreur lors de la connexion avec l'interface shelly des prises connectées",
                        defaultMessage: "Erreur lors de la connexion avec l'interface shelly des prises connectées",
                    }),
                    { variant: 'error' },
                )
            }
            setLoadingInProgress(false)
        },
        [formatMessage, enqueueSnackbar, displayShellyWindow, housingId, isCancel, source],
    )

    return {
        loadingInProgress,
        openShellyConnectedPlugsWindow,
    }
}
