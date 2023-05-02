import { FC } from 'react'
import { Card, Typography } from 'src/common/ui-kit'
import { useIntl } from 'src/common/react-platform-translation'
import { LoginForm as DefaultLoginForm } from './LoginForm'
import { Link } from 'react-router-dom'
import MuiLink from '@mui/material/Link'
import './Login.scss'
import { CLIENT_ICON_FOLDER } from 'src/configs'
import { motion } from 'framer-motion'
import CardContent from '@mui/material/CardContent'
import { userRegistrationFeatureState } from 'src/modules/User/Register/RegisterConfig'
import { linksColor } from 'src/modules/utils/muiThemeVariables'

/**
 * Props of login component.
 */
export interface LoginProps {
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
 * @returns Login component.
 */
export const Login: FC<LoginProps> = ({ LoginForm = <DefaultLoginForm /> }): JSX.Element => {
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
                                {formatMessage({ id: 'Connexion', defaultMessage: 'Connexion' })}
                            </Typography>

                            {LoginForm}

                            <div className="flex flex-col items-center justify-center pt-32 pb-24">
                                {!userRegistrationFeatureState && (
                                    <>
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
                                                    (theme) => linksColor || theme.palette.primary.main,
                                            }}
                                            to="/register"
                                            underline="none"
                                        >
                                            {formatMessage({ id: 'Inscription', defaultMessage: 'Inscription' })}
                                        </MuiLink>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
