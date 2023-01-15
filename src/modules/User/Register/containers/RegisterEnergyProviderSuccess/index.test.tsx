import { reduxedRender } from 'src/common/react-platform-components/test'
import { RegisterEnergyProviderSuccess } from 'src/modules/User/Register/containers/RegisterEnergyProviderSuccess'
import { BrowserRouter as Router } from 'react-router-dom'
import { waitFor } from '@testing-library/react'

const mockPushHistory = jest.fn()
let mockIsAllowed: boolean = true

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useLocation: () => ({
        state: { isAllowed: mockIsAllowed },
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
})
