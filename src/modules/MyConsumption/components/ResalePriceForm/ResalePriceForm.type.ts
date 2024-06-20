/**
 * Props types for the ResalePriceForm component.
 */
export interface ResalePriceFormProps {
    /**
     * Function to set the resale price value.
     */
    updateResalePriceValue: (price: number) => void
    /**
     * Function to set the resale contract possession to false.
     */
    setResaleContractPossessionToFalse: () => void
    /**
     * Boolean indicating weather the update of the resale price is in progress.
     */
    updateResalePriceInProgress: boolean
}
