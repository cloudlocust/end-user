import { addContractDataType } from 'src/modules/Contracts/contractsTypes'

/**
 * Custom contract form props.
 */
export interface CustomContractFormProps {
    /**
     * Callback when submitting contract form.
     */
    onSubmit: (data: addContractDataType) => void
    /**
     * IsContractsLoading.
     */
    isContractsLoading: boolean
}
