import { useEffect } from 'react'
import { Card, Icon, MuiCardContent } from 'src/common/ui-kit'
import { useIntl } from 'src/common/react-platform-translation'
import { Link, useHistory, useLocation } from 'react-router-dom'
import MuiLink from '@mui/material/Link'
import { URL_LOGIN } from 'src/modules/User/Login/LoginConfig'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import './registerEnergyProviderSuccess.scss'
import { energyProviderRegisterSuccessMessage } from 'src/modules/User/Register/RegisterConfig'

/**
 * Interface type for RegisterEnergyProviderSuccessLocation.
 */
export interface RegisterEnergyProviderSuccessLocation {
    /**
     * State to be checked to allow or not user in the route.
     */
    isAllowed: boolean
}

/**
 * Component that shows register energy provider success.
 *
 * @returns Register Energy provider success JSX.
 */
export const RegisterEnergyProviderSuccess = () => {
    const { formatMessage } = useIntl()
    const history = useHistory()
    const {
        state: { isAllowed },
    } = useLocation<RegisterEnergyProviderSuccessLocation>()

    useEffect(() => {
        if (!isAllowed) {
            history.push(URL_LOGIN)
        }
    }, [history, isAllowed])

    return (
        <div className="register-energy-provider-success-container">
            <div className="register-energy-provider-success-content">
                <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card>
                        <MuiCardContent>
                            <div className="icon-container">
                                <Icon className="icon" color="success">
                                    check_circle_outlined
                                </Icon>
                            </div>

                            <TypographyFormatMessage className="description">
                                {energyProviderRegisterSuccessMessage}
                            </TypographyFormatMessage>

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
