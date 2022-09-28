import { useCallback, useState } from 'react'
import { axios } from 'src/common/react-platform-components'
import { formatMessageType, useIntl } from 'src/common/react-platform-translation'
import { API_RESOURCES_URL } from 'src/configs'
import {
    createInstallationRequestType,
    IInstallationRequest,
    updateInstallationRequestType,
} from 'src/modules/InstallationRequests/installationRequests.d'
import { searchFilterType } from 'src/modules/utils'
import { BuilderUseElementList } from 'src/modules/utils/useElementHookBuilder'
import { useSnackbar } from 'notistack'

/**
 * Installation requests API.
 */
export const INSTALLATION_REQUESTS_API = `${API_RESOURCES_URL}/installation-requests`

// eslint-disable-next-line jsdoc/require-jsdoc
export const loadElementListError = (error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: 'Erreur lors du chargement des demandes',
        defaultMessage: 'Erreur lors du chargement des demandes',
    })
}

/**
 * Hook to get installation requests list.
 *
 * @param sizeParam Indicates the default sizeParam for loadElementList.
 * @returns UseInstalltionRequestsList.
 */
export const useInstallationRequestsList = (sizeParam?: number) =>
    BuilderUseElementList<IInstallationRequest, undefined, searchFilterType>({
        API_ENDPOINT: INSTALLATION_REQUESTS_API,
        sizeParam,
        snackBarMessage0verride: { loadElementListError },
    })(true)

/**
 * Installation requests hook for CREATE / UPDATE / DELETE.
 *
 * @returns Installation requests hook funvtions & states.
 */
export const useInstallationRequests = () => {
    const { enqueueSnackbar } = useSnackbar()
    const [loadingInProgress, setLoadingInProgress] = useState(false)
    const { formatMessage } = useIntl()

    const createInstallationRequeest = useCallback(
        async (body: createInstallationRequestType) => {
            try {
                setLoadingInProgress(true)
                const { data } = await axios.post<createInstallationRequestType>(INSTALLATION_REQUESTS_API, body)
                if (data) {
                    enqueueSnackbar(
                        formatMessage({
                            id: 'Equipement créé avec succès',
                            defaultMessage: 'Equipement créé avec succès',
                        }),
                        { variant: 'success', autoHideDuration: 5000 },
                    )
                }
                setLoadingInProgress(false)
            } catch (error) {
                setLoadingInProgress(false)
                enqueueSnackbar(
                    formatMessage({
                        id: "Erreur lors de la création d'un équipement",
                        defaultMessage: "Erreur lors de la création d'un équipement",
                    }),
                    { variant: 'error', autoHideDuration: 5000 },
                )
            }
        },
        [enqueueSnackbar, formatMessage],
    )

    const updateInstallationRequest = useCallback(
        async (equipmentId: number, body: Omit<updateInstallationRequestType, 'id'>) => {
            try {
                setLoadingInProgress(true)
                const { data } = await axios.patch<Omit<updateInstallationRequestType, 'id'>>(
                    `${INSTALLATION_REQUESTS_API}/${equipmentId}`,
                    body,
                )
                if (data) {
                    enqueueSnackbar(
                        formatMessage({
                            id: 'Equipement a été mis à jour avec succès',
                            defaultMessage: 'Equipement a été mis à jour avec succès',
                        }),
                        { variant: 'success', autoHideDuration: 5000 },
                    )
                }
                setLoadingInProgress(false)
            } catch (error) {
                setLoadingInProgress(false)
                enqueueSnackbar(
                    formatMessage({
                        id: "Erreur lors de la mis à jour d'un équipement",
                        defaultMessage: "Erreur lors de la mis à jour d'un équipement",
                    }),
                    { variant: 'error', autoHideDuration: 5000 },
                )
            }
        },
        [enqueueSnackbar, formatMessage],
    )

    return { createInstallationRequeest, loadingInProgress, setLoadingInProgress, updateInstallationRequest }
}
