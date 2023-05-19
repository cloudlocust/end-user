import { useIntl } from 'src/common/react-platform-translation'
import { useState } from 'react'
import { IReplaceNRLinkPayload } from 'src/modules/MyHouse/components/ReplaceNRLinkFormPopup/replaceNrLinkFormPopup'

import { useSnackbar } from 'notistack'
import { axios, catchError } from 'src/common/react-platform-components'
import { NRLINK_CONSENT_API } from 'src/modules/Consents/consentsHook'

/**
 * Hook to Replace NRLink inside a House.
 *
 * @param houseId Id of the house, where we need to replace the nrLINK.
 * @returns .
 */
export const useReplaceNRLinkHook = (houseId: string) => {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()

    const [loadingInProgress, setLoadingStatus] = useState<boolean>(false)

    /**
     * Replace current nrLINK inside the house by another nrLINK.
     *
     * @param body Request body.
     */
    const replaceNRLink = async (body: IReplaceNRLinkPayload) => {
        setLoadingStatus(true)
        try {
            await axios.patch(`${NRLINK_CONSENT_API}/${houseId}`, body)

            enqueueSnackbar(
                formatMessage({
                    id: 'nrLINK modifié avec succès',
                    defaultMessage: 'nrLINK modifié avec succès',
                }),
                { variant: 'success' },
            )
        } catch (error) {
            enqueueSnackbar(
                formatMessage({
                    id: 'Erreur lors de la modification de votre nrLINK',
                    defaultMessage: 'Erreur lors de la modification de votre nrLINK',
                }),
                { variant: 'error' },
            )
            throw catchError(error)
        } finally {
            setLoadingStatus(false)
        }
    }

    return {
        loadingInProgress,
        replaceNRLink,
    }
}
