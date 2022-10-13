import { formatMessageType } from 'src/common/react-platform-translation'
import { API_RESOURCES_URL } from 'src/configs'
import { IInstallationRequest } from 'src/modules/InstallationRequests/installationRequests.d'
import { searchFilterType } from 'src/modules/utils'
import { BuilderUseElementList } from 'src/modules/utils/useElementHookBuilder'

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
