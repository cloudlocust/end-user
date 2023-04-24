import { FC } from 'react'
import { email, requiredBuilder, Form } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { TextField, ButtonLoader } from 'src/common/ui-kit'
import { useForgotPassword } from 'src/modules/User/ForgotPassword/hooks'

/**
 * Forgot password form, this form is based on react hooks.
 *
 * @returns Forgot password form.
 */
export const ForgotPasswordForm: FC = () => {
    const { formatMessage } = useIntl()
    const { isForgotPasswordProgress, onSubmitForgotPassword } = useForgotPassword()

    return (
        <Form onSubmit={onSubmitForgotPassword}>
            <div className="flex flex-col justify-center w-full">
                <TextField name="email" label="Email" validateFunctions={[requiredBuilder(), email()]} />

                <ButtonLoader inProgress={isForgotPasswordProgress} type="submit" className="w-224 mx-auto mt-16">
                    {formatMessage({ id: 'Envoyer', defaultMessage: 'Envoyer' })}
                </ButtonLoader>
            </div>
        </Form>
    )
}
