import React from 'react'

/**
 * Props of the ConfigurationStep component.
 */
export interface ConfigurationStepProps {
    /**
     * The number of microwaves.
     */
    equipmentsNumber: number
    /**
     * The state that hold the selected microwave.
     */
    selectedMicrowave: number
    /**
     * The setter associated to the selected microwave state.
     */
    setSelectedMicrowave: Dispatch<SetStateAction<number>>
    /**
     * Measurement modes for the Equipment.
     */
    measurementModes: string[]
    /**
     * The state that hold the selected measurement mode.
     */
    selectedMeasurementMode: string
    /**
     * The setter associated to the measurement mode state.
     */
    setSelectedMeasurementMode: Dispatch<SetStateAction<string>>
    /**
     * The setter linked to the state responsible for storing the current step.
     */
    stepSetter: Dispatch<SetStateAction<measurementStepsEnum>>
}

/**
 * Type of the select onChange handler function.
 */
export type SelectOnChangeHandler = (event: SelectChangeEvent<string>, child: React.ReactNode) => void

/**
 * Type of the radio group onChange handler function.
 */
export type RadioGroupOnChangeHandler = (v: string) => void
