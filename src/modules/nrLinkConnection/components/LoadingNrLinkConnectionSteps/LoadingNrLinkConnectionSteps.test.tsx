import { reduxedRender } from 'src/common/react-platform-components/test'
import { LoadingNrLinkConnectionSteps } from 'src/modules/nrLinkConnection'

const mockHistoryPush = jest.fn()

const loadingButtonClassName = '.MuiCircularProgress-root '

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}))
describe('Test LoadingNrLinkConnectionSteps Page', () => {
    test('Loading Spinner NrLinkConnection', async () => {
        const { container, getByText } = reduxedRender(<LoadingNrLinkConnectionSteps />)
        expect(container.querySelector(loadingButtonClassName)).toBeInTheDocument()
        expect(
            getByText('Plus que quelques secondes de patience, nous connectons votre nrLINK à votre espace personnel.'),
        ).toBeInTheDocument()
    })
})
