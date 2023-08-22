import { ReactComponentElement } from 'react'

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
    /**
     *  Is disabled button.
     */
    isDisabled?: boolean
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
     * Icon path if it is svg image.
     */
    iconPath?: string
    /**
     * Icon name if taken from fuse mui.
     */
    iconLabel?: string
    /**
     * Generated Material ui SvgIcon example: <SvgIcon sx={{...}}><Icon ../></SvgIcon>.
     * Icon is imported like so : import {ReactComponent as Icon } from 'src/.../icon.svg'.
     */
    icon?: ReactComponentElement
}
