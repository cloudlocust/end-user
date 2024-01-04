/**
 * Type for the params object of the Button in the ButtonsSwitcher component.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type ButtonSwitcherParamsType = {
    /**
     * Text to display in Button.
     */
    btnText: string
    /**
     * Callback to execute when the Button is clicked.
     */
    clickHandler: () => void
}

/**
 * ButtonsSwitcher props.
 */
export interface ButtonsSwitcherProps {
    /**
     * List of params object of the Buttons.
     */
    buttonsSwitcherParams: ButtonSwitcherParamsType[]
}
