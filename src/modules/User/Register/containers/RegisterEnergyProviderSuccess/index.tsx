import { ButtonLoader, Card, MuiCardContent } from 'src/common/ui-kit'
import { useIntl } from 'src/common/react-platform-translation'
import { Link, useHistory, useLocation } from 'react-router-dom'
import MuiLink from '@mui/material/Link'
import { URL_LOGIN } from 'src/modules/User/Login/LoginConfig'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import './registerEnergyProviderSuccess.scss'
import { energyProviderName } from 'src/modules/User/Register/RegisterConfig'
import { useRegisterToEnergyProvider } from 'src/modules/User/Register/containers/RegisterEnergyProviderSuccess/hooks'
import { useEffect } from 'react'

/**
 * Interface type for RegisterEnergyProviderSuccessLocation.
 */
export interface RegisterEnergyProviderSuccessLocation {
    /**
     * Link to Energy Provider subscribe Form.
     */
    energyProviderFormLink: string | undefined
}

/**
 * Component that shows register energy provider success.
 *
 * @returns Register Energy provider success JSX.
 */
export const RegisterEnergyProviderSuccess = () => {
    const history = useHistory()
    const { formatMessage } = useIntl()
    const { displayEnergyProviderSubscribeForm } = useRegisterToEnergyProvider()
    const {
        state: { energyProviderFormLink },
    } = useLocation<RegisterEnergyProviderSuccessLocation>()

    useEffect(() => {
        if (!energyProviderFormLink) {
            history.push(URL_LOGIN)
        }
    }, [history, energyProviderFormLink])

    const registerSuccessMessage = `La première étape de votre inscription a été prise en compte. Pour la poursuivre, procédez à la souscription chez ${energyProviderName}`

    /**
     *  Subscribe to Energy Provider button handler.
     */
    const displayEnergyProviderFormHandler = () => {
        if (energyProviderFormLink) {
            displayEnergyProviderSubscribeForm(energyProviderFormLink)
        }
    }

    return (
        <div className="register-energy-provider-success-container">
            <div className="register-energy-provider-success-content">
                <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card>
                        <MuiCardContent>
                            <TypographyFormatMessage className="description">
                                {registerSuccessMessage}
                            </TypographyFormatMessage>

                            <div className="login-container">
                                <ButtonLoader
                                    variant="contained"
                                    color="primary"
                                    className="w-224 mx-auto mb-16 mt-16"
                                    aria-label="REGISTER"
                                    onClick={displayEnergyProviderFormHandler}
                                    type="submit"
                                >
                                    {formatMessage({
                                        id: `Étape suivante`,
                                        defaultMessage: `Étape suivante`,
                                    })}
                                </ButtonLoader>
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
