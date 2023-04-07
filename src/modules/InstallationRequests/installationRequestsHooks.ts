import { formatMessageType } from 'src/common/react-platform-translation'
import { API_RESOURCES_URL } from 'src/configs'
import {
    createInstallationRequestType,
    IInstallationRequest,
    updateInstallationRequestType,
} from 'src/modules/InstallationRequests/installationRequests.d'
import { searchFilterType } from 'src/modules/utils'
import { BuilderUseElementDetails, BuilderUseElementList } from 'src/modules/utils/useElementHookBuilder'

/**
 * Installation requests API.
 */
export const INSTALLATION_REQUESTS_API = `${API_RESOURCES_URL}/installation-requests`

/**
 * Error message add contract.
 *
 * @param _error Axios error object.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Error message.
 */
const addElementError = (_error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: "Erreur lors de l'ajout de la demande",
        defaultMessage: "Erreur lors de l'ajout de la demande",
    })
}

/**
 * Success message addElement.
 *
 * @param _responseData Added Contract.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Success message.
 */
const addElementSuccess = (_responseData: IInstallationRequest, formatMessage: formatMessageType) => {
    return formatMessage({
        id: "Succès lors de l'ajout de la demande",
        defaultMessage: "Succès lors de l'ajout de la demande",
    })
}

/**
 * Error message removeElementDetails.
 *
 * @param _error Axios error object.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Error message.
 */
const removeElementDetailsError = (_error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: 'Erreur lors de la suppression de la demande',
        defaultMessage: 'Erreur lors de la suppression de la demande',
    })
}

/**
 * Success message removeElementDetails.
 *
 * @param _responseData Removed Installation Request.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Success message.
 */
const removeElementDetailsSuccess = (_responseData: IInstallationRequest, formatMessage: formatMessageType) => {
    return formatMessage({
        id: 'Succès lors de la suppression de la demande',
        defaultMessage: 'Succès lors de la suppression de la demande',
    })
}

/**
 * Error message editElementDetailsError.
 *
 * @param _responseData Edited Installation Request.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Success message.
 */
const editElementDetailsError = (_responseData: IInstallationRequest, formatMessage: formatMessageType) => {
    return formatMessage({
        id: 'Erreur lors de la modification de la demande',
        defaultMessage: 'Erreur lors de la modification de la demande',
    })
}

/**
 * Success message editElementDetailsSuccess.
 *
 * @param _responseData Edited Installation Request.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Success message.
 */
const editElementDetailsSuccess = (_responseData: IInstallationRequest, formatMessage: formatMessageType) => {
    return formatMessage({
        id: 'Succcès lors de la modification de la demande',
        defaultMessage: 'Succès lors de la modification de la demande',
    })
}

/**
 * Error message loadElementListError.
 *
 * @param _error Error.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Success message.
 */
export const loadElementListError = (_error: any, formatMessage: formatMessageType) => {
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
    BuilderUseElementList<IInstallationRequest, createInstallationRequestType, searchFilterType>({
        API_ENDPOINT: INSTALLATION_REQUESTS_API,
        sizeParam,
        snackBarMessage0verride: { loadElementListError, addElementSuccess, addElementError },
    })(true)

/**
 * Installation requests hook for UPDATE / DELETE.
 *
 * @param installationRequestId InstallationRequest's id.
 * @returns Installation requests hook funvtions & states.
 */
export const useInstallationRequestDetails = (installationRequestId: number) => {
    return BuilderUseElementDetails<IInstallationRequest, updateInstallationRequestType, IInstallationRequest>({
        API_ENDPOINT: `${INSTALLATION_REQUESTS_API}/${installationRequestId}`,
        snackBarMessage0verride: {
            removeElementDetailsError,
            removeElementDetailsSuccess,
            editElementDetailsError,
            editElementDetailsSuccess,
        },
    })()
}
