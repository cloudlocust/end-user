import { formatMessageType } from 'src/common/react-platform-translation'
import { API_RESOURCES_URL } from 'src/configs'
import { createEquipmentRequestType, IEquipmentRequest } from 'src/modules/EquipmentRequests/equipmentRequests'
import { searchFilterType } from 'src/modules/utils'
import { BuilderUseElementList } from 'src/modules/utils/useElementHookBuilder'

/**
 * Equipment requests API.
 */
export const EQUIPMENTS_REQUESTS_API = `${API_RESOURCES_URL}/solar-energy-equipments`

/**
 * Error message add contract.
 *
 * @param error Axios error object.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Error message.
 */
const addElementError = (error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: "Erreur lors de l'ajout de la demande",
        defaultMessage: "Erreur lors de l'ajout de la demande",
    })
}

/**
 * Success message addElement.
 *
 * @param responseData Added Contract.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Success message.
 */
const addElementSuccess = (responseData: IEquipmentRequest, formatMessage: formatMessageType) => {
    return formatMessage({
        id: "Succès lors de l'ajout de la demande",
        defaultMessage: "Succès lors de l'ajout de la demande",
    })
}

/**
 * Error message loadElementListError.
 *
 * @param error Error.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Success message.
 */
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
 * @returns UseEquipmentRequestsList.
 */
export const useEquipmentRequestsList = (sizeParam?: number) =>
    BuilderUseElementList<IEquipmentRequest, createEquipmentRequestType, searchFilterType>({
        API_ENDPOINT: EQUIPMENTS_REQUESTS_API,
        sizeParam,
        snackBarMessage0verride: { loadElementListError, addElementSuccess, addElementError },
    })(true)
