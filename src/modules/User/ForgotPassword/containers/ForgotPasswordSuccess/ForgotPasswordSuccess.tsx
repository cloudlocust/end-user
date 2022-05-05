import React, { FC, useEffect } from 'react'
import { Card, Typography, Icon, MuiCardContent } from 'src/common/ui-kit'
import { useIntl } from 'src/common/react-platform-translation'
import { Link } from 'react-router-dom'
import MuiLink from '@mui/material/Link'
import { useHistory, useLocation } from 'react-router-dom'
import './ForgotPasswordSuccess.scss'
import { URL_LOGIN } from 'src/modules/User/Login/LoginConfig'
import { motion } from 'framer-motion'

// We must keep this interface because its needed in the config.
// eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/no-empty-interface
export interface ForgotPasswordSuccessLocationProps {
    /**
     *
     */
    email: string
}

/**
 * Success page after forget password request.
 *
 * @returns Success component after forgot password.
 */
const ForgotPasswordSuccess: FC = (): JSX.Element => {
    const { formatMessage } = useIntl()
    const {
        state: { email: resettedEmail },
    } = useLocation<ForgotPasswordSuccessLocationProps>()
    const history = useHistory()

    useEffect(() => {
        if (!resettedEmail) {
            history.replace('/login')
        }
    }, [history, resettedEmail])

    if (!resettedEmail) return <React.Fragment />

    return (
        <div className="forgot-password-success-container">
            <div className="forgot-password-success-content">
                <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card>
                        <MuiCardContent>
                            <div className="icon-container">
                                <Icon className="icon">email</Icon>
                            </div>

                            <Typography variant="h5" className="title">
                                {formatMessage({ id: 'Email envoyé !', defaultMessage: 'Email envoyé !' })}
                            </Typography>

                            <Typography className="description">
                                {formatMessage({
                                    id: 'Un e-mail contenant des instructions a été envoyé à',
                                    defaultMessage: 'Un e-mail contenant des instructions a été envoyé à',
                                })}{' '}
                                <b>{resettedEmail}</b>.
                            </Typography>

                            <div className="login-container">
                                <MuiLink
                                    component={Link}
                                    sx={{
                                        color:
                                            // eslint-disable-next-line jsdoc/require-jsdoc
                                            (theme) => theme.palette.primary.light,
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
                        </MuiCardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}

export default ForgotPasswordSuccess
