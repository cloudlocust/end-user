import { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Dialog, DialogTitle, DialogActions, DialogContent, Button, useTheme } from '@mui/material'
import { RoutePromptProps } from 'src/modules/shared/RoutePrompt/RoutePromptTypes'

/**
 * RouterPrompt component.
 *
 * @param props RoutePrompt props.
 * @returns Dialog component.
 */
export function RouterPrompt(props: RoutePromptProps) {
    const { when, onOK, onCancel, title, contentText, okText, cancelText } = props
    const history = useHistory()
    const theme = useTheme()
    const [showPrompt, setShowPrompt] = useState(false)

    useEffect(() => {
        const unblock = when
            ? history.block((_prompt) => {
                  setShowPrompt(true)
                  return 'true'
              })
            : history.block(() => {})

        return () => {
            unblock()
        }
    }, [history, when])

    const handleNavigation = useCallback(
        async (callback) => {
            if (callback) {
                const canRoute = await Promise.resolve(callback())
                if (canRoute) {
                    history.goBack()
                    history.block(() => {})
                }
                return canRoute
            }
            return false
        },
        [history],
    )

    const handleOK = useCallback(() => {
        handleNavigation(onOK)
    }, [onOK, handleNavigation])

    const handleCancel = useCallback(async () => {
        const canRoute = await handleNavigation(onCancel)
        if (!canRoute) {
            setShowPrompt(false)
        }
    }, [onCancel, handleNavigation])

    return showPrompt ? (
        <Dialog
            open={showPrompt}
            onClose={handleCancel}
            PaperProps={{
                style: {
                    background: '#D32F2F',
                    color: theme.palette.common.white,
                },
            }}
        >
            {title && <DialogTitle>{title}</DialogTitle>}
            {<DialogContent className="text-16 md:text-18 text-center text-white">{contentText}</DialogContent>}
            {okText && cancelText && (
                <DialogActions>
                    <Button variant="text" className="text-13 md:text-16 font-medium text-white" onClick={handleOK}>
                        {okText}
                    </Button>
                    <Button variant="text" className="text-13 md:text-16 font-medium text-white" onClick={handleCancel}>
                        {cancelText}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    ) : null
}
