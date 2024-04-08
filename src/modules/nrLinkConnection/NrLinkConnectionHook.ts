import { useCallback, useEffect, useRef, useState } from 'react'
import { axios } from 'src/common/react-platform-components'
import { GET_SHOW_NRLINK_POPUP_ENDPOINT } from 'src/modules/nrLinkConnection/NrLinkConnection'

/**
 * Hook to get ShowNrLink Popup.
 *
 * @returns Get ShowNrLink Popup request handler.
 */
export const useGetShowNrLinkPopupHook = () => {
    const initialMount = useRef(true)
    const [isNrLinkPopupShowing, setIsNrLinkPopupShowing] = useState<boolean | null>(null)
    const [isGetShowNrLinkLoading, setIsGetShowNrLinkLoading] = useState(false)

    /**
     * Get ShowNrLink Popup request handler.
     */
    const getShowNrLinkPopup = useCallback(async () => {
        setIsGetShowNrLinkLoading(true)
        try {
            // eslint-disable-next-line jsdoc/require-jsdoc
            const { data: responseData } = await axios.get<{ showNrlinkPopup: boolean }>(
                `${GET_SHOW_NRLINK_POPUP_ENDPOINT}`,
            )
            setIsNrLinkPopupShowing(responseData.showNrlinkPopup)
        } catch (error) {
            setIsNrLinkPopupShowing(false)
        } finally {
            setIsGetShowNrLinkLoading(false)
        }
    }, [])

    useEffect(() => {
        if (initialMount.current) {
            initialMount.current = false
            getShowNrLinkPopup()
        }
    }, [getShowNrLinkPopup])

    return { isGetShowNrLinkLoading, isNrLinkPopupShowing }
}
