import { Button, Card, CardContent } from '@mui/material'
import React, { FC, useState } from 'react'
import { email, requiredBuilder, Form } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { TextField, ButtonLoader, PasswordField } from 'src/common/ui-kit'
import { useForgotPassword } from 'src/modules/User/ForgotPassword/hooks'
import '../ForgotPassword/ForgotPassword.scss'
import { motion } from 'framer-motion'
import { useHistory } from 'react-router-dom'
import { ButtonResetForm } from 'src/common/ui-kit/components/ButtonResetForm/ButtonResetForm'
/**
 * Forgot password form, this form is based on react hooks.
 *
 * @returns Forgot password form.
 */
export const ChangePassword: FC = () => {
    const { formatMessage } = useIntl()
    const { isForgotPasswordProgress, onSubmitForgotPassword } = useForgotPassword()
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
                                    <div className="flex flex-col justify-center w-full">
                                        <PasswordField
                                            name="password"
                                            label="Nouveau mot de passe"
                                            // inputRef={passwordRef}
                                            // validateFunctions={[requiredBuilder(), min(8)]}
                                        />
                                        <PasswordField
                                            name="repeatPwd"
                                            label="Confirmer mot de passe"
                                            // validateFunctions={[requiredBuilder(), repeatPassword(passwordRef)]}
                                        />
                                        <div>
                                            <ButtonResetForm
                                                initialValues={formInitialValues}
                                                onClickButtonReset={toggleEditFormDisable}
                                            />
                                            <ButtonLoader
                                                inProgress={isModifyInProgress}
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
