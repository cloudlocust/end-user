import { useEffect, useRef } from 'react'
import { BuilderUseElementList } from 'src/modules/utils/useElementHookBuilder'
import { IEcogestCategory } from 'src/modules/Ecogestes/components/ecogeste'
import { formatMessageType } from 'src/common/react-platform-translation'
import { ECOGESTES_ENDPOINT, IEcogesteCategoryTypes } from 'src/modules/Ecogestes/EcogestesConfig'
import { orderListBy } from 'src/modules/utils'

// eslint-disable-next-line jsdoc/require-jsdoc
export const loadElementListError = (_error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: "Erreur lors du chargement des catégories d'écogeste",
        defaultMessage: "Erreur lors du chargement des catégories d'écogeste",
    })
}

/**.
 * Hook, to fetch all Categories belonging to a Category Type (Consumptions Poles, Rooms, ...)
 *
 * @param categoryType Type of Category.
 * @param getJustVisualisedEcogests Indicates whether to get just visualised ecogests.
 * @returns IEcogestCategory[] | undefined
 */
export const useEcogestesCategories = (categoryType: IEcogesteCategoryTypes, getJustVisualisedEcogests?: boolean) => {
    const isInitialRender = useRef(true)
    const { elementList, loadingInProgress, updateFilters } = BuilderUseElementList<
        IEcogestCategory,
        IEcogestCategory,
        /**
         * Filter type.
         */
        {
            /**
             * Indicates whether to get just visualised ecogests.
             */
            getJustVisualisedEcogests: boolean | undefined
        }
    >({
        API_ENDPOINT: `${ECOGESTES_ENDPOINT}/${categoryType}`,
        sizeParam: 100,
        snackBarMessage0verride: { loadElementListError },
    })(undefined, { getJustVisualisedEcogests })

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false
        } else {
            updateFilters({ getJustVisualisedEcogests })
        }
    }, [getJustVisualisedEcogests, updateFilters])

    return {
        elementList: orderListBy(elementList ?? [], (item) => item.name),
        loadingInProgress,
    }
}

export default useEcogestesCategories
