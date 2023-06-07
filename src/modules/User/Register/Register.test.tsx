import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter, MemoryRouter, Route } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import Register from 'src/modules/User/Register/Register'

// eslint-disable-next-line jsdoc/require-jsdoc
const RegisterForm = ({ defaultRole }: { defaultRole: string }) => {
    return (
        <>
            <div>{defaultRole}</div>
            <div>Register form</div>
        </>
    )
}

const REGISTER_TEXT = 'Inscription'
const HAVE_ALREADY_ACCOUNT_TEXT = 'Vous avez déjà un compte ?'
const LOGIN_TEXT = 'Se connecter'

describe('Register component', () => {
    test('register component text is rendered', async () => {
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <Register registerForm={<RegisterForm defaultRole="enduser" />} />
            </BrowserRouter>,
        )

        expect(getByText(REGISTER_TEXT)).toBeInTheDocument()
        expect(getByText('Register form')).toBeInTheDocument()
        expect(getByText('enduser')).toBeInTheDocument()
        expect(getByText(HAVE_ALREADY_ACCOUNT_TEXT)).toBeInTheDocument()
        expect(getByText(LOGIN_TEXT)).toBeInTheDocument()
    })
    test("when clicked on don't have account", async () => {
        const { getByText } = reduxedRender(
            <MemoryRouter initialEntries={['/register']}>
                <BrowserRouter>
                    <Register registerForm={<RegisterForm defaultRole="enduser" />} />
                    <Route path="/login" component={() => <div>login</div>} />
                </BrowserRouter>
            </MemoryRouter>,
        )

        userEvent.click(getByText(LOGIN_TEXT))

        await waitFor(() => {
            expect(getByText('login')).toBeInTheDocument()
        })
    })
})
