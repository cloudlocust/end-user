import { reduxedRender } from 'src/common/react-platform-components/test'
import { RegisterEnergyProviderSuccess } from 'src/modules/User/Register/containers/RegisterEnergyProviderSuccess'
import { BrowserRouter as Router } from 'react-router-dom'
import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockPushHistory = jest.fn()
let mockEnergyProviderSubscribeFormLink: string | undefined = undefined

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useLocation: () => ({
        state: { energyProviderFormLink: mockEnergyProviderSubscribeFormLink },
    }),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        push: mockPushHistory,
    }),
}))

describe('test RegisterEnergyProviderSuccess page', () => {
    test('should show a success message when enter page', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <RegisterEnergyProviderSuccess />
            </Router>,
        )

        expect(
            getByText(
                'Votre inscription a bien été prise en compte. Pour finaliser cette dernière, vous devez procéder à la souscription chez ALPIQ',
            ),
        ).toBeTruthy()
    })

    test('should have a back to login Link', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <RegisterEnergyProviderSuccess />
            </Router>,
        )

        expect(getByText('Revenir à la connexion').closest('a')).toHaveAttribute('href', '/login')
        await waitFor(() => {
            expect(mockPushHistory).toHaveBeenCalledWith('/login')
        })
    })

    test('should not show subscribe to provider button', async () => {
        const { queryByText } = reduxedRender(
            <Router>
                <RegisterEnergyProviderSuccess />
            </Router>,
        )
        expect(queryByText('REGISTER')).toBeNull()
    })

    test('should show subscribe to provider button', async () => {
        mockEnergyProviderSubscribeFormLink = 'https://energy.myem.fr'
        const { getByRole } = reduxedRender(
            <Router>
                <RegisterEnergyProviderSuccess />
            </Router>,
        )
        expect(getByRole('button')).toBeDefined()
    })

    test('should open a pop-up when calling the Hook', async () => {
        mockEnergyProviderSubscribeFormLink = 'https://energy.myem.fr'

        const mockWindowOpen = jest.fn()
        const originalOpen = window.open
        window.open = mockWindowOpen
        const { getByRole } = reduxedRender(
            <Router>
                <RegisterEnergyProviderSuccess />
            </Router>,
        )
        userEvent.click(getByRole('button'))
        expect(mockWindowOpen).toBeCalledWith(
            mockEnergyProviderSubscribeFormLink,
            '_blank',
            'width=1024,height=768,left=-200,top=-150',
        )

        window.open = originalOpen
    })
})
