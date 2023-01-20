import { API_RESOURCES_URL } from 'src/configs'
import { searchFilterType } from '../utils'
import { BuilderUseElementList } from '../utils/useElementHookBuilder'
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
export const ECOGESTES_BY_CATEGORY = (categoryId: number) => `${ECOGESTES_ENDPOINT}/byCategory/${categoryId}`

/**
 * Hook to get a list of ecogestes by category.
 *
 * @param categoryId IDs of the categories.
 * @returns A hook to get the ecogestes.
 */
export const useEcogestesByCategory = (categoryId: number) =>
    BuilderUseElementList<IEcogeste, IEcogeste, searchFilterType>({
        API_ENDPOINT: ECOGESTES_BY_CATEGORY(categoryId),
    })()

export default useEcogestesByCategory
