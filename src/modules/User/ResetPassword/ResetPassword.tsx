import { FC, useEffect } from 'react'
import { CLIENT_ICON_FOLDER } from 'src/configs'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { ResetPasswordForm } from 'src/modules/User/ResetPassword/ResetPasswordForm'
import { useLocation, useHistory } from 'react-router-dom'
import { URL_LOGIN } from 'src/modules/User/Login/LoginConfig'

/**
 * Reset password component.
 *
 * @returns Reset Password Component.
 */
export const ResetPassword: FC = (): JSX.Element => {
    const history = useHistory()
    const { search } = useLocation()
    const query = new URLSearchParams(search)
    const token = query.get('token') as string

    useEffect(() => {
        if (!token) history.push(URL_LOGIN)
    }, [history, token])

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
                                Modifier votre mot de passe
                            </TypographyFormatMessage>
                            <ResetPasswordForm token={token} />
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
