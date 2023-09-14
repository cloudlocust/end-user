/**
 * Props types for CustomRadioButton component.
 */
export type CustomRadioButtonProps =
    /**
     *
     */
    {
        /**
         * The value associated with the radio button.
         */
        value: string
        /**
         * The descriptive text associated with the radio button.
         */
        label: string
        /**
         * A state holds the value of the currently selected radio button among athegroup of radio buttons.
         */
        selectedValue?: string
        /**
         * The setter associated to the selected radio button state (selectedValue).
         */
        setSelectedValue?: (v: string) => void
    }
