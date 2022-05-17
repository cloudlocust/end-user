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
    value: string
    /**
     * Options for buttons in form.
     */
    formOptions: any
    /**
     * Wrapper styles.
     */
    wrapperStyles?: string
    /**
     * Buttons title.
     */
    titleLabel?: string
}
