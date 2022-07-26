import { IHousing } from 'src/modules/MyHouse/components/HousingCard/housing.d'
import { BuilderUseElementList } from 'src/modules/utils/useElementHookBuilder'
import { formatMessageType } from 'src/common/react-platform-translation'
import { searchFilterType } from 'src/modules/utils'
import { API_RESOURCES_URL } from 'src/configs'

/**
 * Url for User management webservice endpoints.
 */
export const Housing_API = `${API_RESOURCES_URL}/housings`

// eslint-disable-next-line jsdoc/require-jsdoc
export const loadElementListError = (error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: 'Erreur lors du chargement des logements',
        defaultMessage: 'Erreur lors du chargement des logements',
    })
}

/**
`* Hooks for Housing List.
 *
 * @param sizeParam Indicates the default size when loadElement.
 * @returns UseHousingList Hook.
 */
export const useHousingList = (sizeParam?: number) =>
    BuilderUseElementList<IHousing, undefined, searchFilterType>({
        API_ENDPOINT: Housing_API,
        sizeParam,
        snackBarMessage0verride: { loadElementListError },
    })()
