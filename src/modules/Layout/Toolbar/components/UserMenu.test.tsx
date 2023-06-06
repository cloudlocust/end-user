import { reduxedRender } from 'src/common/react-platform-components/test'
import UserMenu from 'src/modules/Layout/Toolbar/components/UserMenu'
import { BrowserRouter as Router } from 'react-router-dom'
import { fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { models } from 'src/models'
import { init } from '@rematch/core'
import { TEST_SUCCESS_USER } from 'src/mocks/handlers/user'
import { applyCamelCase } from 'src/common/react-platform-components'
import { IUser } from 'src/modules/User'
import { act } from 'react-dom/test-utils'

/**
 * Mock user model state.
 */
const mockUser: IUser = applyCamelCase(TEST_SUCCESS_USER)

const userFullName = `${mockUser?.firstName} ${mockUser?.lastName}`

const FAQ_MENU_ITEM_TEXT = 'FAQ'
const PROFILE_MENU_ITEM_TEXT = 'Gestion de Profil'
const PROFILE_REDIRECT_URL = '/profile-management'
const MENTIONS_MENU_ITEM_TEXT = 'Mentions'
const MENTIONS_REDIRECT_URL = '/mentions'
const LOGOUT_MENU_ITEM_TEXT = 'Déconnexion'
const LOGOUT_REDIRECT_URL = '/login'
/**
 * Init the redux store.
 */
const store = init({
    models,
})

const mockReplaceHistory = jest.fn()
const mockPushHistory = jest.fn()

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        replace: mockReplaceHistory,
        push: mockPushHistory,
    }),
}))

const mockFaqRedirectLink = 'url'

/**
 * Mock Configs Variables.
 */
jest.mock('src/configs', () => ({
    __esModule: true,
    REACT_FAQ_REDIRECT_LINK: 'url',
}))

describe('test UserMenu component', () => {
    beforeEach(async () => {
        await store.dispatch.userModel.setUser(mockUser)
        await store.dispatch.translationModel.setLocale({ locale: 'fr', translations: null })
    })
    test('When user, its name should be shown', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <UserMenu />
            </Router>,
            { store },
        )

        expect(getByText(userFullName)).toBeTruthy()
    })

    test('Opening userMenu and clicking on FAQ, it should also close the modal', async () => {
        // Setup
        const mockWindowOpen = jest.fn()
        const originalWindowOpen = window.open
        window.open = mockWindowOpen

        const { getByText, getByRole } = reduxedRender(
            <Router>
                <UserMenu />
            </Router>,
            { store },
        )
        // Initially menu is closed
        expect(() => getByText(FAQ_MENU_ITEM_TEXT)).toThrow()
        // Opening the menu
        userEvent.click(getByText(userFullName))
        await waitFor(() => {
            expect(getByText(FAQ_MENU_ITEM_TEXT)).toBeTruthy()
        })

        // Clicking on FAQ
        userEvent.click(getByText(FAQ_MENU_ITEM_TEXT))
        await waitFor(() => {
            expect(mockWindowOpen).toHaveBeenCalledWith(mockFaqRedirectLink, '_blank', 'noopener noreferrer')
        })
        // Menu Closing
        act(() => {
            fireEvent.click(getByRole('presentation').querySelector('.MuiBackdrop-root') as HTMLDivElement)
        })
        await waitFor(() => {
            expect(() => getByText(FAQ_MENU_ITEM_TEXT)).toThrow()
        })

        // Cleanup
        window.open = originalWindowOpen
    })

    test('When clicking on logout user should be null', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <UserMenu />
            </Router>,
            { store },
        )
        // Opening the menu
        userEvent.click(getByText(userFullName))
        await waitFor(() => {
            expect(getByText(FAQ_MENU_ITEM_TEXT)).toBeTruthy()
        })

        // Clicking on Logout
        userEvent.click(getByText(LOGOUT_MENU_ITEM_TEXT))
        await waitFor(() => {
            expect(() => getByText(userFullName)).toThrow()
        })
        expect(mockReplaceHistory).toHaveBeenCalledWith(LOGOUT_REDIRECT_URL)
    })

    test('When clicking on the different MenuItems', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <UserMenu />
            </Router>,
            { store },
        )
        // Opening the menu
        userEvent.click(getByText(userFullName))
        await waitFor(() => {
            expect(getByText(FAQ_MENU_ITEM_TEXT)).toBeTruthy()
        })

        // Clicking on Profile Menu ITem
        userEvent.click(getByText(PROFILE_MENU_ITEM_TEXT))
        await waitFor(() => {
            expect(mockPushHistory).toHaveBeenCalledWith(PROFILE_REDIRECT_URL)
        })

        // Clicking on Profile Menu ITem
        userEvent.click(getByText(PROFILE_MENU_ITEM_TEXT))
        await waitFor(() => {
            expect(mockPushHistory).toHaveBeenCalledWith(PROFILE_REDIRECT_URL)
        })

        // Clicking on Mentions Menu ITem
        userEvent.click(getByText(MENTIONS_MENU_ITEM_TEXT))
        await waitFor(() => {
            expect(mockPushHistory).toHaveBeenCalledWith(MENTIONS_REDIRECT_URL)
        })
    })
})
