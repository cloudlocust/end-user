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
 * Freq type.
 */
export type frequencyType = 'YEARLY' | 'MONTHLY' | 'WEEKLY' | 'DAILY' | 'HOURLY' | 'MINUTELY' | 'SECONDLY'

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
        useMeterOfffpeak?: boolean
        /**
         * By Week day tariff component.
         */
        byweekday?: string[]
        /**
         * Start time of tariff type.
         */
        startTime?: string
        /**
         * Frequency tariff component.
         */
        freq?: frequencyType
        /**
         * End time of tariff type.
         */
        endTime?: string
        /**
         * Deactivated At of tariff type.
         */
        deactivatedAt?: string
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
