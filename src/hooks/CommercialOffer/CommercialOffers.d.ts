/**
 * Commercial Offer ContractType Model (Professional or Particulier).
 */
export interface IContractType {
    /**
     * Id of the contractType.
     */
    id: number
    /**
     * Name of the contractType.
     */
    name: string
}
/**
 * Provider model.
 */
export type IProvider =
    //eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Id of provider.
         */
        id: number
        /**
         * Name of provider.
         */
        name: string
        /**
         * Network identifier.
         */
        networkIdentifier?: number | null
    }

/**
 * Offer of provider model.
 */
export type IOffer =
    //eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Id of offer.
         */
        id: number
        /**
         * Name of offer.
         */
        name: string
        /**
         * Whether the offer is deprecated or not.
         */
        isDeprecated?: boolean
        /**
         * Network identifier.
         */
        networkIdentifier?: number | null
    }

/**
 * Commercial offer tariff type model.
 */
export type ITariffType =
    //eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Id of tariff type.
         */
        id: number
        /**
         * Name of tariff type.
         */
        name: string
        /**
         * Network identifier.
         */
        networkIdentifier?: number | null
    }

/**
 * Type of power.
 */
export type IPower = number

/**
 * Commercial offer model.
 */
//eslint-disable-next-line jsdoc/require-jsdoc
export type ICreateCustomProvider = {
    /**
     * Name of the provider.
     */
    name: string
    /**
     * Id of the housing.
     */
    networkIdentifier: number
}

/**
 * Create  Custom offer type.
 */
export type ICreateCustomOffer =
    /**
     *
     */
    {
        /**
         * Name of the offer.
         */
        name: string
        /**
         * Id of the provider.
         */
        providerId: number
        /**
         * Network identifier.
         */
        networkIdentifier: number
    }

/**
 * Create custom tariff type.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type ICreateCustomTariffType = {
    /**
     * Name of the tariff type.
     */
    name: string
    /**
     * Id of the offer.
     */
    offerId: number
    /**
     * Network identifier.
     */
    networkIdentifier: number
}
