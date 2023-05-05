import { BuilderUseElementList } from 'src/modules/utils/useElementHookBuilder'
import { IEcogestCategory } from 'src/modules/Ecogestes/components/ecogeste'
import { formatMessageType } from 'src/common/react-platform-translation'
import { ECOGESTES_ENDPOINT, IEcogesteCategoryTypes } from 'src/modules/Ecogestes/EcogestesConfig'

// eslint-disable-next-line jsdoc/require-jsdoc
export const loadElementListError = (_error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: 'Erreur lors du chargement des Pièces',
        defaultMessage: 'Erreur lors du chargement des Pièces',
    })
}

/**.
 * Hook, to fetch all Categories belonging to a Category Type (Consumptions Poles, Rooms, ...)
 *
 * @param categoryType Type of Category.
 * @returns IEcogestCategory[] | undefined
 */
export const useEcogestesCategories = (categoryType: IEcogesteCategoryTypes) => {
    const { elementList, loadingInProgress } = BuilderUseElementList<IEcogestCategory, IEcogestCategory, undefined>({
        API_ENDPOINT: `${ECOGESTES_ENDPOINT}/${categoryType}`,
        snackBarMessage0verride: { loadElementListError },
    })(undefined, {})

    return {
        elementList,
        loadingInProgress,
    }
}

export default useEcogestesCategories
