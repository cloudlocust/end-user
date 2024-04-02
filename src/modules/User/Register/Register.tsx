import { FC } from 'react'
import './register.scss'
import { Card, Typography } from 'src/common/ui-kit'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import MuiLink from '@mui/material/Link'
import { URL_LOGIN } from 'src/modules/User/Login/LoginConfig'
import { RegisterForm as DefaultRegisterForm } from './RegisterForm'
import { motion } from 'framer-motion'
import CardContent from '@mui/material/CardContent'
import { linksColor } from 'src/modules/utils/muiThemeVariables'
import { renderCommonLogo } from 'src/modules/User/Login/Login'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { isAlpiqSubscriptionForm } from 'src/modules/User/AlpiqSubscription/index.d'
import { isPopupAfterRegistration } from 'src/modules/User/Register/RegisterConfig'

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

    const isNoticeShown = isAlpiqSubscriptionForm || isPopupAfterRegistration
    return (
        <div className="flex flex-col flex-auto items-center justify-center p-16 sm:p-32">
            <div className="flex flex-col items-center justify-center w-full">
                <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card className="w-full max-w-384">
                        <CardContent className="flex flex-col items-center justify-center p-16 sm:p-24 md:p-32">
                            {renderCommonLogo()}
                            <Typography variant="h6" className="mt-16 mb-24 font-semibold text-18 sm:text-24">
                                {formatMessage({ id: 'Inscription', defaultMessage: 'Inscription' })}
                            </Typography>

                            {isNoticeShown && (
                                <TypographyFormatMessage className="text-13 mb-32 text-center font-medium">
                                    Munissez vous de votre N° de PDL - présent sur votre facture d'électrcité - et de
                                    votre RIB.
                                </TypographyFormatMessage>
                            )}

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
                                            (theme) => linksColor || theme.palette.primary.main,
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
