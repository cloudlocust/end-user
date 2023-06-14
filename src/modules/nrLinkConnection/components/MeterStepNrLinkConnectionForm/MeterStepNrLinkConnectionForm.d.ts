import { IMeter } from 'src/modules/Meters/Meters'

/**
 * MeterStepNrLinkConnectionForm Props.
 */
export interface MeterStepNrLinkConnectionFormProps {
    /**
     * Callback when we pass to the previous step.
     */
    handleBack: () => void
    /**
     * Callback when we pass to the next step.
     */
    handleNext: () => void
    /**
     * Sets the state for the meter, which represents an instance of IMeter or null.
     */
    setMeter: React.Dispatch<React.SetStateAction<IMeter | null>>
    /**
     * Meter.
     */
    meter: IMeter | null
    /**
     * Housing id.
     */
    housingId: number | undefined
}
