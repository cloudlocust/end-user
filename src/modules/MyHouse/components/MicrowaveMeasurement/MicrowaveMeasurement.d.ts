import React from 'react'

/**
 * Props of the MicrowaveMeasurement component.
 */
export interface MicrowaveMeasurementProps {
    /**
     * The state of the modal.
     */
    modalIsOpen: boolean
    /**
     * Modal closing handler.
     */
    closeModal: () => void
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
    index: number
}

/**
 * Props of the InfosPage component.
 */
export interface InfosPageProps {
    /**
     * The setter linked to the state responsible for storing the current step.
     */
    stepSetter: Dispatch<SetStateAction<number>>
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
