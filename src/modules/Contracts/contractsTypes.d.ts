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
 * ContractFormProps.
 */
export type ContractFormProps =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Callback when submitting contract form.
         */
        onSubmit: (input: IContract) => void
        /**
         * Loading state when submitting form.
         */
        isContractsLoading?: boolean
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
