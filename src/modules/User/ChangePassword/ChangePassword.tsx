import { Button, Card, CardContent, useTheme } from '@mui/material'
import React, { FC, MouseEventHandler, useRef, useState } from 'react'
import { email, requiredBuilder, Form, repeatPassword } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { TextField, ButtonLoader, PasswordField } from 'src/common/ui-kit'
import '../ForgotPassword/ForgotPassword.scss'
import { motion } from 'framer-motion'
import { useHistory } from 'react-router-dom'
import { ButtonResetForm } from 'src/common/ui-kit/components/ButtonResetForm/ButtonResetForm'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
/**
 * Forgot password form, this form is based on react hooks.
 *
 * @returns Forgot password form.
 */
export const ChangePassword = ({ toggleActiveForm }: { toggleActiveForm: any }) => {
    const { formatMessage } = useIntl()
    const passwordRef = useRef()
    const theme = useTheme()
    const history = useHistory()
    return (
        <>
            <div className="forgot-password-container">
                <div className="forgot-password-content">
                    <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
                        <Card>
                            <CardContent>
                                <Form
                                    onSubmit={function (model: unknown): void {
                                        throw new Error('Function not implemented.')
                                    }}
                                >
                                    <TypographyFormatMessage
                                        variant="subtitle1"
                                        className="font-semibold mb-20"
                                        style={{ color: theme.palette.primary.main }}
                                    >
                                        Changer mon mot de passe
                                    </TypographyFormatMessage>
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
                                                onClick={() => {
                                                    history.goBack()
                                                    toggleActiveForm()
                                                }}
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
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </>
    )
}
