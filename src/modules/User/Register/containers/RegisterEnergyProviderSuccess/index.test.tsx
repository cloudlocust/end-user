import { reduxedRender } from 'src/common/react-platform-components/test'
import { RegisterEnergyProviderSuccess } from 'src/modules/User/Register/containers/RegisterEnergyProviderSuccess'
import { BrowserRouter as Router } from 'react-router-dom'
import { waitFor } from '@testing-library/react'

const mockPushHistory = jest.fn()
let mockIsAllowed: boolean = true
let mockEnergyProviderSubscribeFormLink: string | undefined = undefined

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useLocation: () => ({
        state: { isAllowed: mockIsAllowed, energyProviderFormLink: mockEnergyProviderSubscribeFormLink },
    }),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        push: mockPushHistory,
    }),
}))

describe('test RegisterEnergyProviderSuccess page', () => {
    test('when message is shown after user enters the page', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <RegisterEnergyProviderSuccess />
            </Router>,
        )

        expect(
            getByText(
                'Votre inscription a bien été prise en compte. Sous réserve que votre souscription chez Alpiq est complète, vous recevrez prochainement un mail de validation de votre inscription à la plateforme',
            ),
        ).toBeTruthy()
    })

    test('when user click on Revenir a la connexion', async () => {
        mockIsAllowed = false
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

    test('should not show subscribe button', async () => {
        const { queryByText } = reduxedRender(
            <Router>
                <RegisterEnergyProviderSuccess />
            </Router>,
        )
        expect(queryByText('REGISTER')).toBeNull()
        // expect(getByRole('button')).toBeNull()
    })

    test('should show subscribe button', async () => {
        mockEnergyProviderSubscribeFormLink = 'https://energy.myem.fr'
        const { getByRole } = reduxedRender(
            <Router>
                <RegisterEnergyProviderSuccess />
            </Router>,
        )
        expect(getByRole('button')).toBeDefined()
    })
})
