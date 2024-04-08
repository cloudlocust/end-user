import { BrowserRouter as Router } from 'react-router-dom'
import { waitFor } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { URL_NRLINK_CONNECTION_STEPS, NrLinkConnection } from 'src/modules/nrLinkConnection'
import { URL_DASHBOARD } from 'src/modules/Dashboard/DashboardConfig'

const CONNECT_NRLINK_BTN_TEXT = 'Je connecte mon nrLINK'
const SKIP_LINK_TEXT = 'Passer cette étape'
const mockHistoryPush = jest.fn()
let mockIsGetShowNrLinkLoading = false
let mockIsNrLinkPopupShowing = false

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}))

jest.mock('src/modules/nrLinkConnection/NrLinkConnectionHook', () => ({
    ...jest.requireActual('src/modules/nrLinkConnection/NrLinkConnectionHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useGetShowNrLinkPopupHook: () => ({
        isNrLinkPopupShowing: mockIsNrLinkPopupShowing,
        isGetShowNrLinkLoading: mockIsGetShowNrLinkLoading,
    }),
}))

/* eslint-disable-next-line jsdoc/require-jsdoc */
const NrLinkConnectionRouter = () => (
    <Router>
        <NrLinkConnection />
    </Router>
)
describe('Test NrLinkConnection Page', () => {
    test('When response getShowNrLinkPopup false, it should redirect from NrLinkConnection', async () => {
        // mockIsGetShowNrLink is false by default
        reduxedRender(<NrLinkConnectionRouter />)

        await waitFor(() => {
            expect(mockHistoryPush).toHaveBeenCalledWith(URL_DASHBOARD)
        })
    }, 10000)
    test('When response getShowNrLinkPopup true, it should not redirect from NrLinkConnection', async () => {
        mockIsNrLinkPopupShowing = true
        reduxedRender(<NrLinkConnectionRouter />)

        await waitFor(() => {
            expect(mockHistoryPush).not.toHaveBeenCalled()
        })
    }, 10000)
    test('When getShowNrLink is Loading, it should display loading component', async () => {
        mockIsGetShowNrLinkLoading = true
        const { getByText } = reduxedRender(<NrLinkConnectionRouter />)

        await waitFor(() => {
            expect(getByText('Chargement...')).toBeTruthy()
        })

        mockIsGetShowNrLinkLoading = false
    }, 10000)
    test('When clicking on CTA button connect nrLINK, it should redirect to nrLinkConnectionStep', async () => {
        const { getByText } = reduxedRender(<NrLinkConnectionRouter />)
        await waitFor(() => {
            expect(getByText(CONNECT_NRLINK_BTN_TEXT)).toBeTruthy()
        })
        // https://stackoverflow.com/a/57907719/13145536
        // jsdom is simulating a browser but it has some limitations.
        // One of these limitations is the fact that you can't change the location.
        // If you want to test that your link works I suggest to check the href attribute of your <a>:
        expect(getByText(CONNECT_NRLINK_BTN_TEXT).closest('a')).toHaveAttribute('href', URL_NRLINK_CONNECTION_STEPS)
    })
    test('When clicking on Skip nrLinkConnection Link, it should redirect to URL_DASHBOARD', async () => {
        const { getByText } = reduxedRender(<NrLinkConnectionRouter />)
        await waitFor(() => {
            expect(getByText(SKIP_LINK_TEXT)).toBeTruthy()
        })
        expect(getByText(SKIP_LINK_TEXT).closest('a')).toHaveAttribute('href', URL_DASHBOARD)
    })
})
