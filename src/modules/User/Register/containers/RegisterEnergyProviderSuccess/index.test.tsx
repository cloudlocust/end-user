import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { RegisterEnergyProviderSuccess } from 'src/modules/User/Register/containers/RegisterEnergyProviderSuccess'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

const history = createMemoryHistory()

describe('test RegisterEnergyProviderSuccess page', () => {
    test('when message is shown after user enters the page', async () => {
        const { getByText } = reduxedRender(
            <Router history={history}>
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
        const { getByText } = reduxedRender(
            <Router history={history}>
                <RegisterEnergyProviderSuccess />
            </Router>,
        )

        userEvent.click(getByText('Revenir à la connexion'))

        expect(getByText('Revenir à la connexion').closest('a')).toHaveAttribute('href', '/login')

        /**
         * @see https://stackoverflow.com/a/67573449/14005627
         */
        expect(history.location.pathname).toBe('/login')
    })
})
