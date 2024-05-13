import { useCurrentHousing } from 'src/hooks/CurrentHousing'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { useState } from 'react'

/**
 * Custom hook to manage solar production linking functionality.
 * It provides functions to handle the opening and closing of Enphase and connected plug production consent popups.
 *
 * @returns Object containing the Enphase link, popup states, and popup handler functions.
 */
export const useSolarProductionLinking = () => {
    const currentHousing = useCurrentHousing()
    const { enphaseLink, getEnphaseLink } = useConsents()

    const [isEnphaseConsentPopupOpen, setIsEnphaseConsentPopupOpen] = useState(false)
    const [isConnectedPlugProductionConsentPopupOpen, setIsConnectedPlugProductionConsentPopupOpen] = useState(false)

    /**
     * Function that handle opening of enphase popup.
     */
    const handleOnOpenEnphaseConsentPopup = () => {
        currentHousing && getEnphaseLink(currentHousing.id)
        setIsEnphaseConsentPopupOpen(true)
    }

    /**
     * Function that handle opening of connected plugs popup.
     */
    const handleOnOpenConnectedPlugConsentPopup = () => {
        setIsConnectedPlugProductionConsentPopupOpen(true)
    }

    /**
     * Function that handle closing of enphase popup.
     */
    const handleOnCloseEnphaseConsentPopup = () => {
        setIsEnphaseConsentPopupOpen(false)
    }

    /**
     * Function that handle closing of connected plugs popup.
     */
    const handleOnCloseConnectedPlugConsentPopup = () => {
        setIsConnectedPlugProductionConsentPopupOpen(false)
    }

    return {
        enphaseLink,
        isEnphaseConsentPopupOpen,
        isConnectedPlugProductionConsentPopupOpen,
        handleOnOpenEnphaseConsentPopup,
        handleOnOpenConnectedPlugConsentPopup,
        handleOnCloseEnphaseConsentPopup,
        handleOnCloseConnectedPlugConsentPopup,
    }
}
