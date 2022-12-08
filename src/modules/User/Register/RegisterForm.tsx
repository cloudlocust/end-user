import React, { useRef } from 'react'
import { useIntl } from 'react-intl'
import { email, requiredBuilder, repeatPassword, Form, min, regex } from 'src/common/react-platform-components'
import { TextField, PasswordField, ButtonLoader } from 'src/common/ui-kit'
import { GoogleMapsAddressAutoCompleteField } from 'src/common/ui-kit/form-fields/GoogleMapsAddressAutoComplete/GoogleMapsAddressAutoCompleteField'
import { useRegister } from 'src/modules/User/Register/hooks'
import { IUserRegister } from '../model'
import { PhoneNumber } from 'src/common/ui-kit/form-fields/phoneNumber/PhoneNumber'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import { FormHelperText } from '@mui/material'
import { LinkRedirection } from 'src/modules/utils/LinkRedirection'
import { passwordFieldValidationSecurity1 } from 'src/modules/utils'

const urlLegalNotice = 'https://www.myem.fr/mentions-legales/'
const urlPolitiqueConfidentialité = 'https://drive.google.com/uc?export=download&id=18agpXAw89RX5Zk87EQ9ev5LOeMU3GtnP'
/**
 * Form used for user registration. This is a component based on form hooks.
 *
 * @param root0 N/A.
 * @param root0.registerHook React hook that handles all logical treatment. It has a default value.
 * @param root0.defaultRole Default role to send.
 * @returns Register form component.
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
        <Form onSubmit={onSubmitWrapper}>
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
                    validateFunctions={[
                        requiredBuilder(),
                        min(8),
                        regex(
                            passwordFieldValidationSecurity1,
                            'Votre mot de passe doit contenir au moins 8 caractères dont 1 Maj, 1 min et un caractère spécial',
                        ),
                    ]}
                />
                <PasswordField
                    name="repeatPwd"
                    label="Confirmation de mot de passe"
                    validateFunctions={[requiredBuilder(), repeatPassword(passwordRef)]}
                />

                <span>
                    {formatMessage({
                        id: ` Les informations récoltées dans ce formulaire sont utilisées afin de vous permettre de rejoindre la
                                    plateforme et suivre votre consommation. Vous pouvez retrouver plus d'informations sur vos droits
                                    via notre `,
                        defaultMessage: ` Les informations récoltées dans ce formulaire sont utilisées afin de vous permettre de rejoindre la
                                    plateforme et suivre votre consommation. Vous pouvez retrouver plus d'informations sur vos droits
                                    via notre `,
                    })}
                    <LinkRedirection
                        url={urlPolitiqueConfidentialité}
                        label="Politique de Confidentialité"
                        color="primary.light"
                    />
                </span>
                {/* TODO Create a checkbox reusable component */}
                <FormControl required error={rgpdCheckboxState === ''}>
                    <FormControlLabel
                        sx={{ marginLeft: '0px', pointerEvents: 'none', marginTop: '10px' }}
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
                                    id: `J’ai lu et j’accepte les `,
                                    defaultMessage: `J’ai lu et j’accepte les `,
                                })}
                                <LinkRedirection
                                    url={urlLegalNotice}
                                    label="Conditions Générales d’Utilisation"
                                    color="primary.light"
                                />
                                {formatMessage({
                                    id: ` et de `,
                                    defaultMessage: ` et de `,
                                })}
                                <LinkRedirection url={urlLegalNotice} label="Vente" color="primary.light" />
                                {formatMessage({
                                    id: ` de la plateforme`,
                                    defaultMessage: ` de la plateforme`,
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
