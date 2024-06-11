import { useEffect } from 'react'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'

/**
 * Custom hook to check for user consent for Enphase when a housing meter is selected.
 * This hook sets up an event listener to detect changes in localStorage related to Enphase consent
 * and fetches the updated consent status when necessary.
 *
 * @param currentHousing The current housing selected by the user.
 * @param getConsents Function to fetch consents.
 */
const useEnphaseConsentChecker = (
    currentHousing: IHousing | null,
    getConsents: (houseId?: number) => Promise<void>,
) => {
    useEffect(() => {
        if (!currentHousing?.id) return

        getConsents(currentHousing?.id)

        /**
         * Callback that is called when the storage event is triggered.
         * It Check if the user has confirmed the consent in another tab, and if so, we fetch new consents.
         */
        const onStorage = () => {
            const enphaseConfirmConsentState = localStorage.getItem('enphaseConfirmState')
            if (enphaseConfirmConsentState === 'SUCCESS' && currentHousing?.id) {
                localStorage.removeItem('enphaseConfirmState')
                getConsents(currentHousing.id)
            }
        }

        /**
         * Listen to localStorage changes.
         */
        window.addEventListener('storage', onStorage)

        /**
         * Clear up function when the component unmounts.
         */
        return () => {
            window.removeEventListener('storage', onStorage)
        }
    }, [currentHousing?.id, getConsents])
}

export default useEnphaseConsentChecker
