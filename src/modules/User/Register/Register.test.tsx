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
const TEXT_POPUP_AFTER_REGISTRATION =
    "Munissez vous de votre N° de PDL - présent sur votre facture d'électrcité - et de votre RIB."

let mockIsPopupAfterRegistration = false

jest.mock('src/modules/User/Register/RegisterConfig', () => ({
    ...jest.requireActual('src/modules/User/Register/RegisterConfig'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isPopupAfterRegistration() {
        return mockIsPopupAfterRegistration
    },
}))

describe('Register component', () => {
    test('register component text is rendered', async () => {
        mockIsPopupAfterRegistration = true
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <Register registerForm={<RegisterForm defaultRole="enduser" />} />
            </BrowserRouter>,
        )

        expect(getByText(REGISTER_TEXT)).toBeInTheDocument()
        expect(getByText(TEXT_POPUP_AFTER_REGISTRATION)).toBeInTheDocument()
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
    test('when isPopupAfterRegistration is false', async () => {
        mockIsPopupAfterRegistration = false
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <Register registerForm={<RegisterForm defaultRole="enduser" />} />
            </BrowserRouter>,
        )
        expect(() => getByText(TEXT_POPUP_AFTER_REGISTRATION)).toThrow()
    })
})
