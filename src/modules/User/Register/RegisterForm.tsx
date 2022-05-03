import React, { useRef } from 'react'
import { useIntl } from 'react-intl'
import { email, requiredBuilder, repeatPassword, Form, min } from 'src/common/react-platform-components'
import { TextField, PasswordField, ButtonLoader } from 'src/common/ui-kit'
import { GoogleMapsAddressAutoCompleteField } from 'src/common/ui-kit/form-fields/GoogleMapsAddressAutoComplete/GoogleMapsAddressAutoCompleteField'
import { useRegister } from 'src/modules/User/Register/hooks'
import { IUserRegister } from '../model'
import { PhoneNumber } from 'src/common/ui-kit/form-fields/phoneNumber/PhoneNumber'
import FormControlLabel from '@mui/material/FormControlLabel'
import MuiLink from '@mui/material/Link'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import { FormHelperText } from '@mui/material'

/**
 * Form used for user registration. This is a component based on form hooks.
 *
 * @param root0 N/A.
 * @param root0.registerHook React hook that handles all logical treatment. It has a default value.
 * @param root0.defaultRole Default role to send.
 * @returns Fegister form component.
 */
export const RegisterForm = ({
    registerHook = useRegister,
    defaultRole,
}: /**
 *
 */
{
    /**
     *
     */
    registerHook?: typeof useRegister
    /**
     *
     */
    defaultRole?: string
}) => {
    const { isRegisterInProgress, onSubmit } = registerHook()
    const passwordRef = useRef()
    const [rgpdCheckboxState, setRgpdCheckboxState] = React.useState<Boolean | string>('false')
    const { formatMessage } = useIntl()

    /**
     * Handle Change of the checkbox.
     *
     * @param event Event.
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRgpdCheckboxState(event.target.checked)
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    const onSubmitWrapper = async ({ repeatPwd, ...cleanData }: { repeatPwd: string } & IUserRegister) => {
        if (rgpdCheckboxState !== true) {
            setRgpdCheckboxState('')
            return
        }
        if (defaultRole !== undefined) {
            onSubmit({ ...cleanData, role: defaultRole })
        } else {
            onSubmit(cleanData)
        }
    }
    return (
        <Form
            // eslint-disable-next-line jsdoc/require-jsdoc
            onSubmit={onSubmitWrapper}
        >
            {/* register your input into the hook by invoking the "register" function */}
            <div className="flex flex-col justify-center w-full">
                <TextField name="firstName" label="Prénom" validateFunctions={[requiredBuilder()]} variant="outlined" />
                <TextField name="lastName" label="Nom" validateFunctions={[requiredBuilder()]} />
                <TextField name="email" label="Email" validateFunctions={[requiredBuilder(), email()]} />
                <PhoneNumber
                    name="phone"
                    label="Numéro de téléphone"
                    // type="tel" allows to have the country phone code
                    type="tel"
                    sx={{ margin: '0 0 1.25rem 0' }}
                    validateFunctions={[requiredBuilder()]}
                />
                <GoogleMapsAddressAutoCompleteField name="address" validateFunctions={[requiredBuilder()]} />
                <PasswordField
                    name="password"
                    label="Mot de passe"
                    inputRef={passwordRef}
                    validateFunctions={[requiredBuilder(), min(8)]}
                />
                <PasswordField
                    name="repeatPwd"
                    label="Confirmation de mot de passe"
                    validateFunctions={[requiredBuilder(), repeatPassword(passwordRef)]}
                />
                {/* TODO Create a checkbox reusable component */}
                <FormControl required error={rgpdCheckboxState === ''}>
                    <FormControlLabel
                        sx={{ marginLeft: '0px', pointerEvents: 'none' }}
                        control={
                            <Checkbox
                                color="primary"
                                value={Boolean(rgpdCheckboxState)}
                                defaultChecked={false}
                                onChange={handleChange}
                                sx={{ pointerEvents: 'auto' }}
                                name="rgpdCheckbox"
                            />
                        }
                        label={
                            <span>
                                {formatMessage({
                                    id: `J’ai lu et j’accepte les`,
                                    defaultMessage: `J’ai lu et j’accepte les`,
                                })}{' '}
                                <MuiLink
                                    sx={{
                                        color:
                                            // eslint-disable-next-line jsdoc/require-jsdoc
                                            (theme) => theme.palette.primary.light,
                                        pointerEvents: 'visible',
                                    }}
                                    onClick={(e: React.SyntheticEvent) => {
                                        // Handling onClick with (preventDefault and window.open) because we're using FormControlLabel, which when you click the label (even if it has link inside) it'll behave as if we clicked on the control
                                        // In our case the checkbox, it means when if we click on the label even if we have a link in the label and we click on it, it will check the checkbox instead of redirecting
                                        // That's why i handle the onClick on the link itself, so that i prevent the default of checkbox clicking through the label
                                        e.preventDefault()
                                        window.open(window._env_.REACT_APP_CLIENT_RGPD_REDIRECT, '_blank')
                                    }}
                                >
                                    {formatMessage({
                                        id: 'conditions générales',
                                        defaultMessage: 'conditions générales',
                                    })}
                                </MuiLink>{' '}
                                {formatMessage({
                                    id: `d’utilisation`,
                                    defaultMessage: `d’utilisation`,
                                })}
                            </span>
                        }
                        labelPlacement="end"
                    />
                    {rgpdCheckboxState === '' && (
                        <FormHelperText>
                            {formatMessage({
                                id: `Ce champ est obligatoire`,
                                defaultMessage: `Ce champ est obligatoire`,
                            })}
                        </FormHelperText>
                    )}
                </FormControl>
                <ButtonLoader
                    variant="contained"
                    color="primary"
                    className="w-224 mx-auto mt-16"
                    inProgress={isRegisterInProgress}
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
