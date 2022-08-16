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
