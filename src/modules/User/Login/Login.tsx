import React, { FC } from 'react'
import { Card, Typography } from 'src/common/ui-kit'
import { useIntl } from 'src/common/react-platform-translation'
import { LoginForm as DefaultLoginForm } from './LoginForm'
import { Link } from 'react-router-dom'
import MuiLink from '@mui/material/Link'
import './Login.scss'
import { LOGO_URL, API_BASE_URL, CLIENT_ICON_FOLDER } from 'src/configs'
import { motion } from 'framer-motion'
import CardContent from '@mui/material/CardContent'

/**
 * Props of login component.
 */
export interface LoginProps {
    /**
     * Logo of the company. This field is not required.
     */
    logo?: // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Destination link if the logo is clickable.
         */
        href?: string
        /**
         * Url of the logo.
         */
        url: string
    }
    /**
     * Login form component. This is a rendered component. This field is not required.
     */
    LoginForm?: JSX.Element
}

/**
 * Login component to diplay for user login.
 *
 * @param props N/A.
 * @param props.LoginForm Login form of the component. This field has a default value.
 * @param props.logo Logo of the company. This field has a default value.
 * @returns Login component.
 */
export const Login: FC<LoginProps> = ({
    LoginForm = <DefaultLoginForm />,
    logo = { href: API_BASE_URL, url: LOGO_URL },
}): JSX.Element => {
    const { formatMessage } = useIntl()

    return (
        <div className="flex flex-col flex-auto items-center justify-center p-16 sm:p-32">
            <div className="flex flex-col items-center justify-center w-full">
                <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card className="w-full max-w-384">
                        <CardContent className="flex flex-col items-center justify-center p-16 sm:p-24 md:p-32">
                            <img
                                className="w-128 m-32"
                                src={`assets/images/logos/${CLIENT_ICON_FOLDER}.svg`}
                                alt="logo"
                            />

                            <Typography variant="h6" className="mt-16 mb-24 font-semibold text-18 sm:text-24">
                                {formatMessage({ id: 'Login', defaultMessage: 'Login' })}
                            </Typography>

                            {LoginForm}

                            <div className="flex flex-col items-center justify-center pt-32 pb-24">
                                <span className="font-normal">
                                    {formatMessage({
                                        id: "Vous n'avez pas de compte ?",
                                        defaultMessage: "Vous n'avez pas de compte ?",
                                    })}
                                </span>
                                <MuiLink
                                    component={Link}
                                    sx={{
                                        color:
                                            // eslint-disable-next-line jsdoc/require-jsdoc
                                            (theme) => theme.palette.primary.light,
                                    }}
                                    to="/register"
                                    underline="none"
                                >
                                    {formatMessage({ id: 'Inscription', defaultMessage: 'Inscription' })}
                                </MuiLink>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
