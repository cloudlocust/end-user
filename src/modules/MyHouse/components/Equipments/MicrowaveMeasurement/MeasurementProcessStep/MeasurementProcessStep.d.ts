import { Theme } from '@mui/material'
import { measurementStatusEnum } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgress.d'

/**
 * Props of the ResponseMessage component.
 */
export interface ResponseMessageProps {
    /**
     * The MUI Theme object.
     */
    theme: Theme
    /**
     * The title of the message.
     */
    title: string
    /**
     * The content of the message.
     */
    content: string
    /**
     * True if it's a success response.
     */
    success?: boolean
}

/**
 * Props of the MeasurementProcessStep component.
 */
export interface MeasurementProcessStepProps {
    /**
     * The measurementStatus state.
     */
    measurementStatus: measurementStatusEnum | null
    /**
     * The result value for the measurement.
     */
    measurementResult: number | null
    /**
     * Estimated value for the maximum duration of the measurement process (in seconds).
     */
    measurementMaxDuration: number
    /**
     * The function that start the measurement process.
     */
    startMeasurement: () => Promise<void>
    /**
     * The setter linked to the state responsible for storing the current step.
     */
    stepSetter: Dispatch<SetStateAction<number>>
}
