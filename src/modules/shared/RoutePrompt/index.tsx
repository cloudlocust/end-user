import React, { useCallback, useEffect, useState } from 'react'
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
    const [currentPath, setCurrentPath] = useState('')

    useEffect(() => {
        const unblock = when
            ? history.block((prompt) => {
                  setCurrentPath(prompt.pathname)
                  setShowPrompt(true)
                  return 'true'
              })
            : history.block(() => {})

        return () => {
            unblock()
        }
    }, [history, when])

    const handleOK = useCallback(async () => {
        if (onOK) {
            const canRoute = await Promise.resolve(onOK())
            if (canRoute) {
                history.push(currentPath)
                history.block(() => {})
            }
        }
    }, [currentPath, history, onOK])

    const handleCancel = useCallback(async () => {
        if (onCancel) {
            const canRoute = await Promise.resolve(onCancel())
            if (canRoute) {
                history.push(currentPath)
                history.block(() => {})
            }
        }
        setShowPrompt(false)
    }, [currentPath, history, onCancel])

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
