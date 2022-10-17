import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Icon } from 'src/common/ui-kit'
import { useIntl } from 'src/common/react-platform-translation'
import { requiredBuilder, Form, repeatPassword, min } from 'src/common/react-platform-components'
import { ButtonLoader, PasswordField } from 'src/common/ui-kit'
import 'src/modules/User/ForgotPassword/ForgotPassword.scss'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useRef, useState } from 'react'
import { useProfileManagement } from 'src/modules/User/ProfileManagement/ProfileManagementHooks'
import Button from '@mui/material/Button'
import { IChangePasswordData } from 'src/modules/User/ChangePassword/changePassword.d'

/**
 * Change password form, this form is based on react hooks.
 *
 * @returns Change password form.
 */
export const ChangePassword = () => {
    const [openChangePassword, setOpenChangePassword] = useState(false)
    const { isUpdateInProgress, updatePassword } = useProfileManagement()
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
    return (
        <>
            <Button
                variant="contained"
                className="w-256 mx-auto"
                onClick={handleClickOpen}
                endIcon={<Icon>mode_edit</Icon>}
            >
                {formatMessage({
                    id: 'Changer mon mot de passe',
                    defaultMessage: 'Changer mon mot de passe',
                })}
            </Button>
            <Dialog open={openChangePassword} onClose={handleClose} aria-labelledby="alert-dialog-title">
                <DialogTitle id="alert-dialog-title" sx={{ color: 'primary.main' }}>
                    Changer mon mot de passe
                </DialogTitle>
                <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
                    <DialogContent>
                        <Form
                            onSubmit={async (data: IChangePasswordData) => {
                                await updatePassword(data.password)
                                handleClose()
                            }}
                        >
                            <div className="flex flex-col justify-center w-full">
                                <TypographyFormatMessage variant="subtitle2" className="font-semibold mb-10">
                                    Nouveau mot de passe
                                </TypographyFormatMessage>
                                <PasswordField
                                    data-testid="password"
                                    name="password"
                                    label="Nouveau mot de passe"
                                    inputRef={passwordRef}
                                    validateFunctions={[requiredBuilder(), min(8)]}
                                />
                                <TypographyFormatMessage variant="subtitle2" className="font-semibold mb-10">
                                    Confirmer mot de passe
                                </TypographyFormatMessage>
                                <PasswordField
                                    data-testid="repeatPwd"
                                    name="repeatPwd"
                                    label="Confirmer mot de passe"
                                    validateFunctions={[requiredBuilder(), repeatPassword(passwordRef)]}
                                />
                                <div>
                                    <Button variant="outlined" className="mb-4 sm:mr-8 sm:mb-0" onClick={handleClose}>
                                        {formatMessage({ id: 'Annuler', defaultMessage: 'Annuler' })}
                                    </Button>
                                    <ButtonLoader
                                        inProgress={isUpdateInProgress}
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
        </>
    )
}
