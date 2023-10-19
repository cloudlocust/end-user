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
     * The microwave to mesure.
     */
    microwave: string
    /**
     * The measurement mode.
     */
    measurementMode: string
    /**
     * The measurementStatus state.
     */
    measurementStatus: measurementStatusEnum | null
    /**
     * The setter linked to the measurementStatus state.
     */
    setMeasurementStatus: Dispatch<SetStateAction<measurementStatusEnum | null>>
    /**
     * The setter linked to the state responsible for storing the current step.
     */
    stepSetter: Dispatch<SetStateAction<number>>
}
