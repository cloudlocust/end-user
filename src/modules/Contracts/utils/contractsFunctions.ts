import { cloneDeep } from 'lodash'
import {
    IContract,
    frequencyEnum,
    loadContractResponse,
    tariffContract,
    tariffContractUnits,
} from 'src/modules/Contracts/contractsTypes.d'

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
    switch (tariff.freq) {
        case frequencyEnum.MONTHLY:
            return '€/mois'
        case frequencyEnum.DAILY:
            return '€/kWh'
        default:
            throw Error('Wrong frequency')
    }
}

/**
 * Verify if dateString is a valid date.
 *
 * @param dateString Date in string type.
 * @returns Is it valid date ?.
 */
export const isValidDate = (dateString?: string): boolean => {
    if (!dateString) return false
    const date = new Date(dateString)
    return !isNaN(date.getTime())
}
