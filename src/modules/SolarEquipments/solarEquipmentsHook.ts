import { formatMessageType } from 'src/common/react-platform-translation'
import { API_RESOURCES_URL } from 'src/configs'
import { ISolarEquipment, solarEquipmentInputType } from 'src/modules/SolarEquipments/solarEquipments'
import { searchFilterType } from 'src/modules/utils'
import { BuilderUseElementDetails, BuilderUseElementList } from 'src/modules/utils/useElementHookBuilder'

/**
 * Equipment requests API.
 */
export const SOLAR_EQUIPMENTS_API = `${API_RESOURCES_URL}/solar-energy-equipments`

/**
 * Error message add contract.
 *
 * @param error Axios error object.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Error message.
 */
const addElementError = (error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: "Erreur lors de l'ajout d'un équipement",
        defaultMessage: "Erreur lors de l'ajout d'un équipement",
    })
}

/**
 * Success message addElement.
 *
 * @param responseData Added Contract.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Success message.
 */
const addElementSuccess = (responseData: ISolarEquipment, formatMessage: formatMessageType) => {
    return formatMessage({
        id: "Succès lors de l'ajout d'un équipement",
        defaultMessage: "Succès lors de l'ajout d'un équipement",
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
        id: 'Erreur lors du chargement des équipements',
        defaultMessage: 'Erreur lors du chargement des équipements',
    })
}

/**
 * Error message removeElementDetails.
 *
 * @param error Axios error object.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Error message.
 */
const removeElementDetailsError = (error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: "Erreur lors de la suppression de l'équipement",
        defaultMessage: "Erreur lors de la suppression de l'équipement",
    })
}

/**
 * Success message removeElementDetails.
 *
 * @param responseData Removed Installation Request.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Success message.
 */
const removeElementDetailsSuccess = (responseData: ISolarEquipment, formatMessage: formatMessageType) => {
    return formatMessage({
        id: "Succès lors de la suppression de l'équipement",
        defaultMessage: "Succès lors de la suppression de l'équipement",
    })
}

/**
 * Error message editElementDetailsError.
 *
 * @param responseData Edited Installation Request.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Success message.
 */
const editElementDetailsError = (responseData: ISolarEquipment, formatMessage: formatMessageType) => {
    return formatMessage({
        id: "Erreur lors de la modification de l'équipement",
        defaultMessage: "Erreur lors de la modification de l'équipement",
    })
}

/**
 * Success message editElementDetailsSuccess.
 *
 * @param responseData Edited Installation Request.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Success message.
 */
const editElementDetailsSuccess = (responseData: ISolarEquipment, formatMessage: formatMessageType) => {
    return formatMessage({
        id: "Succcès lors de la modification de l'équipement",
        defaultMessage: "Succès lors de la modification de l'équipement",
    })
}

/**
 * Hook to get installation requests list.
 *
 * @param sizeParam Indicates the default sizeParam for loadElementList.
 * @returns UseEquipmentRequestsList.
 */
export const useSolarEquipmentsList = (sizeParam?: number) =>
    BuilderUseElementList<ISolarEquipment, solarEquipmentInputType, searchFilterType>({
        API_ENDPOINT: SOLAR_EQUIPMENTS_API,
        sizeParam,
        snackBarMessage0verride: { loadElementListError, addElementSuccess, addElementError },
    })(true)

/**
 * Solar equipment hook for UPDATE / DELETE.
 *
 * @param solarEquipmentId InstallationRequest's id.
 * @returns Solar equipment hook funvtions & states.
 */
export const useSolarEquipmentsDetails = (solarEquipmentId: number) => {
    return BuilderUseElementDetails<ISolarEquipment, solarEquipmentInputType, ISolarEquipment>({
        API_ENDPOINT: `${SOLAR_EQUIPMENTS_API}/${solarEquipmentId}`,
        snackBarMessage0verride: {
            removeElementDetailsError,
            removeElementDetailsSuccess,
            editElementDetailsError,
            editElementDetailsSuccess,
        },
    })()
}
