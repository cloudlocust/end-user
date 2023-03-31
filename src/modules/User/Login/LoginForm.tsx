import React from 'react'
import { useIntl } from 'react-intl'
import { email, requiredBuilder, Form } from 'src/common/react-platform-components'
import { TextField, PasswordField, ButtonLoader } from 'src/common/ui-kit'
import { Link } from 'react-router-dom'
import { useLogin } from 'src/modules/User/Login/hooks'
import MuiLink from '@mui/material/Link'
import { linksColor } from 'src/modules/utils/muiThemeVariables'

/**
 * Form used for user login. This component is based on form hooks.
 *
 * @param root0 N/A.
 * @param root0.loginHook React hook that handles all logical treatment.
 * @returns Login form component.
 */
export const LoginForm = ({ loginHook = useLogin }) => {
    const { isLoginInProgress, onSubmit } = loginHook()
    const { formatMessage } = useIntl()

    return (
        // {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
        <Form onSubmit={onSubmit}>
            <div className="flex flex-col justify-center w-full">
                {/* register your input into the hook by invoking the "register" function */}
                <TextField name="email" label="Email" validateFunctions={[requiredBuilder(), email()]} />
                <PasswordField name="password" label="Mot de passe" validateFunctions={[requiredBuilder()]} />
                <div className="mx-auto">
                    <MuiLink
                        component={Link}
                        sx={{
                            color:
                                // eslint-disable-next-line jsdoc/require-jsdoc
                                (theme) => linksColor || theme.palette.primary.main,
                        }}
                        underline="none"
                        to="/forgot-password"
                    >
                        {formatMessage({
                            id: 'Mot de passe oublié?',
                            defaultMessage: 'Mot de passe oublié?',
                        })}
                    </MuiLink>
                </div>
                <ButtonLoader
                    variant="contained"
                    color="primary"
                    className="w-224 mx-auto mt-16"
                    aria-label="LOG IN"
                    inProgress={isLoginInProgress}
                    type="submit"
                >
                    {formatMessage({
                        id: 'Submit',
                        defaultMessage: 'Valider',
                    })}
                </ButtonLoader>
            </div>
        </Form>
    )
}
