import { SelectFieldProps } from 'src/common/ui-kit/form-fields/Select'
import { IOffer, IContractType, IPower, IProvider, ITariffType } from 'src/hooks/CommercialOffer/CommercialOffers'
import { TypographyProps } from '@mui/material/Typography'
import { IMeterFeatures } from 'src/modules/Meters/Meters'

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
        /**
         * Default values  request.
         */
        defaultValues?: contractFormValuesType
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
        /**
         * Indicate if ContractFormFIelds are disabled.
         */
        disabled?: boolean
    }

/**
 * Type of request response of load contract.
 */
export type loadContractResponse =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Id Housing contract.
         */
        id: number
        /**
         * Contract.
         */
        // eslint-disable-next-line jsdoc/require-jsdoc
        contract: {
            /**
             * Id contract.
             */
            id: number
            /**
             * Offer of the contract.
             */
            // eslint-disable-next-line jsdoc/require-jsdoc
            commercialOffer: IOffer & {
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
        }

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
     * Id contract.
     */
    id: number
    /**
     * Provider of the contract.
     */
    provider: IProvider
    /**
     * Offer of the contract.
     */
    offer: IOffer
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
    power: number
    /**
     * Start contract subscription (ISO datetime format).
     */
    startSubscription: string
    /**
     * End contract subscription (ISO datetime format).
     */
    endSubscription: string
}

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
     * Meter Features information (offpeakHours ...etc).
     */
    meterFeatures?: IMeterFeatures
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
    endSubscription?: string
}

/**
 * Prop of ContractFormSelect, to load options and show the optionList in the select.
 */
export interface ContractFormSelectProps<T> extends SelectFieldProps {
    // eslint-disable-next-line jsdoc/require-jsdoc
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
     * Label for additional "other" option, that can be options for some contract form fields.
     */
    otherOptionLabel?: string
}

/**
 * Props Type of OffPeakHoursField Component.
 */
export interface offpeakHoursFieldProps {
    /**
     * List of validators.
     */
    validateFunctions?: ((data: any) => CustomValidateResult)[]
    /**
     * Override the default name of material ui to make it required.
     */
    name: string
    /**
     * Override the default label of material ui to make it required.
     */
    label: string
    /**
     * We use inputLabelProps for pass the some props to label of offpeakHoursField,
     * and we remove children from the props because.
     */
    labelProps?: TypographyProps
}

/**
 * Message when selecting "other" provider and offer option.
 */
export type OtherProviderOfferOptionMessageProps =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Indicates if message should be shown.
         */
        isShowMessage: Boolean
    }
