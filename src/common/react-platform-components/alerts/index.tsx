import { useEffect } from 'react'
import { useSnackbar } from 'notistack'

/**
 * Args of styles in Hooks.
 */
export interface Style {
    /**
     *
     * Time before the alert disappear.
     */
    autoHideDuration?: number
    /**
     * Custom jsx element added to the alert.
     */
    action?: JSX.Element
    /**
     * Persistant alert.
     */
    persist?: boolean
    /**
     * Vertical position of the alert.
     */
    vertical?: 'top' | 'bottom'
    /**
     * Horizontal position of the alert.
     */
    horizontal?: 'left' | 'center' | 'right'
}
/**
 * Display an error message using .
 *
 * @param content Text displayed in the error.
 * @param style Additionnal style passed to the error.
 */
export function useError(content: string, style: Style = {}): void {
    const { enqueueSnackbar } = useSnackbar()
    useEffect(() => {
        enqueueSnackbar(content, {
            variant: 'error',
            autoHideDuration: style?.autoHideDuration ? style?.autoHideDuration : 3000,
            action: style?.action ? style?.action : null,
            persist: style?.persist ? style?.persist : false,
            anchorOrigin: {
                vertical: style?.vertical ? style?.vertical : 'bottom',
                horizontal: style?.horizontal ? style?.horizontal : 'left',
            },
        })
    })
}
/**
 *  Display a success message.
 *
 * @param content Text displayed in the success.
 * @param style Additionnal style passed to the success.
 */
export function useSuccess(content: string, style: Style = {}): void {
    const { enqueueSnackbar } = useSnackbar()
    useEffect(() => {
        enqueueSnackbar(content, {
            variant: 'success',
            autoHideDuration: style?.autoHideDuration ? style?.autoHideDuration : 3000,
            action: style?.action ? style?.action : null,
            persist: style?.persist ? style?.persist : false,
            anchorOrigin: {
                vertical: style?.vertical ? style?.vertical : 'bottom',
                horizontal: style?.horizontal ? style?.horizontal : 'left',
            },
        })
    })
}
/**
 * Display warning message.
 *
 * @param content Text displayed in the warning.
 * @param style Additionnal style passed to the warning.
 */
export function useWarning(content: string, style: Style = {}): void {
    const { enqueueSnackbar } = useSnackbar()
    useEffect(() => {
        enqueueSnackbar(content, {
            variant: 'warning',
            autoHideDuration: style?.autoHideDuration ? style?.autoHideDuration : 3000,
            action: style?.action ? style?.action : null,
            persist: style?.persist ? style?.persist : false,
            anchorOrigin: {
                vertical: style?.vertical ? style?.vertical : 'bottom',
                horizontal: style?.horizontal ? style?.horizontal : 'left',
            },
        })
    })
}
