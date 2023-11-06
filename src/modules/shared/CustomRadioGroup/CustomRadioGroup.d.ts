import { BoxProps } from '@mui/material/Box'

/**
 * Props types for CustomRadioGroup component.
 */
export interface CustomRadioGroupProps extends BoxProps {
    /**
     * The parameters of the CustomRadioButton children components.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    elements: {
        /**
         * The value of the CustomRadioButton component.
         */
        value: string
        /**
         * The label of the CustomRadioButton component.
         */
        label: string
    }[]
    /**
     * Function triggered when the radio group value change.
     */
    onValueChange?: (v: string) => void
    /**
     * Props of the MUI Box component.
     */
    boxProps?: BoxProps
}
