import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { HousingInformation } from 'src/modules/MyHouse/components/HousingInformation'
import { BrowserRouter as Router } from 'react-router-dom'

let mockGoBack = jest.fn()

let mockPathname = 'tabs/slug-tab1'
/**
 * Mocking the useLocation used based on url /customers/:customerId/;tab {id, tab} params.
 */
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    /**
     * Mock the react-router useLocation hooks.
     *
     * @returns The react-router useLocation hook.
     */
    useLocation: () => ({
        pathname: mockPathname,
        state: { focusOnInstallationForm: undefined },
    }),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        listen: jest.fn(),
        block: jest.fn(),
        goBack: mockGoBack,
    }),
}))

describe('HousingInformation tests', () => {
    test('when header with retour button is rendered', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <HousingInformation />
            </Router>,
        )

        expect(getByText('Retour')).toBeInTheDocument()
    })
    test('when user click on Retour button, it goes back in history route', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <HousingInformation />
            </Router>,
        )

        userEvent.click(getByText('Retour'))

        expect(mockGoBack).toBeCalled()
    })
    test.todo(
        'when user make changes in the form without saving and click on Retour button, RuotePrompt should be triggered',
    )
})
