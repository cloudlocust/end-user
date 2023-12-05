/**
 * Props of the MicrowaveMeasurement component.
 */
export interface MicrowaveMeasurementProps {
    /**
     * The global equipment id.
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
     * Modal closing handler.
     */
    onCloseMeasurementModal: () => void
    /**
     * Function for navigating to the equipment details page.
     */
    navigateToEquipmentDetailsPage: () => void
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
export interface MeasurementStatusApiResponse {
    /**
     * The status.
     */
    status: measurementStatusEnum
    /**
     * Time of the last update of status.
     */
    updatedAt?: string
    /**
     * Time of the creation of status.
     */
    createdAt?: string
}

/**
 * Type of the measurement status state.
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
     * The error message to show when the status is FAILED.
     */
    failureMessage?: string
}
