import { reduxedRender } from 'src/common/react-platform-components/test'
import { ToolbarWidget } from 'src/modules/Layout/Toolbar/ToolbarWidget'
import { BrowserRouter } from 'react-router-dom'
import * as reactRedux from 'react-redux'
import { TEST_AUTHORIZATION_ERROR_LOAD_HOUSINGS, TEST_HOUSES } from 'src/mocks/handlers/houses'
import { applyCamelCase } from 'src/common/react-platform-components'
import { IHousing, IHousingState } from 'src/modules/MyHouse/components/HousingList/housing'
import userEvent from '@testing-library/user-event'
import { TEST_SUCCESS_USER } from 'src/mocks/handlers/user'
import { IUser } from 'src/modules/User'
import { DEFAULT_LOCALE } from 'src/configs'
import { init } from '@rematch/core'
import { models } from 'src/models'
import { waitFor } from '@testing-library/react'
import { URL_ERROR_500 } from 'src/modules/Errors/ErrorsConfig'

const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

const NO_ELEMENT_AVAILABLE = 'Aucun logement disponible'

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
/**
 * Housing Model State.
 */
let mockHousingModelState: IHousingState = {
    housingList: LIST_OF_HOUSES,
    currentHousing: LIST_OF_HOUSES[0],
}

/**
 * Mock user model state.
 */
const mockUser: IUser = applyCamelCase(TEST_SUCCESS_USER)

/**
 * Mock all state.
 */
const mockReduxState = {
    housingModel: mockHousingModelState,
    userModel: {
        user: mockUser,
    },
    translationModel: {
        locale: DEFAULT_LOCALE,
        translations: null,
    },
}

// mock store.
const mockStore = init({
    models,
})

const mockUseSelector = jest.spyOn(reactRedux, 'useSelector')
const mockUseDispatch = jest.spyOn(reactRedux, 'useDispatch')

describe('Test Toolbar Widget.', () => {
    beforeEach(() => {
        mockUseDispatch.mockClear()
        mockUseSelector.mockClear()

        mockUseSelector.mockImplementation((selctorFn) => selctorFn(mockReduxState))
        mockUseDispatch.mockImplementation(() => mockStore.dispatch)
    })

    afterEach(() => {
        mockUseDispatch.mockClear()
        mockUseSelector.mockClear()
    })

    test('When widget mount the elements should appear.', () => {
        const { getByText, container } = reduxedRender(
            <BrowserRouter>
                <ToolbarWidget />
            </BrowserRouter>,
        )

        // The Select appear on the DOM.

        expect(container.getElementsByClassName('MuiSelect-select')[0]).toBeTruthy()

        // The current housing appears as default selected

        expect(getByText(LIST_OF_HOUSES[0].address.name)).toBeTruthy()

        // Other options should not appear
        expect(() => getByText(LIST_OF_HOUSES[1].address.name)).toThrow()
    })

    test('When clicking on the select options should show.', async () => {
        const { getByText, container, getAllByRole } = reduxedRender(
            <BrowserRouter>
                <ToolbarWidget />
            </BrowserRouter>,
        )

        // Get the select element and click on it.
        const selectMuiElement = container.getElementsByClassName('MuiSelect-select')[0]
        userEvent.click(selectMuiElement)

        // other options should appear on the screen.

        expect(getByText(LIST_OF_HOUSES[1].address.name)).toBeTruthy()
        expect(getAllByRole('option').length).toBe(LIST_OF_HOUSES.length)
    })

    test('When widget mount and housing list is empty.', () => {
        mockHousingModelState.housingList = []
        mockHousingModelState.currentHousing = null

        const { getByText } = reduxedRender(
            <BrowserRouter>
                <ToolbarWidget />
            </BrowserRouter>,
        )

        // No element appear
        expect(getByText(NO_ELEMENT_AVAILABLE)).toBeTruthy()
    })

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
