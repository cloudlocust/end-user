import { FC } from 'react'
import { Card, Typography } from 'src/common/ui-kit'
import { useIntl } from 'src/common/react-platform-translation'
import { ForgotPasswordForm as DefaultForgotPasswordForm } from './ForgotPasswordForm'
import { Link } from 'react-router-dom'
import MuiLink from '@mui/material/Link'
import './ForgotPassword.scss'
import { CLIENT_ICON_FOLDER } from 'src/configs'
import CardContent from '@mui/material/CardContent'
import { motion } from 'framer-motion'
import { URL_LOGIN } from 'src/modules/User/Login/LoginConfig'
import { linksColor } from 'src/modules/utils/muiThemeVariables'
/**
 * Props of the forget password component.
 */
export interface ForgotPasswordProps {
    /**
     * Forget password component. This is a rendered component.
     */
    forgotPasswordForm?: JSX.Element
}

/**
 * Forget password component.
 *
 * @param props N/A.
 * @param props.forgotPasswordForm Forget password form. This field has a default value.
 * @returns Forget password component.
 */
export const ForgotPassword: FC<ForgotPasswordProps> = ({
    forgotPasswordForm = <DefaultForgotPasswordForm />,
}): JSX.Element => {
    const { formatMessage } = useIntl()
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
                            <Typography variant="h6" className="mt-16 mb-24 text-center font-semibold sm:text-20">
                                {formatMessage({
                                    id: 'Récupérez votre mot de passe',
                                    defaultMessage: 'Récupérez votre mot de passe',
                                })}
                            </Typography>
                            {forgotPasswordForm}

                            <div className="login-container">
                                <MuiLink
                                    component={Link}
                                    sx={{
                                        color:
                                            // eslint-disable-next-line jsdoc/require-jsdoc
                                            (theme) => linksColor || theme.palette.primary.main,
                                    }}
                                    to={URL_LOGIN}
                                    underline="none"
                                >
                                    {formatMessage({
                                        id: 'Revenir à la connexion',
                                        defaultMessage: 'Revenir à la connexion',
                                    })}
                                </MuiLink>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
