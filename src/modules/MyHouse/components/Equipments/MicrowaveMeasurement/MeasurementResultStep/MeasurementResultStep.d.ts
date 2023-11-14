/**
 * Props of the MeasurementResultStep component.
 */
export interface MeasurementResultStepProps {
    /**
     * The selected measurement mode.
     */
    measurementMode: string
    /**
     * The resut of the measurement process.
     */
    measurementResult: number | null
    /**
     * Function that closes the measurement modal and resets the states.
     */
    closeMeasurementModal: () => Promise<void>
    /**
     * Function for navigating to the equipment details page.
     */
    navigateToEquipmentDetailsPage: () => void
}
