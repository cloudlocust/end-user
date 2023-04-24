import { BrowserRouter as Router } from 'react-router-dom'
import { waitFor } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import ForgotPasswordSuccess from 'src/modules/User/ForgotPassword/containers/ForgotPasswordSuccess/ForgotPasswordSuccess'
import { TEST_SUCCESS_MAIL } from 'src/mocks/handlers/user'

const mockReplaceHistory = jest.fn()
let mockLocationEmailState = TEST_SUCCESS_MAIL
// Mock react-router
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useLocation: () => ({
        state: { email: mockLocationEmailState },
    }),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        replace: mockReplaceHistory,
    }),
}))
describe('Test ForgotPasswordSuccess Page', () => {
    test('when there is email state in the location object, ForgotPasswordSuccess is shown', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <ForgotPasswordSuccess />
            </Router>,
        )

        expect(getByText('Email envoyé !')).toBeTruthy()
    })
    test('when no email state in the location object, the user is taken to /login', async () => {
        mockLocationEmailState = ''
        const { getByText } = reduxedRender(
            <Router>
                <ForgotPasswordSuccess />
            </Router>,
        )

        await waitFor(() => {
            expect(mockReplaceHistory).toHaveBeenCalledWith('/login')
        })
        expect(() => getByText('Email envoyé !')).toThrow()
    })
})
