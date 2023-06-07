import { reduxedRender } from 'src/common/react-platform-components/test'
import { ToolbarWidget } from 'src/modules/Layout/Toolbar/ToolbarWidget'
import { BrowserRouter } from 'react-router-dom'
import { TEST_AUTHORIZATION_ERROR_LOAD_HOUSINGS } from 'src/mocks/handlers/houses'
import { waitFor } from '@testing-library/react'
import { URL_ERROR_500 } from 'src/modules/Errors/ErrorsConfig'

const mockHistoryPush = jest.fn()
/**
 * Mocking the src/firebase to make unit test work.
 */
jest.mock('src/firebase', () => ({
    /**
     * Mock the getTokenFromFirebase to pass unit test.
     *
     * @returns The mocked getTokenFromFirebase.
     */
    getTokenFromFirebase: jest.fn(),
}))

/**
 * Mocking the history to make unit test work.
 */
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}))

describe('Test Toolbar Widget.', () => {
    test('When error fetching housing list, HousingError Page should be shown.', async () => {
        const { store } = require('src/redux')
        await store.dispatch.userModel.setAuthenticationToken(TEST_AUTHORIZATION_ERROR_LOAD_HOUSINGS)

        reduxedRender(
            <BrowserRouter>
                <ToolbarWidget />
            </BrowserRouter>,
            { store },
        )

        // Should be redirected to ErrorHousing Page when Error page
        await waitFor(() => {
            expect(mockHistoryPush).toHaveBeenCalledWith(URL_ERROR_500)
        })
    })
})
