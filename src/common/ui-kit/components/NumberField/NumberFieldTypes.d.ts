import { Theme } from '@mui/material'

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
     * Icon component.
     */
    iconComponent?: (theme: Theme, isDisabled?: boolean) => JSX.Element
    /**
     * Is Field disabled.
     */
    disabled?: boolean
    /**
     * Wraper className.
     */
    wrapperClasses?: string
    /**
     * Is decrement disabled when value === 0.
     */
    disableDecrement?: boolean
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
