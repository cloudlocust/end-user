/**
 * Commercial Offer ContractType Model (Professional or Particulier).
 */
export interface IContractType {
    /**
     * Id of the contractType.
     */
    id: int
    /**
     * Name of the contractType.
     */
    name: str
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
    }

/**
 * Type of power.
 */
export type IPower = number
