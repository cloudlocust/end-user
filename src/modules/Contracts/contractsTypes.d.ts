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
 * Type Tariff Components.
 */
export type ITariffComponents =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Id of tariff component.
         */
        id: number
        /**
         * Name tariff component.
         */
        name: string
        /**
         * Use meter off peak in tariff type.
         */
        useMeterOfffpeak: boolean
        /**
         * Use meter off peak in tariff type.
         */
        byweekday: string
        /**
         * Start time of tariff type.
         */
        startTime: string
        /**
         * End time of tariff type.
         */
        endTime: string
        /**
         * Deactivated At of tariff type.
         */
        deactivatedAt: string
    }

/**
 * Interface Contract model.
 */
export type IContract =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Id contract.
         */
        id: number
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
        tariffType: string
        /**
         * Information related to tariffType (for example, if tariffType is heure creuses, then tariffComponents will have heure début, heure fin).
         */
        tariffComponents?: ITariffComponents
        /**
         * Frequency enum.
         */
        freq?: frequencyenum
        /**
         * Power of the offer.
         */
        power: number
        /**
         * Start contract subscription.
         */
        startSubscription: string
        /**
         * End contract subscription.
         */
        endSubscription: string
    }
