import { SelectFieldProps } from 'src/common/ui-kit/form-fields/Select'
import { IOffer, IContractType, IPower, IProvider, ITariffType } from 'src/hooks/CommercialOffer/CommercialOffers'
import { Except } from 'type-fest'
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
        onSubmit: (data: addContractDataType) => void
        /**
         * Loading state when addContract request.
         */
        isContractsLoading?: boolean
    }

/**
 * ContractFieldFormProps.
 */
export type ContractFormFieldsProps =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Loading state when addContract request.
         */
        isContractsLoading?: boolean
    }

/**
 * Type of request response of load contract.
 */
export type loadContractResponse =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Id contract.
         */
        id: number
        /**
         * Offer of the contract.
         */
        // eslint-disable-next-line jsdoc/require-jsdoc
        offer: IOffer & {
            /**
             * Provider of the contract.
             */
            provider: IProvider
        }
        /**
         * Tariff Type of the contract.
         */
        tariffType: ITariffType
        /**
         * Contract Type (Professional, particulier ...etc).
         */
        contractType: IContractType
        /**
         * Power of the offer.
         */
        power: IPower
        /**
         * Start contract subscription.
         */
        startSubscription: string
        /**
         * End contract subscription.
         */
        endSubscription: string
    }

/**
 * Interface Contract that's formatted from response of request loadContract.
 * This format makes it easier to handle contractList and contractDetails.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type IContract = {
    /**
     * Provider of the contract.
     */
    provider: IProvider
    /**
     * Offer of the contract.
     */
    offer: IOffer
} & Except<loadContractResponse, 'offer'>

/**
 * Type contractFormValues.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type contractFormValuesType = addContractDataType & {
    /**
     * Provider Id.
     */
    providerId: number
}

/**
 * Add Contract Data type.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type addContractDataType = {
    /**
     * Offer of the contract.
     */
    offerId: number
    /**
     * Type of the contract.
     */
    tariffTypeId: number
    /**
     * ContractType Id.
     */
    contractTypeId: number
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

/**
 * Prop of ContractFormSelect, to load options and show the optionList in the select.
 */
export type ContractFormSelectProps<T> =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Name of the select.
         */
        name: string
        /**
         * Select Label.
         */
        selectLabel: string
        /**
         * Functions to load options, when the ContractFormSelect is mounted.
         */
        loadOptions: () => void
        /**
         * Boolean indicating the loading state of loadOptions.
         */
        isOptionsInProgress: Boolean
        /**
         * Option List.
         */
        optionList: T[] | null
        /**
         * Function to format the option value.
         */
        formatOptionValue: (option: T) => string | number
        /**
         * Function to format the option label.
         */
        formatOptionLabel: (option: T) => string
        /**
         * Validate functions passed in the Select.
         */
        validateFunctions?: SelectFieldProps['validateFunctions']
    }
