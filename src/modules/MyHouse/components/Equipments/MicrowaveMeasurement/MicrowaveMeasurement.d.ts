/**
 * Props of the MicrowaveMeasurement component.
 */
export interface MicrowaveMeasurementProps {
    /**
     * The number of microwaves.
     */
    equipmentsNumber: number
    /**
     * The state of the modal.
     */
    isModelOpen: boolean
    /**
     * Modal closing handler.
     */
    onCloseModel: () => void
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
