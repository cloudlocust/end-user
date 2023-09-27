import { useIntl } from 'src/common/react-platform-translation'
import { useState } from 'react'
import { useSnackbar } from 'notistack'
import { axios, catchError } from 'src/common/react-platform-components'
import { NRLINK_CONSENT_API } from 'src/modules/Consents/consentsHook'

/**
 * Hook to Delete the NRLink Consent of a specific House.
 *
 * @param houseId Id of the house for which we are going to remove the nrLINK consent.
 * @returns .
 */
export const useDeleteNRLinkConsentHook = (houseId?: number) => {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const [loadingInProgress, setLoadingStatus] = useState(false)

    /**
     * Delete the current nrLINK Consent for the house.
     */
    const deleteNRLinkConsent = async () => {
        if (!houseId) return
        setLoadingStatus(true)
        try {
            await axios.delete(`${NRLINK_CONSENT_API}/${houseId}`)
            enqueueSnackbar(
                formatMessage({
                    id: 'Consentement nrLINK supprimé avec succès',
                    defaultMessage: 'Consentement nrLINK supprimé avec succès',
                }),
                { variant: 'success' },
            )
        } catch (error: any) {
            if (error?.response?.data?.detail) {
                enqueueSnackbar(error.response.data.detail, { variant: 'error' })
            } else {
                enqueueSnackbar(
                    formatMessage({
                        id: 'Erreur lors de la suppression de votre Consentement nrLINK',
                        defaultMessage: 'Erreur lors de la suppression de votre Consentement nrLINK',
                    }),
                    { variant: 'error' },
                )
            }
            throw catchError(error)
        } finally {
            setLoadingStatus(false)
        }
    }

    return {
        loadingInProgress,
        deleteNRLinkConsent,
    }
}
