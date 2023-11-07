/**
 * Props of the MeasurementStartupStep component.
 */
export interface MeasurementStartupStepProps {
    /**
     * The mode of the measurement test.
     */
    measurementMode: string
    /**
     * The setter linked to the state responsible for storing the current step.
     */
    stepSetter: Dispatch<SetStateAction<number>>
}
