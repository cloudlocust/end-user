import React from 'react'
import { measurementStepsEnum } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MicrowaveMeasurement'

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
 * Props of the InfosPage component.
 */
export interface InfosPageProps {
    /**
     * The setter linked to the state responsible for storing the current step.
     */
    stepSetter: Dispatch<SetStateAction<measurementStepsEnum>>
}
