import { cloneDeep } from 'lodash'
import {
    IContract,
    loadContractResponse,
    tariffContract,
    tariffContractUnits,
} from 'src/modules/Contracts/contractsTypes'

/**
 * Function that formats the contract object from loadContract request, to a more handy format which is IContract (which consists to get out the provider from the offer, as provider is nested inside offer).
 *
 * @param contract Contract object that has format of loadContractResponse.
 * @returns Contract object with format IContract.
 */
export const formatLoadContractResponseToIContract = (contract: loadContractResponse): IContract => {
    const { contract: housingContractCopy, ...restHousingContractCopy } = cloneDeep(contract)
    const { provider, ...offer } = housingContractCopy.commercialOffer

    return {
        contractType: housingContractCopy.contractType,
        tariffType: housingContractCopy.tariffType,
        offer,
        provider,
        ...restHousingContractCopy,
    }
}

/**
 * Get the correct unit for tariff contract according to its label.
 *
 * @param tariff Tariff Contract.
 * @returns Unit of the tariffContract.
 */
export const getTariffContractUnit = (tariff: tariffContract): tariffContractUnits => {
    if (tariff.label === 'Abonnement') return '€/mois'
    return '€/kWh'
}
