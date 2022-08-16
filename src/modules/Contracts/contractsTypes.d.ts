/**
 * Type contracts route param.
 */
export type contractsRouteParam =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * House id.
         */
        houseId: string
        /**
         * Contracts Id.
         */
        id: string
    }

/**
 * ContractCardProps.
 */
export type ContractCardProps =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Contract information object.
         */
        contract: IContract
        /**
         * Callback after delete or update success contract.
         */
        onAfterDeleteUpdateSuccess?: () => void
    }
/**
 * Interface Contract model.
 */
export interface IContract {
    /**
     * Guid contract.
     */
    guid: string
    /**
     * Provider of the contract.
     */
    provider: string
    /**
     * Offer of the contract.
     */
    offer: string
    /**
     * Type of the contract.
     */
    type: string
    /**
     * Power of the offer.
     */
    power: string
}
