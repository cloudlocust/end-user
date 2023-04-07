import { BrowserRouter } from 'react-router-dom'
import { fireEvent, waitFor, act } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { ForgotPassword } from 'src/modules/User/ForgotPassword/ForgotPassword'

const history = createMemoryHistory()

describe('Test ForgotPassword Page', () => {
    test('when click on Revenir à la connexion, the user is taken to /login', async () => {
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <Router history={history}>
                    <ForgotPassword />
                </Router>
            </BrowserRouter>,
        )

        expect(getByText('Récupérez votre mot de passe')).toBeTruthy()
        expect(getByText('Revenir à la connexion')).toBeTruthy()

        act(() => {
            fireEvent.click(getByText('Revenir à la connexion'))
        })

        await waitFor(() => {
            expect(history.location.pathname).toBe('/login')
        })
    })
})
