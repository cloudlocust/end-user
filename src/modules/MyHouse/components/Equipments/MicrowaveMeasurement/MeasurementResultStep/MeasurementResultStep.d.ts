/**
 * Props of the MeasurementResultStep component.
 */
export interface MeasurementResultStepProps {
    /**
     * The selected microwave number.
     */
    microwaveNumber: number
    /**
     * The selected measurement mode.
     */
    measurementMode: string
    /**
     * The resut of the measurement process.
     */
    measurementResult: number | null | undefined
    /**
     * Boolean indicating whether we want to display an old result.
     */
    showingOldResult?: boolean
    /**
     * Function that closes the measurement modal and resets the states.
     */
    closeMeasurementModal: () => Promise<void>
    /**
     * Function for navigating to the equipment details page.
     */
    navigateToEquipmentDetailsPage?: () => void
    /**
     * The function that restart the measurement from the beginning.
     */
    restartMeasurementFromBeginning: (microwaveNumber?: number, measurementMode?: string) => Promise<void>
}
