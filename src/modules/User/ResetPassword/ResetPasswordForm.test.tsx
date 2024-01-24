import { ResetPasswordForm } from 'src/modules/User/ResetPassword/ResetPasswordForm'
import { waitFor } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import userEvent from '@testing-library/user-event'
import { passwordQuerySelector } from 'src/helpers/testVariables'

const fakeToken = '123456ABCD'

const mockOnSubmitResetPassword = jest.fn()
const SUBMIT_TEXT = 'Confirmer'
const INVALID_PASSWORD_FIELD_ERROR =
    'Votre mot de passe doit contenir au moins 8 caractères dont 1 Maj, 1 min, 1 chiffre et un caractère spécial'

jest.mock('src/modules/User/ResetPassword/hooks', () => ({
    ...jest.requireActual('src/modules/User/ResetPassword/hooks'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useResetPassword: () => ({ isResetPasswordProgress: false, onSubmitResetPassword: mockOnSubmitResetPassword }),
}))

describe('RestPasswordForm component test', () => {
    test('when password fields are empty, a validator error should appear', async () => {
        const { getByText, container } = reduxedRender(<ResetPasswordForm token={fakeToken} />)

        // eslint-disable-next-line sonarjs/no-duplicate-string
        const passwordField = container.querySelector('input[name="password"]') as Element
        userEvent.type(passwordField, '')
        // eslint-disable-next-line sonarjs/no-duplicate-string
        const repeatPasswordField = container.querySelector('input[name="repeatPwd"]') as Element
        userEvent.type(repeatPasswordField, '')

        await waitFor(() => {
            expect(mockOnSubmitResetPassword).not.toHaveBeenCalled()
        })

        await waitFor(() => {
            expect(getByText('Champ obligatoire non renseigné')).toBeTruthy()
        })
    })

    test('when password field is invalid', async () => {
        const { container, getByText, getAllByText } = reduxedRender(<ResetPasswordForm token={fakeToken} />)
        const passwordField = container.querySelector(passwordQuerySelector) as Element
        userEvent.type(passwordField, '123')
        userEvent.click(getByText(SUBMIT_TEXT))
        await waitFor(() => expect(getAllByText(INVALID_PASSWORD_FIELD_ERROR).length).toBe(1))
    })

    test('when entering unmatched passwords, a validation error should appear', async () => {
        const { getByText, container } = reduxedRender(<ResetPasswordForm token={fakeToken} />)

        const passwordField = container.querySelector('input[name="password"]') as Element
        userEvent.type(passwordField, 'P@ssword1')
        const repeatPasswordField = container.querySelector('input[name="repeatPwd"]') as Element
        userEvent.type(repeatPasswordField, '123')

        await waitFor(() => {
            expect(mockOnSubmitResetPassword).not.toHaveBeenCalled()
        })

        await waitFor(() => {
            expect(getByText('Les mot de passes ne correspondent pas.')).toBeTruthy()
        })
    })
    test('when filling both passwords and clicking Confirmer, a function is called', async () => {
        const { getByText, container } = reduxedRender(<ResetPasswordForm token={fakeToken} />)

        const passwordField = container.querySelector('input[name="password"]') as Element
        userEvent.type(passwordField, 'P@ssword1')
        const repeatPasswordField = container.querySelector('input[name="repeatPwd"]') as Element
        userEvent.type(repeatPasswordField, 'P@ssword1')

        userEvent.click(getByText(SUBMIT_TEXT))

        await waitFor(() => {
            expect(mockOnSubmitResetPassword).toHaveBeenCalledWith({
                password: 'P@ssword1',
                token: fakeToken,
            })
        })
    })
})
