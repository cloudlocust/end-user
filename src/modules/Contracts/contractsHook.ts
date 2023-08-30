import { searchFilterType } from 'src/modules/utils'
import { BuilderUseElementDetails, BuilderUseElementList } from 'src/modules/utils/useElementHookBuilder'
import { formatMessageType } from 'src/common/react-platform-translation'
import { addContractDataType, IContract, loadContractResponse } from './contractsTypes'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { formatLoadContractResponseToIContract } from 'src/modules/Contracts/utils/contractsFunctions'
import { AxiosError } from 'axios'

/**
 * Contracts microservice endpoint.
 *
 * @param houseId HouseId of the contractList.
 * @returns Contract microservice Endpoint.
 */
export const CONTRACTS_API = (houseId: number) => `${HOUSING_API}/${houseId}/housing_contracts`

/**
 * Error message fetch contracts request.
 *
 * @param _error Axios error object.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Error message.
 */
const loadContractListError = (_error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: 'Erreur lors du chargement des contrats',
        defaultMessage: 'Erreur lors du chargement des contrats',
    })
}

/**
 * Error message add contract.
 *
 * @param error Axios error object.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Error message.
 */
const addContractError = (error: AxiosError, formatMessage: formatMessageType) => {
    const errorAddContractMsg = error.response?.data.detail || "Erreur lors de l'ajout du contrat"
    return formatMessage({
        id: errorAddContractMsg,
        defaultMessage: errorAddContractMsg,
    })
}

/**
 * Success message add Contract.
 *
 * @param _responseData Added Contract.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Success message.
 */
const addContractSuccess = (_responseData: loadContractResponse, formatMessage: formatMessageType) => {
    return formatMessage({
        id: "Succès lors de l'ajout du contrat",
        defaultMessage: "Succès lors de l'ajout du contrat",
    })
}

/**
 * Error message editElementDetails.
 *
 * @param error Axios error object.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Error message.
 */
const editContractError = (error: AxiosError, formatMessage: formatMessageType) => {
    const erroreEitContractMsg = error.response?.data.detail || 'Erreur lors de la modification du contrat'
    return formatMessage({
        id: erroreEitContractMsg,
        defaultMessage: erroreEitContractMsg,
    })
}

/**
 * Success message editContract.
 *
 * @param _responseData Edit Contract.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Success message.
 */
const editContractSuccess = (_responseData: loadContractResponse, formatMessage: formatMessageType) => {
    return formatMessage({
        id: 'Succès lors de la modification du contrat',
        defaultMessage: 'Succès lors de la modification du contrat',
    })
}

/**
 * Error message removeContract.
 *
 * @param _error Axios error object.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Error message.
 */
const removeContractError = (_error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: 'Erreur lors de la suppression du contrat',
        defaultMessage: 'Erreur lors de la suppression du contrat',
    })
}

/**
 * Success message removeContract.
 *
 * @param _responseData Removed Contract.
 * @param formatMessage FormatMessage intl object from (react-intl package).
 * @returns {string} Success message.
 */
const removeContractSuccess = (_responseData: IContract, formatMessage: formatMessageType) => {
    return formatMessage({
        id: 'Succès lors de la suppression du contrat',
        defaultMessage: 'Succès lors de la suppression du contrat',
    })
}

/**
`* Hooks for contractList.
 *
 * @param houseId Indicates contract of current House.
 * @param sizeParam Indicates the default size when loadElement.
 * @param immediate Indicates if the called on instantiation or not.
 * @returns Hook useContractList.
 */
export const useContractList = (houseId: number, sizeParam?: number, immediate: boolean = true) => {
    const { elementList, ...restBuilderUseElementList } = BuilderUseElementList<
        loadContractResponse,
        addContractDataType,
        searchFilterType
    >({
        API_ENDPOINT: CONTRACTS_API(houseId),
        sizeParam,
        snackBarMessage0verride: {
            loadElementListError: loadContractListError,
            addElementError: addContractError,
            addElementSuccess: addContractSuccess,
        },
        immediate,
    })()

    return {
        elementList: elementList
            ? elementList.map((contract) => formatLoadContractResponseToIContract(contract))
            : null,
        ...restBuilderUseElementList,
    }
}

/**
`* Hooks for contractDetails.
 *
 * @param houseId Indicates contract of current House.
 * @param contractId Indicates current contractDetails guid.
 * @returns Hook useContractDetails.
 */
export const useContractDetails = (houseId: number, contractId: number) => {
    // eslint-disable-next-line jsdoc/require-jsdoc
    return BuilderUseElementDetails<loadContractResponse, addContractDataType, IContract>({
        API_ENDPOINT: `${CONTRACTS_API(houseId)}/${contractId}`,
        snackBarMessage0verride: {
            removeElementDetailsError: removeContractError,
            removeElementDetailsSuccess: removeContractSuccess,
            editElementDetailsError: editContractError,
            editElementDetailsSuccess: editContractSuccess,
        },
    })()
}
