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
     * The measurement step to start from.
     */
    stepToStartFrom?: measurementStepsEnum
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
    navigateToEquipmentDetailsPage?: () => void
}

/**
 * Enum for the measurement steps.
 */
export enum measurementStepsEnum {
    /**
     * Infos page step.
     */
    INFOS_PAGE_STEP = 0,
    /**
     * Measurement configuration step.
     */
    CONFIGURATION_STEP = 1,
    /**
     * Measurement startup step.
     */
    STARTUP_STEP = 2,
    /**
     * Measurement process step.
     */
    PROCESS_STEP = 3,
    /**
     * Measurement result step.
     */
    RESULT_STEP = 4,
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
