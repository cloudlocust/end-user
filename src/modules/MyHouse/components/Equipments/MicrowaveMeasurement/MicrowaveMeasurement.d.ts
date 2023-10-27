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
 * Props of the TestStepPage component.
 */
export interface TestStepPageProps {
    /**
     * The state responsible for storing the current step.
     */
    step: number
    /**
     * The setter linked to the state step.
     */
    stepSetter: Dispatch<SetStateAction<number>>
}
