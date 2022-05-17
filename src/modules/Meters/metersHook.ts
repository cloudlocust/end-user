import { searchFilterType } from 'src/modules/utils'
import { BuilderUseElementList } from 'src/modules/utils/useElementHookBuilder'
import { formatMessageType } from 'src/common/react-platform-translation'
import { addMeterInputType, IMeter } from 'src/modules/Meters/Meters'
import { API_RESOURCES_URL } from 'src/configs'
/**
 * Meters microservice endpoint.
 */
export const METERS_API = `${API_RESOURCES_URL}/meters`

/**
 * Handle retured error from axios add client request, (Message handled From Custom IFG FormatError).
 *
 * @param error Axios error object.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Error message.
 */
const addElementError = (error: any, formatMessage: formatMessageType) => {
    const defaultRequestErrorMessage = formatMessage({
        id: "Erreur lors de l'ajout du compteur",
        defaultMessage: "Erreur lors de l'ajout du compteur",
    })
    if (error.response.status === 400) {
        if (error.response.data && error.response.data.detail)
            return formatMessage({
                id: error.response.data.detail,
                defaultMessage: error.response.data.detail,
            })
        return defaultRequestErrorMessage
    } else return defaultRequestErrorMessage
}

// eslint-disable-next-line jsdoc/require-jsdoc
const loadElementListError = (error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: 'Erreur lors du chargement des compteurs',
        defaultMessage: 'Erreur lors du chargement des compteurs',
    })
}

// eslint-disable-next-line jsdoc/require-jsdoc
const addElementSuccess = (responseData: IMeter, formatMessage: formatMessageType) => {
    return formatMessage({
        id: 'Succès lors de la configuration du compteur',
        defaultMessage: 'Succès lors de la configuration du compteur',
    })
}

/**
`* Hooks for meterList.
 *
 * @param sizeParam Indicates the default size when loadElement.
 * @returns UseMeterList Hook.
 */
export const useMeterList = (sizeParam?: number) =>
    BuilderUseElementList<IMeter, addMeterInputType, searchFilterType>({
        API_ENDPOINT: METERS_API,
        sizeParam,
        snackBarMessage0verride: { addElementSuccess, loadElementListError, addElementError },
    })()
