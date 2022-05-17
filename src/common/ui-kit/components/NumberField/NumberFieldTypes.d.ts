/**
 * NumberField
 *  interface.
 */
export interface INumberField {
    /**
     * Value to counting.
     */
    value?: number
    /**
     * Label title.
     */
    labelTitle: string
    /**
     * Icon name if taken from fuse mui.
     */
    iconLabel?: string
    /**
     * Icon path if it is svg image.
     */
    iconPath?: string
    /**
     * Is decrement disabled when value === 0.
     */
    disableDecrement?: boolean
    /**
     * Wraper className.
     */
    wrapperClasses?: string
    /**
     *
     */
    onChange?: (value: number) => void
}

/**
 * Interface INumberFieldForm with field name, extending INumberFieldFormForm .
 */
export interface INumberFieldForm extends INumberField {
    /**
     * Required name field.
     */
    name: string
}
