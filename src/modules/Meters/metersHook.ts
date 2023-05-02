import { useState } from 'react'
import { addMeterInputType, editMeterInputType, IMeter } from 'src/modules/Meters/Meters'
import { axios } from 'src/common/react-platform-components'
import { API_RESOURCES_URL } from 'src/configs'
import { useIntl } from 'src/common/react-platform-translation'
import { useSnackbar } from 'notistack'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { BuilderUseElementDetails } from 'src/modules/utils/useElementHookBuilder'
import { formatMessageType } from 'src/common/react-platform-translation'

/**
 * Meters microservice endpoint.
 */
export const METERS_API = `${API_RESOURCES_URL}/meters`

/**
 * Error add message.
 */
export const ADD_ERROR_MESSAGE = "Erreur lors de l'ajout du compteur"

/**
 * Error edit message.
 */
export const EDIT_ERROR_MESSAGE = 'Erreur lors de la modification du compteur'

/**
 * Edit success message.
 */
export const EDIT_SUCCESS_MESSAGE = 'Votre compteur à été modifier avec succées'

/**
 * Handle Meter error response message when editing a meter.
 *
 * @param error Error Response from edit meter request.
 * @returns Edit Meter Error Message.
 */
const handlMeterErrorResponse = (error: any) => {
    // Detail Error
    if (error.detail) return error.detail
    // Offpeak Error
    if (error.errors[0]?.features?.offpeak?.root) return error.errors[0]?.features?.offpeak?.root
    return EDIT_ERROR_MESSAGE
}

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
    const addMeter = async (housingId: number, body: addMeterInputType) => {
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
        }
    }

    /**
     * Function that edit meter.
     *
     * @param houseId Housing id.
     * @param body Attributes to update.
     * @returns PATCH response.
     */
    const editMeter = async (houseId: number, body: editMeterInputType) => {
        try {
            setLoadingInProgress(true)
            // eslint-disable-next-line jsdoc/require-jsdoc
            const { data: responseData } = await axios.patch<editMeterInputType>(
                `${HOUSING_API}/${houseId}/meter`,
                body,
            )
            setLoadingInProgress(false)
            if (responseData) {
                enqueueSnackbar(
                    formatMessage({
                        id: EDIT_SUCCESS_MESSAGE,
                        defaultMessage: EDIT_SUCCESS_MESSAGE,
                    }),
                    {
                        variant: 'success',
                        autoHideDuration: 5000,
                    },
                )

                return responseData
            }
        } catch (error: any) {
            const errorEditMeterMsg = error?.response?.data
                ? handlMeterErrorResponse(error?.response?.data)
                : EDIT_ERROR_MESSAGE
            enqueueSnackbar(
                formatMessage({
                    id: errorEditMeterMsg,
                    defaultMessage: errorEditMeterMsg,
                }),
                { variant: 'error' },
            )
            setLoadingInProgress(false)
            throw errorEditMeterMsg
        }
    }

    return {
        addMeter,
        editMeter,
        loadingInProgress,
    }
}

/**
 * Error message editElementDetailsError.
 *
 * @param _error Error.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Error message.
 */
export const editElementDetailsError = (_error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: EDIT_ERROR_MESSAGE,
        defaultMessage: EDIT_ERROR_MESSAGE,
    })
}

/**
 * Success message editElementDetailsSuccess.
 *
 * @param _responseData Edited Installation Request.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Success message.
 */
const editElementDetailsSuccess = (_responseData: IMeter, formatMessage: formatMessageType) => {
    return formatMessage({
        id: EDIT_SUCCESS_MESSAGE,
        defaultMessage: EDIT_SUCCESS_MESSAGE,
    })
}
/**
 * Error message loadElementDetailsError.
 *
 * @param _error Error.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Success message.
 */
export const loadElementDetailsError = (_error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: 'Erreur lors du chargement du compteur',
        defaultMessage: 'Erreur lors du chargement du compteur',
    })
}

/**
`* Hooks for Housing Meter Details.
 *
 * @param housingId Housing Id of the Housing.
 * @param loadOnInstanciation Indicate if load housingMeter is executed on instanciation of the hoook.
 * @returns Hook useHousingMeterDetails.
 */
export const useHousingMeterDetails = (housingId: number, loadOnInstanciation: boolean = false) =>
    // eslint-disable-next-line jsdoc/require-jsdoc
    BuilderUseElementDetails<IMeter, editMeterInputType, IMeter>({
        API_ENDPOINT: `${HOUSING_API}/${housingId}/meter`,
        isLoadElementDetailsOnHookInstanciation: loadOnInstanciation,
        snackBarMessage0verride: { loadElementDetailsError, editElementDetailsError, editElementDetailsSuccess },
    })()
