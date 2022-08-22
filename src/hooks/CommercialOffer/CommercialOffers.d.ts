/**
 * Commercial Offer model.
 */
export type ICommercialOffer =
    //eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Provider List of commercial offer.
         */
        providers: IProvider[]
        /**
         * Commercial offer tariff types (example: Base, Heures plaines / Heures creuses...etc).
         */
        tariffType: ITariffType[]
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
         * Offers of provider.
         */
        offers: IOffer[]
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
