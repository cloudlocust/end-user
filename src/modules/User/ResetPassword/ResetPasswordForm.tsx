import { useRef } from 'react'
import { requiredBuilder, Form, repeatPassword, regex } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { ButtonLoader, PasswordField } from 'src/common/ui-kit'
import { useResetPassword } from 'src/modules/User/ResetPassword/hooks'
import { ResetPasswordData, ResetPasswordFormProps } from 'src/modules/User/ResetPassword/ResetPasswordFormTypes'
import { passwordFieldValidationSecurity1 } from 'src/modules/utils'

/**
 * Reset password form.
 *
 * @param props N/A.
 * @param props.token Token retrieved from URL params.
 * @returns Reset Password Form.
 */
export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
    const { formatMessage } = useIntl()
    const passwordRef = useRef()
    const { isResetPasswordProgress, onSubmitResetPassword } = useResetPassword()

    // eslint-disable-next-line jsdoc/require-jsdoc
    const onSubmitResetPasswordWrapper = ({ repeatPwd, ...cleanData }: { repeatPwd: string } & ResetPasswordData) => {
        if (repeatPwd) {
            onSubmitResetPassword({ ...cleanData, token })
        }
    }

    return (
        <Form onSubmit={onSubmitResetPasswordWrapper}>
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
                <ButtonLoader inProgress={isResetPasswordProgress} type="submit" className="w-224 mx-auto mt-16">
                    {formatMessage({ id: 'Confirmer', defaultMessage: 'Confirmer' })}
                </ButtonLoader>
            </div>
        </Form>
    )
}
