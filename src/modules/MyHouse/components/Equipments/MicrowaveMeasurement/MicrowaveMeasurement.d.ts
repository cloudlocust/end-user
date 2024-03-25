/**
 * Props of the MicrowaveMeasurement component.
 */
export interface MicrowaveMeasurementProps {
    /**
     * The housing equipment id.
     */
    housingEquipmentId: number
    /**
     * The number of microwaves.
     */
    equipmentsNumber: number
    /**
     * Measurement modes for the Equipment.
     */
    measurementModes: string[]
    /**
     * The state of the modal.
     */
    isMeasurementModalOpen: boolean
    /**
     * Boolean indicating whether we want to display an old result.
     */
    showingOldResult?: boolean
    /**
     * Boolean indicating whether we start the measurement from the EquipmentsDetails Page.
     */
    startMeasurementFromEquipmentsDetailsPage?: boolean
    /**
     *  Function that update the measurement results in the equipment details page.
     */
    updateEquipmentMeasurementResults?: () => void
    /**
     * Default value for the microwave number.
     */
    defaultMicrowaveNumber?: number | null
    /**
     * Default value for the measurement mode.
     */
    defaultMeasurementMode?: string
    /**
     * Default value for the measurement result.
     */
    defaultMeasurementResult?: number | null
    /**
     * Modal closing handler.
     */
    onCloseMeasurementModal: () => void
    /**
     * Function for navigating to the equipment details page.
     */
    navigateToEquipmentMeasurementsPage?: () => void
}

/**
 * Format of measurement result Api responce.
 */
export interface MeasurementResultApiResponse {
    /**
     * The result value.
     */
    value: number
}

/**
 * Format of measurement status Api response.
 */
export interface MeasurementStatusStateType {
    /**
     * The measurement status.
     */
    status: measurementStatusEnum
    /**
     * The time of the last update of the measurement status.
     */
    updatedAt?: string
    /**
     * The time of the creation of the measurement status.
     */
    createdAt?: string
    /**
     * The error message to show when the status is FAILED.
     */
    failureReason?: string
}
