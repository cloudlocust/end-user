import { ButtonLoader, PasswordField, TextField } from 'src/common/ui-kit'
import { Form, email, regex, repeatPassword, requiredBuilder } from 'src/common/react-platform-components'
import { IUserRegister, civilityEnum } from 'src/modules/User/model'
import { MenuItem, TextField as MuiTextFieldSelect } from '@mui/material'
import React, { useRef } from 'react'
import {
    allowedZipCodesInRegistration,
    isBowattsNrLinkForm,
    isProfessionalRegisterFeature,
} from 'src/modules/User/Register/RegisterConfig'
import { convertUserDataToQueryString, sirenFieldRegex } from 'src/modules/User/Register/utils'
import { generalTermsOfUse, privacyPolicy } from 'src/modules/Mentions/MentionsConfig'

import Checkbox from '@mui/material/Checkbox'
import { DatePicker } from 'src/common/ui-kit/form-fields/DatePicker'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import { FormHelperText } from '@mui/material'
import { GoogleMapsAddressAutoCompleteField } from 'src/common/ui-kit/form-fields/GoogleMapsAddressAutoComplete/GoogleMapsAddressAutoCompleteField'
import { LinkRedirection } from 'src/modules/utils/LinkRedirection'
import { PhoneNumber } from 'src/common/ui-kit/form-fields/phoneNumber/PhoneNumber'
import { Select } from 'src/common/ui-kit/form-fields/Select'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { linksColor } from 'src/modules/utils/muiThemeVariables'
import { passwordFieldValidationSecurity1 } from 'src/modules/utils'
import { useIntl } from 'react-intl'
import { useRegister } from 'src/modules/User/Register/hooks'

/**
 * Civility Option has two properties: (label that shown in the front visual) and (value that goes to the backend).
 *
 * @returns List of civility options.
 */
const getCivilityOptionsList = () => {
    const baseOptions = [
        { label: 'Mr', value: civilityEnum.MONSIEUR },
        { label: 'Mme', value: civilityEnum.MADAME },
    ]
    if (isBowattsNrLinkForm) {
        baseOptions.push({ label: 'Non précisé', value: civilityEnum.NON_PRECISE })
    }
    return baseOptions
}

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
    defaultRole = 'enduser',
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
    const [isProfessionelFields, setIsProfessionalFields] = React.useState(false)
    const { formatMessage } = useIntl()
    const primaryMainColor = 'primary.main'
    const linkColor = linksColor || primaryMainColor

    /**
     * Handle Change of the checkbox.
     *
     * @param event Event.
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRgpdCheckboxState(event.target.checked)
    }

    /**
     * OnSubmit wrapper for register form.
     *
     * @param param0 N/A.
     * @param param0.repeatPwd Repeated password.
     * @returns OnSubmit.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    const onSubmitWrapper = async ({ repeatPwd, ...cleanData }: { repeatPwd: string } & IUserRegister) => {
        if (rgpdCheckboxState !== true) {
            setRgpdCheckboxState('')
            return
        }

        // If BôWatts-nrLINK form is enabled, redirect directly to Alpiq without registration
        if (isBowattsNrLinkForm) {
            const queryString = convertUserDataToQueryString({
                ...cleanData,
                role: defaultRole,
            })
            const alpiqUrl = `https://particuliers.alpiq.fr/souscription-bowatts/1?${queryString}`
            window.location.href = alpiqUrl
            return
        }

        onSubmit(
            {
                ...cleanData,
                role: defaultRole,
            },
            allowedZipCodesInRegistration,
        )
    }

    return (
        <Form onSubmit={onSubmitWrapper}>
            {/* register your input into the hook by invoking the "register" function */}
            <div className="flex flex-col justify-center w-full">
                {isProfessionalRegisterFeature && (
                    <>
                        <MuiTextFieldSelect
                            select
                            label="Vous êtes"
                            sx={{ marginBottom: '0' }}
                            defaultValue={'Particulier'}
                        >
                            <MenuItem value="Particulier" onClick={() => setIsProfessionalFields(false)}>
                                <TypographyFormatMessage>Particulier</TypographyFormatMessage>
                            </MenuItem>
                            <MenuItem value="Professionnel" onClick={() => setIsProfessionalFields(true)}>
                                <TypographyFormatMessage>Professionnel</TypographyFormatMessage>
                            </MenuItem>
                        </MuiTextFieldSelect>
                        {isProfessionelFields && (
                            <>
                                <TextField
                                    name="companyName"
                                    label="Raison sociale"
                                    validateFunctions={[requiredBuilder()]}
                                    variant="outlined"
                                    style={{ margin: isProfessionelFields && '1.25rem 0' }}
                                />
                                <TextField
                                    name="siren"
                                    label="Siren"
                                    validateFunctions={[
                                        requiredBuilder(),
                                        regex(sirenFieldRegex, 'Le numéro Siren doit être composé de 9 chiffres'),
                                    ]}
                                    variant="outlined"
                                    style={{ marginBottom: '0' }}
                                />
                            </>
                        )}
                    </>
                )}
                <Select
                    name="civility"
                    label="Civilité"
                    validateFunctions={[requiredBuilder()]}
                    sx={{ margin: '0 0 1.25rem 0' }}
                    children={getCivilityOptionsList().map((civility) => {
                        return <MenuItem value={civility.value}>{civility.label}</MenuItem>
                    })}
                    formControlProps={{
                        margin: 'normal',
                    }}
                />
                {isBowattsNrLinkForm && (
                    <TypographyFormatMessage
                        className="text-13 mb-20 text-center font-medium"
                        sx={{
                            color: primaryMainColor,
                            padding: '12px 16px',
                            borderRadius: '4px',
                            border: '2px solid',
                            borderColor: primaryMainColor,
                        }}
                    >
                        Si vous souscrivez, ces informations apparaitront sur votre facture
                    </TypographyFormatMessage>
                )}
                <TextField
                    name="firstName"
                    label={isBowattsNrLinkForm ? 'Prénom' : "Prénom présent sur votre facture d'électricité"}
                    validateFunctions={[requiredBuilder()]}
                    variant="outlined"
                />
                <TextField
                    name="lastName"
                    label={isBowattsNrLinkForm ? 'Nom' : "Nom présent sur votre facture d'électricité"}
                    validateFunctions={[requiredBuilder()]}
                />
                <TextField
                    inputProps={{ style: { textTransform: 'lowercase' } }}
                    name="email"
                    label="Email"
                    validateFunctions={[requiredBuilder(), email()]}
                />
                <PhoneNumber
                    name="phone"
                    label="Numéro de téléphone"
                    // type="tel" allows to have the country phone code
                    type="tel"
                    sx={{ margin: '0 0 1.25rem 0' }}
                    validateFunctions={[requiredBuilder()]}
                />
                <GoogleMapsAddressAutoCompleteField
                    name="address"
                    validateFunctions={[requiredBuilder()]}
                    hideAddressAddition={isBowattsNrLinkForm}
                />
                {!isBowattsNrLinkForm && (
                    <DatePicker
                        name="birthdate"
                        label={formatMessage({
                            id: 'Date de naissance (optionnel)',
                            defaultMessage: 'Date de naissance (optionnel)',
                        })}
                        textFieldProps={{
                            style: {
                                margin: '0 0 20px 0',
                            },
                        }}
                    />
                )}
                <PasswordField
                    name="password"
                    label="Mot de passe"
                    inputRef={passwordRef}
                    validateFunctions={[
                        requiredBuilder(),
                        regex(
                            passwordFieldValidationSecurity1,
                            'Votre mot de passe doit contenir au moins 8 caractères dont 1 Maj, 1 min, 1 chiffre et un caractère spécial',
                        ),
                    ]}
                />
                <PasswordField
                    name="repeatPwd"
                    label="Confirmation de mot de passe"
                    validateFunctions={[requiredBuilder(), repeatPassword(passwordRef)]}
                />

                {isBowattsNrLinkForm ? (
                    <div style={{ marginBottom: '16px' }}>
                        <p style={{ marginBottom: '8px' }}>
                            Ce formulaire permet de vous rediriger sur la page de notre fournisseur, Alpiq. Les
                            informations récoltées sont utilisées afin de :
                        </p>
                        <ul style={{ paddingLeft: '20px', marginTop: '0', marginBottom: '8px', listStyleType: 'disc' }}>
                            <li>préparer votre estimation</li>
                            <li>préparer votre compte nrLINK</li>
                        </ul>
                        <p style={{ marginTop: '8px' }}>
                            Vous pouvez retrouver plus d'informations sur vos droits via notre{' '}
                            <LinkRedirection
                                url="https://www.bowattsbeaujolais.fr/pdf/Politique_de_Confidentialité_BoWatts.pdf"
                                label="Politique de Confidentialité"
                                color={linkColor}
                            />
                            .
                        </p>
                    </div>
                ) : (
                    <span>
                        {formatMessage({
                            id: ` Les informations récoltées dans ce formulaire sont utilisées afin de vous permettre de rejoindre la
                                    plateforme et suivre votre consommation. Vous pouvez retrouver plus d'informations sur vos droits
                                    via notre `,
                            defaultMessage: ` Les informations récoltées dans ce formulaire sont utilisées afin de vous permettre de rejoindre la
                                    plateforme et suivre votre consommation. Vous pouvez retrouver plus d'informations sur vos droits
                                    via notre `,
                        })}
                        <LinkRedirection url={privacyPolicy} label="Politique de Confidentialité" color={linkColor} />
                    </span>
                )}
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
                                    url={generalTermsOfUse}
                                    label="Conditions Générales d'Utilisation"
                                    color={linkColor}
                                />
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
                    {isBowattsNrLinkForm
                        ? 'En validant, vous serez redirigé sur le site Alpiq'
                        : formatMessage({
                              id: 'Submit',
                              defaultMessage: 'Valider',
                          })}
                </ButtonLoader>
            </div>
        </Form>
    )
}
