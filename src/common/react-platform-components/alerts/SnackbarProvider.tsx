import React, { FC } from 'react'
import { SnackbarProvider as NotistackSnackbarProvider, SnackbarKey, SnackbarProviderProps } from 'notistack'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

/**
 *Snackbar Provider wrapper.
 *
 * @param {Element} children Component's childs.
 * @returns Provider with fixed props.
 */
export const SnackbarProvider: FC<SnackbarProviderProps> = ({ children }) => {
    const notistackRef = React.createRef<NotistackSnackbarProvider>()
    /**
     * Handler of close Snackbar Action.
     *
     * @param key The snackbar key to be closed.
     * @returns Void.
     */
    // add action to all snackbars.
    const onClickDismiss = (key: SnackbarKey) => () => {
        if (notistackRef && notistackRef.current && notistackRef.current.closeSnackbar) {
            notistackRef.current.closeSnackbar(key)
        }
    }

    return (
        <>
            <NotistackSnackbarProvider
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                maxSnack={3}
                autoHideDuration={5000}
                preventDuplicate={true}
                style={{ fontSize: '1.2rem' }}
                ref={notistackRef}
                action={(key) => (
                    <IconButton color="inherit" onClick={onClickDismiss(key)}>
                        <CloseIcon />
                    </IconButton>
                )}
            >
                {children}
            </NotistackSnackbarProvider>
        </>
    )
}
