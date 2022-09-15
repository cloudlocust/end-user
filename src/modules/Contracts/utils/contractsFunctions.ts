import { cloneDeep } from 'lodash'
import { IContract, loadContractResponse } from 'src/modules/Contracts/contractsTypes'

/**
 * Function that formats the contract object from loadContract request, to a more handy format which is IContract (which consists to get out the provider from the offer, as provider is nested inside offer).
 *
 * @param contract Contract object that has format of loadContractResponse.
 * @returns Contract object with format IContract.
 */
export const formatLoadContractResponseToIContract = (contract: loadContractResponse) => {
    const contractCopy = cloneDeep(contract)
    const { provider, ...offer } = contractCopy.offer
    return {
        ...contractCopy,
        offer,
        provider,
    } as IContract
}
