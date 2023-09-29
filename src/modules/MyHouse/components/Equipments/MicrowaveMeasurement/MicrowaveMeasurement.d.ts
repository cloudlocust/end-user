import React from 'react'

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
 * Props of the CustomUnorderedListItem component.
 */
export interface CustomUnorderedListItemProps {
    /**
     * Children elements of the list item.
     */
    children: React.ReactNode
}

/**
 * Props of the CustomOrderedListItem component.
 */
export interface CustomOrderedListItemProps {
    /**
     * Children elements of the list item.
     */
    children: React.ReactNode
    /**
     * The order of the item list.
     */
    order: number
}

/**
 * Type of the setter function of the step state.
 */
type StepSetterFunction = Dispatch<SetStateAction<number>>

/**
 * Props of the InfosPage component.
 */
export interface InfosPageProps {
    /**
     * The setter linked to the state responsible for storing the current step.
     */
    stepSetter: StepSetterFunction
}

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
    stepSetter: StepSetterFunction
}

/**
 * Props of the EquipmentStartupStep component.
 */
export interface EquipmentStartupStepProps {
    /**
     * The mode of the measurement test.
     */
    measurementMode: string
    /**
     * The setter linked to the state responsible for storing the current step.
     */
    stepSetter: StepSetterFunction
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
    stepSetter: StepSetterFunction
}

/**
 * Type of the select onChange handler function.
 */
export type SelectOnChangeHandler = (event: SelectChangeEvent<string>, child: ReactNode) => void

/**
 * Type of the radio group onChange handler function.
 */
export type RadioGroupOnChangeHandler = (v: string) => void
