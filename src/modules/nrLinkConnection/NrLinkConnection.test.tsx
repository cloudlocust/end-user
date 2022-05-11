import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { waitFor } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { URL_NRLINK_CONNECTION_STEPS, NrLinkConnection } from 'src/modules/nrLinkConnection'
import { TEST_SUCCESS_USER } from 'src/mocks/handlers/user'
import { applyCamelCase } from 'src/common/react-platform-components'
import { URL_CONSUMPTION } from 'src/modules/MyConsumption'

const userData = applyCamelCase(TEST_SUCCESS_USER)

const CONNECT_NRLINK_BTN_TEXT = 'Je connecte mon nrLINK'
const SKIP_LINK_TEXT = 'Passer cette étape'
const mockUseHistory = jest.fn()
/* eslint-disable-next-line jsdoc/require-jsdoc */
const NrLinkConnectionRouter = () => (
    <Router>
        <NrLinkConnection />
    </Router>
)
/**
 * Mocking the useHistory.
 */
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),

    /**
     * Mock react-router useHistory hook.
     *
     * @returns The react-router useHistory replace function.
     */
    useHistory: () => ({
        push: mockUseHistory,
    }),
}))
describe('Test NrLinkConnection Page', () => {
    // test('When connected its not first time login of the user, it should redirect him to login', async () => {
    //     userData.firstLogin = false
    //     reduxedRender(<NrLinkConnectionRouter />, {
    //         initialState: { userModel: { user: userData } },
    //     })
    //     await waitFor(() => {
    //         expect(mockUseHistory).toHaveBeenCalledWith(URL_CONSUMPTION)
    //     })
    // })
    test('When clicking on CTA button connect nrLink, it should redirect to nrLinkConnectionStep', async () => {
        userData.firstLogin = true
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
