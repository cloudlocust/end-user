import { Theme } from '@mui/material'

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
     * The global equipment id.
     */
    housingEquipmentId: number
    /**
     * The microwave to mesure.
     */
    microwaveNumber: number
    /**
     * The measurement mode.
     */
    measurementMode: string
    /**
     * The setter linked to the state responsible for storing the current step.
     */
    stepSetter: Dispatch<SetStateAction<number>>
}
