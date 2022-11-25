import { useState } from 'react'
import { addMeterInputType, editMeterInputType } from 'src/modules/Meters/Meters'
import { axios } from 'src/common/react-platform-components'
import { API_RESOURCES_URL } from 'src/configs'
import { useIntl } from 'src/common/react-platform-translation'
import { useSnackbar } from 'notistack'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'

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
        } catch (error) {
            enqueueSnackbar(
                formatMessage({
                    id: EDIT_ERROR_MESSAGE,
                    defaultMessage: EDIT_ERROR_MESSAGE,
                }),
                { variant: 'error' },
            )
            setLoadingInProgress(false)
        }
    }

    return {
        addMeter,
        editMeter,
        loadingInProgress,
    }
}
