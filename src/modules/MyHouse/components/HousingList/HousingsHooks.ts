import { defaultValueType } from 'src/common/ui-kit/form-fields/GoogleMapsAddressAutoComplete/utils'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing.d'
import { BuilderUseElementList } from 'src/modules/utils/useElementHookBuilder'
import { formatMessageType } from 'src/common/react-platform-translation'
import { searchFilterType } from 'src/modules/utils'
import { API_RESOURCES_URL } from 'src/configs'
import { useIntl } from 'src/common/react-platform-translation'
import { useToggle } from 'react-use'
import { axios, catchError } from 'src/common/react-platform-components'
import { useSnackbar } from 'notistack'

/**
 * Url for User management webservice endpoints.
 */
export const HOUSING_API = `${API_RESOURCES_URL}/housings`

// eslint-disable-next-line jsdoc/require-jsdoc
export const loadElementListError = (error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: 'Erreur lors du chargement des logements',
        defaultMessage: 'Erreur lors du chargement des logements',
    })
}

// eslint-disable-next-line jsdoc/require-jsdoc
export const addElementSuccess = (error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: 'Le logement a été ajouté',
        defaultMessage: 'Le logement a été ajouté',
    })
}

// eslint-disable-next-line jsdoc/require-jsdoc
export const addElementError = (error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: "Erreur lors de l'ajout du logement",
        defaultMessage: "Erreur lors de l'ajout du logement",
    })
}

/**
`* Hooks for Housing List.
 *
 * @param sizeParam Indicates the default size when loadElement.
 * @returns UseHousingList Hook.
 */
export const useHousingList = (sizeParam?: number) =>
    BuilderUseElementList<IHousing, defaultValueType, searchFilterType>({
        API_ENDPOINT: HOUSING_API,
        sizeParam,
        snackBarMessage0verride: { loadElementListError, addElementSuccess, addElementError },
    })()

/**
 * Hook for Housings.
 *
 * @returns UseHousings hook.
 */
export const useHousingsDetails = () => {
    const [loadingRequest, setLoadingRequest] = useToggle(false)
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()

    /**
     * Remove Element Housing Handler.
     *
     * @param HousingId Housing Id of the Housing.
     * @returns The function returns a string message containing successful and errors message.
     */
    const removeHousing = async (HousingId: number) => {
        setLoadingRequest(true)
        try {
            await axios.delete<IHousing>(`${HOUSING_API}/${HousingId}`)
            enqueueSnackbar(
                formatMessage({
                    id: 'Le logement a été supprimé',
                    defaultMessage: 'Le logement a été supprimé',
                }),
                { variant: 'success' },
            )
            setLoadingRequest(false)
        } catch (error) {
            enqueueSnackbar(
                formatMessage({
                    id: 'Erreur lors de la Suppression du logement',
                    defaultMessage: 'Erreur lors de la Suppression du logement',
                }),
                { variant: 'error' },
            )
            setLoadingRequest(false)
            throw catchError(error)
        }
    }

    return {
        loadingRequest,
        removeHousing,
    }
}
