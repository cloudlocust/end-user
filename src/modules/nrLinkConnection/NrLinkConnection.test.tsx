import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { waitFor } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { URL_NRLINK_CONNECTION_STEPS, NrLinkConnection } from 'src/modules/nrLinkConnection'
import { showNrLinkPopupFalse, showNrLinkPopupTrue, TEST_SUCCESS_USER } from 'src/mocks/handlers/user'
import { applyCamelCase } from 'src/common/react-platform-components'
import { URL_CONSUMPTION } from 'src/modules/MyConsumption'

const userData = applyCamelCase(TEST_SUCCESS_USER)

const CONNECT_NRLINK_BTN_TEXT = 'Je connecte mon nrLINK'
const SKIP_LINK_TEXT = 'Passer cette étape'
const mockHistoryPush = jest.fn()

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}))
/* eslint-disable-next-line jsdoc/require-jsdoc */
const NrLinkConnectionRouter = () => (
    <Router>
        <NrLinkConnection />
    </Router>
)
describe('Test NrLinkConnection Page', () => {
    // When initializing store state in reduxedRender, it doesn't update the state when using store.getState().
    // Thus to use the state with useSelector and store.getState(), we require('src/redux') and use dispatch for updating the state, and give store in the reduxedRender.
    // And then we can have the same state when using useSelector and store.getStore()
    const { store } = require('src/redux')

    test('When response getShowNrLinkPopup false, it should redirect from NrLinkConnection', async () => {
        await store.dispatch.userModel.setAuthenticationToken(showNrLinkPopupFalse)

        reduxedRender(<NrLinkConnectionRouter />, { store })

        await waitFor(
            () => {
                expect(mockHistoryPush).toHaveBeenCalledWith(URL_CONSUMPTION)
            },
            { timeout: 5000 },
        )
    }, 10000)
    test('When response getShowNrLinkPopup true, it should not redirect from NrLinkConnection', async () => {
        await store.dispatch.userModel.setAuthenticationToken(showNrLinkPopupTrue)
        reduxedRender(<NrLinkConnectionRouter />, { store })

        await waitFor(() => {
            expect(mockHistoryPush).not.toHaveBeenCalled()
        })
    }, 10000)
    test('When response getShowNrLinkPopup error, it should redirect from NrLinkConnection', async () => {
        await store.dispatch.userModel.setAuthenticationToken('error')
        reduxedRender(<NrLinkConnectionRouter />, { store })

        await waitFor(
            () => {
                expect(mockHistoryPush).toHaveBeenCalledWith(URL_CONSUMPTION)
            },
            { timeout: 5000 },
        )
    }, 10000)
    test('When clicking on CTA button connect nrLink, it should redirect to nrLinkConnectionStep', async () => {
        const { getByText } = reduxedRender(<NrLinkConnectionRouter />, {
            initialState: { userModel: { user: userData } },
        })
        await waitFor(() => {
            expect(getByText(CONNECT_NRLINK_BTN_TEXT)).toBeTruthy()
        })
        // https://stackoverflow.com/a/57907719/13145536
        // jsdom is simulating a browser but it has some limitations.
        // One of these limitations is the fact that you can't change the location.
        // If you want to test that your link works I suggest to check the href attribute of your <a>:
        expect(getByText(CONNECT_NRLINK_BTN_TEXT).closest('a')).toHaveAttribute('href', URL_NRLINK_CONNECTION_STEPS)
    })
    test('When clicking on Skip nrLinkConnection Link, it should redirect to URL_CONSUMPTION', async () => {
        const { getByText } = reduxedRender(<NrLinkConnectionRouter />, {
            initialState: { userModel: { user: userData } },
        })
        await waitFor(() => {
            expect(getByText(SKIP_LINK_TEXT)).toBeTruthy()
        })
        expect(getByText(SKIP_LINK_TEXT).closest('a')).toHaveAttribute('href', URL_CONSUMPTION)
    })
})
