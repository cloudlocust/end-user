import { BuilderUseElementList } from 'src/modules/utils/useElementHookBuilder'
import { axios, catchError } from 'src/common/react-platform-components'
import { useIntl, formatMessageType } from 'src/common/react-platform-translation'
import { useSnackbar } from 'notistack'
import { useParams } from 'react-router-dom'
import { IEcogeste, IEcogestGetAllFilter, EcogestViewedEnum } from 'src/modules/Ecogestes/components/ecogeste.d'
import { ECOGESTES_ENDPOINT } from 'src/modules/Ecogestes/EcogestesConfig'

// eslint-disable-next-line jsdoc/require-jsdoc
export const loadElementListError = (_error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: 'Erreur lors du chargement des ecogestes',
        defaultMessage: 'Erreur lors du chargement des ecogestes',
    })
}

// eslint-disable-next-line jsdoc/require-jsdoc
export const addElementSuccess = (_error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: "L'ecogeste a été ajouté",
        defaultMessage: "L'ecogeste a été ajouté",
    })
}

// eslint-disable-next-line jsdoc/require-jsdoc
export const addElementError = (_error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: "Erreur lors de l'ajout de l'ecogeste",
        defaultMessage: "Erreur lors de l'ajout de l'ecogeste",
    })
}

/**
 * Hook to get a list of ecogestes by category.
 *
 * @param queryParams Query parameters to add to useElementList.
 * @param sizeParam Number of items per page.
 * @returns A hook to get the ecogestes.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export const useEcogestes = (queryParams?: {}, sizeParam = 100) => {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()

    const { categoryId } = useParams</**
     * Params object.
     */
    {
        /**
         * The category id of the ecogestes. Use 0 for all.
         */
        categoryId: string
    }>()

    const parsedCategoryTargetted = categoryId ? parseInt(categoryId) : undefined

    /**
     * Generic patch-ing method for ecogest.
     *
     * @param ecogesteId ID of the ecogest to patch.
     * @param body Object that will be sent as patch body using axios.patch .
     */
    const updateEcogeste = async (ecogesteId: number, body: Partial<IEcogeste>) => {
        try {
            await axios.patch(`${ECOGESTES_ENDPOINT}/${ecogesteId}`, body)
        } catch (error) {
            enqueueSnackbar(
                formatMessage({
                    id: "Erreur lors de la modification de l'ecogeste",
                    defaultMessage: "Erreur lors de la modification de l'ecogeste",
                }),
                { variant: 'error' },
            )
            throw catchError(error)
        }
    }

    /**
     * Specific method that uses a patch to update an ecogest's view status.
     * Shortcut for patchEcogeste(ecogeste_id, { seenByCustomer: status }).
     *
     * @param ecogesteId ID of the ecogest to set view status of.
     * @param status The new view status of the ecogest. True is seen, False is not seen.
     */
    const setViewStatus = async (ecogesteId: number, status: boolean) => {
        await updateEcogeste(ecogesteId, { seenByCustomer: status })
    }

    const { elementList, loadingInProgress, updateFilters } = BuilderUseElementList<
        IEcogeste,
        IEcogeste,
        IEcogestGetAllFilter
    >({
        API_ENDPOINT: ECOGESTES_ENDPOINT,
        sizeParam,
        snackBarMessage0verride: { loadElementListError, addElementSuccess, addElementError },
    })(undefined, { viewed: EcogestViewedEnum.ALL, tag_id: parsedCategoryTargetted, ...queryParams })

    /**
     * Filters the ecogest element list from this hook according to the given filter.
     * Filtering is done server-side via a request to API.
     *
     * @param filter The filter object to apply.
     */

    return {
        elementList,
        loadingInProgress,
        setViewStatus,
        updateEcogeste,
        filterEcogestes: updateFilters,
    }
}

export default useEcogestes
