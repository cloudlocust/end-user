import { useState } from 'react'
import { searchFilterType } from 'src/modules/utils'
import { BuilderUseElementList } from 'src/modules/utils/useElementHookBuilder'
import { formatMessageType } from 'src/common/react-platform-translation'
import { addMeterInputType, IMeter } from 'src/modules/Meters/Meters'
import { axios, catchError } from 'src/common/react-platform-components'
import { API_RESOURCES_URL } from 'src/configs'
import { useIntl } from 'src/common/react-platform-translation'
import { useSnackbar } from 'notistack'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'

/**
 * Meters microservice endpoint.
 */
export const METERS_API = `${API_RESOURCES_URL}/meters`

/**
 * Success add message.
 */
export const ADD_ERROR_MESSAGE = "Erreur lors de l'ajout du compteur"

/**
 * Handle retured error from axios add client request, (Message handled From Custom IFG FormatError).
 *
 * @param error Axios error object.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Error message.
 */
const addElementError = (error: any, formatMessage: formatMessageType) => {
    const defaultRequestErrorMessage = formatMessage({
        id: ADD_ERROR_MESSAGE,
        defaultMessage: ADD_ERROR_MESSAGE,
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

/**
 * Handle meters for a housing in particular.
 *
 * @returns UseMeterForHousing hook.
 */
export const useMeterForHousing = () => {
    const [loadingInProgress, setLoadingInProgress] = useState(false)
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()

    // eslint-disable-next-line
    const addMeter = async ( housingId: number, body: addMeterInputType, reloadHousings: () => void ) => {
        setLoadingInProgress(true)
        try {
            const { data: responseData } = await axios.post(`${HOUSING_API}/${housingId}/meter`, body)

            enqueueSnackbar(
                formatMessage({
                    id: 'Compteur ajouté avec succès',
                    defaultMessage: 'Compteur ajouté avec succès',
                }),
                { variant: 'success' },
            )

            setLoadingInProgress(false)

            // if success reload housings before returning data.
            reloadHousings()

            return responseData
        } catch (error) {
            enqueueSnackbar(
                formatMessage({
                    id: ADD_ERROR_MESSAGE,
                    defaultMessage: ADD_ERROR_MESSAGE,
                }),
                { variant: 'error' },
            )

            setLoadingInProgress(false)
            throw catchError(error)
        }
    }

    return {
        addMeter,
        loadingInProgress,
    }
}
