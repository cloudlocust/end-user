import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { HousingInformation } from 'src/modules/MyHouse/components/HousingInformation'

let mockGoBack = jest.fn()

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        goBack: mockGoBack,
    }),
}))

let mockPathname = 'tabs/slug-tab1'
/**
 * Mocking the useLocation used based on url /customers/:customerId/;tab {id, tab} params.
 */
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    /**
     * Mock the react-router useLocation hooks.
     *
     * @returns The react-router useLocation hook.
     */
    useLocation: () => ({
        pathname: mockPathname,
    }),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        listen: jest.fn(),
    }),
}))

describe('HousingInformation tests', () => {
    test('when header with retour button is rendered', async () => {
        const { getByText } = reduxedRender(<HousingInformation />)

        expect(getByText('Retour')).toBeInTheDocument()
    })
    test('when user click on Retour button, it goes back in history route', async () => {
        const { getByText } = reduxedRender(<HousingInformation />)

        userEvent.click(getByText('Retour'))

        expect(mockGoBack).toBeCalled()
    })
})
