import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Icon } from 'src/common/ui-kit'
import { useIntl } from 'src/common/react-platform-translation'
import { useTheme } from '@mui/material'
import { requiredBuilder, Form, repeatPassword, min } from 'src/common/react-platform-components'
import { ButtonLoader, PasswordField } from 'src/common/ui-kit'
import 'src/modules/User/ForgotPassword/ForgotPassword.scss'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useRef, useState } from 'react'
import { useProfileManagement } from 'src/modules/User/ProfileManagement/ProfileManagementHooks'
import Button from '@mui/material/Button'
import { IUser } from 'src/modules/User/model'
/**
 * Change password form, this form is based on react hooks.
 *
 * @returns Change password form.
 */
export const ChangePassword = () => {
    const [openChangePassword, setOpenChangePassword] = useState(false)
    const { isChangePasswordInProgress, updatePassword } = useProfileManagement()
    /**
     * Handle the click on open dialog window.
     */
    const handleClickOpen = () => {
        setOpenChangePassword(true)
    }
    /**
     * Handle the click on close dialog window.
     */
    const handleClose = () => {
        setOpenChangePassword(false)
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
            <Dialog open={openChangePassword} onClose={handleClose} aria-labelledby="alert-dialog-title">
                <DialogTitle id="alert-dialog-title" style={{ color: theme.palette.primary.main }}>
                    Changer mon mot de passe
                </DialogTitle>
                <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
                    <DialogContent>
                        <Form
                            onSubmit={async (data: IUser) => {
                                await updatePassword(data)
                                handleClose()
                            }}
                        >
                            <div className="flex flex-col justify-center w-full">
                                <TypographyFormatMessage variant="subtitle2" className="font-semibold mb-10">
                                    Nouveau mot de passe
                                </TypographyFormatMessage>
                                <PasswordField
                                    name="password"
                                    label="Nouveau mot de passe"
                                    inputRef={passwordRef}
                                    validateFunctions={[requiredBuilder(), min(8)]}
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
                                    <Button variant="outlined" className="mb-4 sm:mr-8 sm:mb-0" onClick={handleClose}>
                                        {formatMessage({ id: 'Annuler', defaultMessage: 'Annuler' })}
                                    </Button>
                                    <ButtonLoader
                                        inProgress={isChangePasswordInProgress}
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
