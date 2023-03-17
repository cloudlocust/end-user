import React, { FC, useEffect } from 'react'
import { LOGO_URL, API_BASE_URL, CLIENT_ICON_FOLDER } from 'src/configs'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { SetPasswordForm } from 'src/modules/User/SetPassword/SetPasswordForm'
import { useLocation, useHistory } from 'react-router-dom'
import { URL_LOGIN } from 'src/modules/User/Login/LoginConfig'
import { ResetPasswordProps } from 'src/modules/User/ResetPassword/ResetPasswordTypes'
import { Form } from 'src/common/react-platform-components'
import { TextField } from 'src/common/ui-kit'
import { GoogleMapsAddressAutoCompleteField } from 'src/common/ui-kit/form-fields/GoogleMapsAddressAutoComplete/GoogleMapsAddressAutoCompleteField'
import { PhoneNumber } from 'src/common/ui-kit/form-fields/phoneNumber/PhoneNumber'

/**
 * Reset password component.
 *
 * @param props N/A.
 * @param props.logo Logo of the company. This field has a default value.
 * @returns Reset Password Component.
 */
export const SetPassword: FC<ResetPasswordProps> = ({ logo = { href: API_BASE_URL, url: LOGO_URL } }): JSX.Element => {
    const history = useHistory()
    const { search } = useLocation()
    const query = new URLSearchParams(search)
    const token = query.get('token') as string
    // Decode from base64
    const userInfo = query.get('user_info')
        ? JSON.parse(Buffer.from(query.get('user_info') as string, 'base64').toString())
        : ''

    useEffect(() => {
        if (!token || !userInfo) history.push(URL_LOGIN)
    }, [history, token, userInfo])

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-content">
                <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-16 sm:p-24 md:p-32">
                            <img
                                className="w-128 m-32"
                                src={`./clients-icons/${CLIENT_ICON_FOLDER}/${CLIENT_ICON_FOLDER}.svg`}
                                alt="logo"
                            />
                            <TypographyFormatMessage
                                variant="h6"
                                className="mt-16 mb-24 text-center font-semibold sm:text-20"
                            >
                                Vérification de vos informations
                            </TypographyFormatMessage>
                            <Form onSubmit={() => {}} defaultValues={userInfo}>
                                <div className="flex flex-col justify-center w-full">
                                    <TextField name="first_name" label="Prénom" variant="outlined" disabled />
                                    <TextField name="last_name" label="Nom" disabled />
                                    <TextField name="email" label="Email" disabled />
                                    <PhoneNumber
                                        name="phone"
                                        label="Numéro de téléphone"
                                        // type="tel" allows to have the country phone code
                                        type="tel"
                                        sx={{ margin: '0 0 1.25rem 0' }}
                                        disabled
                                    />
                                    <GoogleMapsAddressAutoCompleteField name="address" disabled />
                                </div>
                            </Form>
                            <TypographyFormatMessage
                                variant="h6"
                                className="mt-16 mb-24 text-center font-semibold sm:text-20"
                            >
                                Création d'un mot de passe
                            </TypographyFormatMessage>
                            <SetPasswordForm token={token} />
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
