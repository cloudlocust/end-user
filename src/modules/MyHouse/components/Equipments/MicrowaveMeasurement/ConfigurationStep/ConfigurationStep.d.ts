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
    selectedMicrowave: string
    /**
     * The setter associated to the selected microwave state.
     */
    setSelectedMicrowave: Dispatch<SetStateAction<string>>
    /**
     * The state that hold the measurement mode.
     */
    measurementMode: string
    /**
     * The setter associated to the measurement mode state.
     */
    setMeasurementMode: Dispatch<SetStateAction<string>>
    /**
     * The setter linked to the state responsible for storing the current step.
     */
    stepSetter: Dispatch<SetStateAction<number>>
}

/**
 * Type of the select onChange handler function.
 */
export type SelectOnChangeHandler = (event: SelectChangeEvent<string>, child: React.ReactNode) => void

/**
 * Type of the radio group onChange handler function.
 */
export type RadioGroupOnChangeHandler = (v: string) => void
