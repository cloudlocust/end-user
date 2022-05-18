/**
 * Interface for Select Button.
 */
export interface ISelectButtons {
    /**
     * Section name.
     */
    name: string
    /**
     * Initial value.
     */
    initialValue?: string
    /**
     * Options for buttons in form.
     */
    formOptions: IFormOptions[]
    /**
     * Wrapper styles.
     */
    wrapperStyles?: string
    /**
     * Buttons title.
     */
    titleLabel?: string
}
/**
 * Button options.
 */
export interface IFormOptions {
    /**
     * Label  name.
     */
    label: string
    /**
     * Button value.
     */
    value: string
    /**
     * Styles for icon.
     */
    iconStyles?: string
    /**
     * Styles for button.
     */
    buttonStyle?: string
    /**
     *  Is disabled button.
     */
    isDisabled: boolean
    /**
     * Icon path if it is svg image.
     */
    iconPath?: string
    /**
     * Icon name if taken from fuse mui.
     */
    iconLabel?: string
}
