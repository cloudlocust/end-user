/**
 * Props related to the radio group state.
 */
export interface RadioStateProps {
    /**
     * The state that holds the value of the radio group.
     */
    selectedValue?: string
    /**
     * The radio button click handler function that update the selectedValue.
     */
    handleRadioBtnClick?: (v: string) => void
}

/**
 * Props types for CustomRadioButton component.
 */
export interface CustomRadioButtonProps extends RadioStateProps {
    /**
     * The value associated with the radio button.
     */
    value: string
    /**
     * The descriptive text associated with the radio button.
     */
    label: string
}
