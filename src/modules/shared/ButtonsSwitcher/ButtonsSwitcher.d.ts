/**
 * Type for the params object of the Button in the ButtonsSwitcher component.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type ButtonSwitcherParamsType = {
    /**
     * Text to display in Button.
     */
    buttonText: string
    /**
     * Callback to execute when the Button is clicked.
     */
    clickHandler: () => void
    /**
     * Flag indicating whether the Button is selected.
     */
    isSelected: boolean
    /**
     * Flag indicating whether the Button is disabled.
     */
    isDisabled?: boolean
}

/**
 * ButtonsSwitcher props.
 */
export interface ButtonsSwitcherProps {
    /**
     * List of params object of the Buttons.
     */
    buttonsSwitcherParams: ButtonSwitcherParamsType[]
    /**
     * Function generating props for the Button component.
     */
    buttonProps?: (isSelected: boolean, isDisabled?: boolean) => ButtonProps
    /**
     * Props of the container.
     */
    containerProps?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
}
