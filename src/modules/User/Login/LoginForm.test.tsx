import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ByRoleMatcher, ByRoleOptions, fireEvent, screen, waitFor, act } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { LoginForm } from 'src/modules/User/Login/LoginForm'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'

const history = createMemoryHistory()

const TEST_EMAIL = 'email@email.com'
const FORGOT_PASSWORD_TEXT = 'Mot de passe oublié?'

/**
 * This function return a function that trigger a submit using valid data.
 *
 * @param getByRole GetbyRole function from react tl used as closure.
 * @param container Container function from react tl used as closure.
 * @returns Async function to trigger submit of valid data.
 */
function submitWithValidData(
    getByRole: (
        text: ByRoleMatcher,
        options?: ByRoleOptions | undefined,
        waitForElementOptions?: unknown,
    ) => HTMLElement,
    container: HTMLElement,
): () => Promise<void> {
    return async function () {
        const emailField = getByRole('textbox')
        fireEvent.input(emailField, { target: { value: TEST_EMAIL } })
        // Be careful password is not a role
        //https://github.com/testing-library/dom-testing-library/issues/567
        // To get the element password you can use this: const getByLabelText(/password/i)
        // if you want to fire event you must use this:
        // https://github.com/testing-library/react-testing-library/issues/359#issuecomment-489699964
        const passwordField = container.querySelector('input[name="password"]')
        expect(passwordField).not.toBe(null)
        // This condition is only to prevent tscript from yelling.
        if (passwordField !== null) {
            fireEvent.input(passwordField, { target: { value: '123456' } })
        }
        fireEvent.click(screen.getByText('Valider'))
    }
}

const mockOnSubmit = jest.fn((data) => null)

jest.mock('src/modules/User/Login/hooks', () => ({
    ...jest.requireActual('src/modules/User/Login/hooks'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useLogin: () => ({
        isLoginInProgress: false,
        onSubmit: mockOnSubmit,
    }),
}))
describe('test loginForm', () => {
    test('Email and password required', async () => {
        const { getAllByText, getByText } = reduxedRender(
            <BrowserRouter>
                <LoginForm />
            </BrowserRouter>,
        )
        await act(async () => {
            fireEvent.click(getByText('Valider'))
        })
        expect(mockOnSubmit).not.toHaveBeenCalled()
        expect(getAllByText('Champ obligatoire non renseigné').length).toBe(2)
    })
    test('Email format validation', async () => {
        const { getByRole, getAllByText } = reduxedRender(
            <BrowserRouter>
                <LoginForm />
            </BrowserRouter>,
        )
        await act(async () => {
            const emailField = getByRole('textbox')
            fireEvent.input(emailField, { target: { value: '123456' } })
            fireEvent.click(screen.getByText('Valider'))
        })
        expect(mockOnSubmit).not.toHaveBeenCalled()
        expect(getAllByText("L'email indiqué est invalide.").length).toBe(1)
    })
    test('Normal case with call to submit', async () => {
        const { getByRole, container } = reduxedRender(
            <BrowserRouter>
                <LoginForm />
            </BrowserRouter>,
        )
        await act(submitWithValidData(getByRole, container))
        expect(mockOnSubmit).toHaveBeenCalledWith({ email: TEST_EMAIL, password: '123456' }, expect.anything())
    })
    test('Custom hook', async () => {
        const mockCustomOnSubmit = jest.fn(async (data) => {})

        const { getByRole, container } = reduxedRender(
            <BrowserRouter>
                <LoginForm
                    loginHook={() => ({
                        isLoginInProgress: false,
                        onSubmit: mockCustomOnSubmit,
                    })}
                />
            </BrowserRouter>,
        )
        await act(submitWithValidData(getByRole, container))
        expect(mockCustomOnSubmit).toHaveBeenCalledWith({ email: TEST_EMAIL, password: '123456' }, expect.anything())
    })
})

describe('Forgot password route', () => {
    test('when user click on "Mot de passé oublié?" they are redirected to forgot password route', async () => {
        const { getByText, getByRole } = reduxedRender(
            <Router history={history}>
                <LoginForm />
            </Router>,
        )

        expect(getByText(FORGOT_PASSWORD_TEXT)).toBeTruthy()

        act(() => {
            fireEvent.click(getByRole('link', { name: FORGOT_PASSWORD_TEXT }))
        })

        await waitFor(() => {
            expect(history.location.pathname).toBe('/forgot-password')
        })
    })
})
