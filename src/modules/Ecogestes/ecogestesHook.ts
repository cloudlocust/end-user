import { formatMessageType } from 'src/common/react-platform-translation'
import { API_RESOURCES_URL } from 'src/configs'
import { searchFilterType } from 'src/modules/utils'
import { BuilderUseElementList } from 'src/modules/utils/useElementHookBuilder'
import { IEcogeste } from './components/ecogeste'

/**
 * Ecogestes API  global endpoint.
 */
export const ECOGESTES_ENDPOINT = `${API_RESOURCES_URL}/ecogestes`

/**
 * Return a URL to query encogestes by category.
 *
 * @param categoryId The id of the category.
 * @returns A URL.
 */
export const ECOGESTES_BY_CATEGORY = (categoryId: number) => `${ECOGESTES_ENDPOINT}/by-category/${categoryId}`

// eslint-disable-next-line jsdoc/require-jsdoc
export const loadElementListError = (error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: 'Erreur lors du chargement des ecogestes',
        defaultMessage: 'Erreur lors du chargement des ecogestes',
    })
}

// eslint-disable-next-line jsdoc/require-jsdoc
export const addElementSuccess = (error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: "L'ecogeste a été ajouté",
        defaultMessage: "L'ecogeste a été ajouté",
    })
}

// eslint-disable-next-line jsdoc/require-jsdoc
export const addElementError = (error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: "Erreur lors de l'ajout de l'ecogeste",
        defaultMessage: "Erreur lors de l'ajout de l'ecogeste",
    })
}

/**
 * Hook to get a list of ecogestes by category.
 *
 * @param categoryId IDs of the categories.
 * @returns A hook to get the ecogestes.
 */
export const useEcogestesByCategory = (categoryId: number) =>
    BuilderUseElementList<IEcogeste, IEcogeste, searchFilterType>({
        API_ENDPOINT: ECOGESTES_BY_CATEGORY(categoryId),
        snackBarMessage0verride: { loadElementListError, addElementSuccess, addElementError },
    })()

export default useEcogestesByCategory
