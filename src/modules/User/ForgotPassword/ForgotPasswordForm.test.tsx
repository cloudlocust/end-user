import { ForgotPasswordForm } from 'src/modules/User/ForgotPassword/ForgotPasswordForm'
import { fireEvent, waitFor, act } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { createMemoryHistory } from 'history'
import { BrowserRouter, Router } from 'react-router-dom'

const history = createMemoryHistory()

const TEST_EMAIL = 'email@email.com'

const mockOnSubmitForgotPassword = jest.fn()

jest.mock('src/modules/User/ForgotPassword/hooks', () => ({
    ...jest.requireActual('src/modules/User/ForgotPassword/hooks'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useForgotPassword: () => ({ isForgotPasswordProgress: false, onSubmitForgotPassword: mockOnSubmitForgotPassword }),
}))

describe('ForgotPasswordForm Test', () => {
    test('when email field is required if wrong email is entered or input is empty', async () => {
        const { getByText, getByRole } = reduxedRender(
            <BrowserRouter>
                <ForgotPasswordForm />
            </BrowserRouter>,
        )

        const emailField = getByRole('textbox')

        fireEvent.input(emailField, { target: { value: 'testText' } })

        await waitFor(() => {
            expect(mockOnSubmitForgotPassword).not.toHaveBeenCalled()
        })

        await waitFor(() => {
            expect(getByText("L'email indiqué est invalide.")).toBeTruthy()
        })

        fireEvent.input(emailField, { target: { value: '' } })

        await waitFor(() => {
            expect(mockOnSubmitForgotPassword).not.toHaveBeenCalled()
        })

        await waitFor(() => {
            expect(getByText('Champ obligatoire non renseigné')).toBeTruthy()
        })
    })
    test('when email is submitted, user is redirect to /forgot-password-success', async () => {
        const { getByText, getByRole } = reduxedRender(
            <BrowserRouter>
                <Router history={history}>
                    <ForgotPasswordForm />
                </Router>
            </BrowserRouter>,
        )

        const emailField = getByRole('textbox')

        act(() => {
            fireEvent.input(emailField, { target: { value: TEST_EMAIL } })
            fireEvent.click(getByText('Envoyer'))
        })

        await waitFor(() => {
            expect(emailField).not.toBeNull()
            expect(mockOnSubmitForgotPassword).toBeCalled()
        })
    })
})
