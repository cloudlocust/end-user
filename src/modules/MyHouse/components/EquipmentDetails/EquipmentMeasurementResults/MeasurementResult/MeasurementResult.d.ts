/**
 * MeasurementResultProps.
 */
export interface MeasurementResultProps {
    /**
     * Function that open the measurement modal.
     */
    handleClickingOnMeasurementResult: () => void
    /**
     * The measurement result.
     */
    result: number | null
    /**
     * The measurement result is loading.
     */
    isLoading?: boolean
    /**
     * We are in the mobile view.
     */
    isMobileView?: boolean
}
