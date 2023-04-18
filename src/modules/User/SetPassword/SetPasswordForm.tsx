import React, { useRef } from 'react'
import { requiredBuilder, Form, repeatPassword, accept, regex } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { ButtonLoader, PasswordField, Checkbox } from 'src/common/ui-kit'
import { useResetPassword } from 'src/modules/User/ResetPassword/hooks'
import { ResetPasswordFormProps } from 'src/modules/User/ResetPassword/ResetPasswordFormTypes'
import { LinkRedirection } from 'src/modules/utils/LinkRedirection'
import { onSubmitSetPasswordData } from 'src/modules/User/SetPassword/SetPasswordFormTypes'
import { passwordFieldValidationSecurity1 } from 'src/modules/utils'
import { privacyPolicy } from 'src/modules/Mentions/MentionsConfig'
import { linksColor } from 'src/modules/utils/muiThemeVariables'

const checkoxRequiredErrorText = 'Ce champ est obligatoire'

/**
 * Reset password form.
 *
 * @param props N/A.
 * @param props.token Token retrieved from URL params.
 * @returns Reset Password Form.
 */
export const SetPasswordForm = ({ token }: ResetPasswordFormProps) => {
    const { formatMessage } = useIntl()
    const passwordRef = useRef()
    const { isResetPasswordProgress, onSubmitResetPassword } = useResetPassword()

    // eslint-disable-next-line jsdoc/require-jsdoc
    const onSubmitSetPassword = ({ password, ...restData }: onSubmitSetPasswordData) => {
        onSubmitResetPassword({ password, token })
    }

    return (
        <Form onSubmit={onSubmitSetPassword}>
            <div className="flex flex-col justify-center w-full">
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
                    label="Confirmation du mot de passe"
                    validateFunctions={[requiredBuilder(), repeatPassword(passwordRef)]}
                />
                <Checkbox
                    name="rgpdCheckbox"
                    label={
                        <span>
                            {formatMessage({
                                id: `J’ai lu et j’accepte `,
                                defaultMessage: `J’ai lu et j’accepte `,
                            })}
                            <LinkRedirection
                                url={privacyPolicy}
                                label="la politique de confidentialité"
                                color={linksColor || 'primary.main'}
                            />
                            {formatMessage({
                                id: ` et de l'utilisation de la plateforme`,
                                defaultMessage: ` et de l'utilisation de la plateforme`,
                            })}
                        </span>
                    }
                    validate={[accept(checkoxRequiredErrorText), requiredBuilder(checkoxRequiredErrorText)]}
                />
                <Checkbox
                    name="sgeConsentCheckbox"
                    label={
                        <span>
                            {formatMessage({
                                id: `J'accepte que mes données de consommation et de production soient partagées avec l'installateur et le distributeur à des fins de comparaison pour me conseiller dans mon installation`,
                                defaultMessage: `J'accepte que mes données de consommation et de production soient partagées avec l'installateur et le distributeur à des fins de comparaison pour me conseiller dans mon installation`,
                            })}
                        </span>
                    }
                    validate={[accept(checkoxRequiredErrorText), requiredBuilder(checkoxRequiredErrorText)]}
                />
                <ButtonLoader inProgress={isResetPasswordProgress} type="submit" className="w-224 mx-auto mt-16">
                    {formatMessage({ id: 'Confirmer', defaultMessage: 'Confirmer' })}
                </ButtonLoader>
            </div>
        </Form>
    )
}
