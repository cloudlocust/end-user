import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Icon } from 'src/common/ui-kit'
import { useIntl } from 'src/common/react-platform-translation'
import { Button, useTheme } from '@mui/material'
import { requiredBuilder, Form, repeatPassword } from 'src/common/react-platform-components'
import { ButtonLoader, PasswordField } from 'src/common/ui-kit'
import '../ForgotPassword/ForgotPassword.scss'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useRef } from 'react'
/**
 * Change password form, this form is based on react hooks.
 *
 * @returns Change password form.
 */
export const ChangePassword = () => {
    const [open, setOpen] = React.useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }
    const { formatMessage } = useIntl()
    const passwordRef = useRef()
    const theme = useTheme()
    return (
        <div>
            <div className="pl-16 sm:pl-24 md:pl-32">
                <Button variant="contained" className="w-256 mx-auto mb-16" onClick={handleClickOpen}>
                    {formatMessage({
                        id: 'Changer mon mot de passe',
                        defaultMessage: 'Changer mon mot de passe',
                    })}
                    <Icon className="ml-10">mode_edit</Icon>
                </Button>
            </div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title">
                <DialogTitle id="alert-dialog-title" style={{ color: theme.palette.primary.main }}>
                    Changer mon mot de passe
                </DialogTitle>
                <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
                    <DialogContent>
                        <Form
                            onSubmit={function (model: unknown): void {
                                throw new Error('Function not implemented.')
                            }}
                        >
                            <div className="flex flex-col justify-center w-full">
                                <TypographyFormatMessage variant="subtitle2" className="font-semibold mb-10">
                                    Nouveau mot de passe
                                </TypographyFormatMessage>
                                <PasswordField
                                    name="password"
                                    label="Nouveau mot de passe"
                                    // inputRef={passwordRef}
                                    // validateFunctions={[requiredBuilder(), min(8)]}
                                />
                                <TypographyFormatMessage variant="subtitle2" className="font-semibold mb-10">
                                    Confirmer mot de passe
                                </TypographyFormatMessage>
                                <PasswordField
                                    name="repeatPwd"
                                    label="Confirmer mot de passe"
                                    validateFunctions={[requiredBuilder(), repeatPassword(passwordRef)]}
                                />
                                <div>
                                    <Button
                                        // inProgress={isModifyInProgress}
                                        variant="outlined"
                                        className="mb-4 sm:mr-8 sm:mb-0"
                                        onClick={handleClose}
                                    >
                                        {formatMessage({ id: 'Annuler', defaultMessage: 'Annuler' })}
                                    </Button>
                                    <ButtonLoader
                                        // inProgress={isModifyInProgress}
                                        variant="contained"
                                        type="submit"
                                        className="ml-8 mb-4 sm:mr-8 sm:mb-0"
                                    >
                                        {formatMessage({ id: 'Enregistrer', defaultMessage: 'Enregistrer' })}
                                    </ButtonLoader>
                                </div>
                            </div>
                        </Form>
                    </DialogContent>
                </motion.div>
            </Dialog>
        </div>
    )
}
