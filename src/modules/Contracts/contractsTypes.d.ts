import { SelectFieldProps } from 'src/common/ui-kit/form-fields/Select'
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

/**
 * Type contractFormValues.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type contractFormValuesType = Except<IContract, 'id'> & {
    /**
     * ContractType.
     */
    contractType: string
}

/**
 * Add Contract Data type.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type addContractDataType = Except<contractFormValuesType, 'provider'>

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
        formatOptionValue: (option: T) => string
        /**
         * Function to format the option label.
         */
        formatOptionLabel: (option: T) => string
        /**
         * Validate functions passed in the Select.
         */
        validateFunctions?: SelectFieldProps['validateFunctions']
    }
