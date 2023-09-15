import React from 'react'
import Box from '@mui/material/Box'

/**
 * Props types for CustomRadioGroup component.
 */
export type CustomRadioGroupProps =
    /**
     *
     */
    {
        /**
         * The children components (CustomRadioButton) of the CustomRadioGroup component.
         */
        children?: React.ReactNode
        /**
         * The default value for the radio group.
         */
        defaultValue?: string
        /**
         * Function triggered when the radio group value change.
         */
        onValueChange?: (v: string) => void
    } & React.ComponentProps<typeof Box>

/**
 * Types of props that the CustomRadioGroup component adds to its CustomRadioButton children to manage the value of the radio group.
 */
export type CustomRadioButtonAdditionalProps =
    /**
     *
     */
    {
        /**
         * The state that holds the value of the radio group.
         */
        selectedValue?: string
        /**
         * The setter associated to the radio group value state (selectedValue).
         */
        setSelectedValue?: React.Dispatch<React.SetStateAction<string>>
    }
