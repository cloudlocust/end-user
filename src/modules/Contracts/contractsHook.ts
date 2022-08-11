import { searchFilterType } from 'src/modules/utils'
import { BuilderUseElementList } from 'src/modules/utils/useElementHookBuilder'
import { formatMessageType } from 'src/common/react-platform-translation'
import { IContract } from './contractsTypes'
import { useParams } from 'react-router-dom'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { contractsRouteParam } from 'src/modules/Contracts/contractsTypes.d'

/**
 * Contracts microservice endpoint.
 *
 * @param houseId HouseId of the contractList.
 * @returns Contract microservice Endpoint.
 */
export const CONTRACTS_API = (houseId: number) => `${HOUSING_API}/${houseId}/contracts`

/**
 * Error message fetch contracts request.
 *
 * @param error Axios error object.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Error message.
 */
const loadElementListError = (error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: 'Erreur lors du chargement des contrats',
        defaultMessage: 'Erreur lors du chargement des contrats',
    })
}

/**
`* Hooks for contractList.
 *
 * @param sizeParam Indicates the default size when loadElement.
 * @returns Hook useContractList.
 */
export const useContractList = (sizeParam?: number) => {
    // HouseId extracted from the url :houseId/contracts
    const { houseId } = useParams<contractsRouteParam>()

    return BuilderUseElementList<IContract, undefined, searchFilterType>({
        API_ENDPOINT: CONTRACTS_API(Number(houseId)),
        sizeParam,
        snackBarMessage0verride: { loadElementListError },
    })()
}
