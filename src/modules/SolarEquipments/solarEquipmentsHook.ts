import { formatMessageType } from 'src/common/react-platform-translation'
import { API_RESOURCES_URL } from 'src/configs'
import { createSolarEquipmentType, ISolarEquipment } from 'src/modules/SolarEquipments/solarEquipments'
import { searchFilterType } from 'src/modules/utils'
import { BuilderUseElementList } from 'src/modules/utils/useElementHookBuilder'

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
 * Hook to get installation requests list.
 *
 * @param sizeParam Indicates the default sizeParam for loadElementList.
 * @returns UseEquipmentRequestsList.
 */
export const useSolarEquipmentsList = (sizeParam?: number) =>
    BuilderUseElementList<ISolarEquipment, createSolarEquipmentType, searchFilterType>({
        API_ENDPOINT: SOLAR_EQUIPMENTS_API,
        sizeParam,
        snackBarMessage0verride: { loadElementListError, addElementSuccess, addElementError },
    })(true)
