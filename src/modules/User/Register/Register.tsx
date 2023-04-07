import { FC } from 'react'
import './register.scss'
import { Card, Typography } from 'src/common/ui-kit'
import { CLIENT_ICON_FOLDER } from 'src/configs'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import MuiLink from '@mui/material/Link'
import { URL_LOGIN } from 'src/modules/User/Login/LoginConfig'
import { RegisterForm as DefaultRegisterForm } from './RegisterForm'
import { motion } from 'framer-motion'
import CardContent from '@mui/material/CardContent'

/**
 * Props of the register component.
 */
export interface RegisterProps {
    /**
     * Registration form component. This is a rendered component. This field is not required.
     */
    registerForm?: JSX.Element
}
/**
 * Register component to display for user registration.
 *
 * @param root0 N/A.
 * @param root0.registerForm Register form for the component. This field has a default value.
 * @returns Register component.
 */
const Register: FC<RegisterProps> = ({ registerForm = <DefaultRegisterForm defaultRole="enduser" /> }): JSX.Element => {
    const { formatMessage } = useIntl()
    return (
        <div className="flex flex-col flex-auto items-center justify-center p-16 sm:p-32">
            <div className="flex flex-col items-center justify-center w-full">
                <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card className="w-full max-w-384">
                        <CardContent className="flex flex-col items-center justify-center p-16 sm:p-24 md:p-32">
                            <img
                                className="w-128 m-32"
                                src={`./clients-icons/${CLIENT_ICON_FOLDER}/${CLIENT_ICON_FOLDER}.svg`}
                                alt="logo"
                            />
                            <Typography variant="h6" className="mt-16 mb-24 font-semibold text-18 sm:text-24">
                                {formatMessage({ id: 'Inscription', defaultMessage: 'Inscription' })}
                            </Typography>

                            {registerForm}

                            <div className="flex flex-col items-center justify-center pt-32 pb-24">
                                {formatMessage({
                                    id: 'Vous avez déjà un compte ?',
                                    defaultMessage: 'Vous avez déjà un compte ?',
                                })}
                                <MuiLink
                                    component={Link}
                                    sx={{
                                        color:
                                            // eslint-disable-next-line jsdoc/require-jsdoc
                                            (theme) => theme.palette.primary.main,
                                    }}
                                    to={URL_LOGIN}
                                    underline="none"
                                >
                                    {formatMessage({ id: 'Se connecter', defaultMessage: 'Se connecter' })}
                                </MuiLink>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}

export default Register
