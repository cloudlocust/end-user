import { reduxedRender } from 'src/common/react-platform-components/test'
import { SelectHousing } from 'src/modules/Layout/Toolbar/components/SelectHousing'
import { BrowserRouter } from 'react-router-dom'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { applyCamelCase } from 'src/common/react-platform-components'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import userEvent from '@testing-library/user-event'
import { DEFAULT_LOCALE } from 'src/configs'
import { init } from '@rematch/core'
import { models } from 'src/models'
import { waitFor, fireEvent, act } from '@testing-library/react'
import { URL_MY_HOUSE } from 'src/modules/MyHouse'

const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

const NO_ELEMENT_AVAILABLE = 'Aucun logement disponible'
const ADD_HOUSING_BUTTON_TEXT = 'Ajouter un logement'
const selectClassName = 'MuiSelect-select'
const MODAL_HOUSING_TEXT = 'Mon Nouveau Logement'

// Role
const MUI_MODAL_ROLE = 'presentation'

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

// mock store.
const store = init({
    models,
})

describe('Test SelectHousing Widget.', () => {
    beforeEach(async () => {
        await store.dispatch.translationModel.setLocale({ locale: DEFAULT_LOCALE, translations: null })
        await store.dispatch.housingModel.setHousingModelState(LIST_OF_HOUSES)
    })

    test('When widget mount the elements should appear.', async () => {
        const { getByText, container } = reduxedRender(
            <BrowserRouter>
                <SelectHousing />
            </BrowserRouter>,
            { store },
        )

        // The Select appear on the DOM.
        expect(container.getElementsByClassName(selectClassName)[0]).toBeTruthy()

        // The current housing appears as default selected
        expect(getByText(LIST_OF_HOUSES[0].address.name)).toBeTruthy()

        // Other options should not appear
        expect(() => getByText(LIST_OF_HOUSES[1].address.name)).toThrow()
    })

    test('When clicking on the select options should show., and there should be a redirect link to HousingDetails page', async () => {
        const { getByText, container, getAllByRole } = reduxedRender(
            <BrowserRouter>
                <SelectHousing />
            </BrowserRouter>,
            { store },
        )

        // Get the select element and click on it.
        const selectMuiElement = container.getElementsByClassName(selectClassName)[0]
        userEvent.click(selectMuiElement)

        // other options should appear on the screen.
        expect(getByText(LIST_OF_HOUSES[1].address.name)).toBeTruthy()
        expect(getAllByRole('option').length).toBe(LIST_OF_HOUSES.length + 1)
        // Check for link exist in option.
        expect(getAllByRole('option')[1].getElementsByTagName('a')[0].href).toContain(
            URL_MY_HOUSE + '/' + LIST_OF_HOUSES[1].id,
        )

        // Clicking on the link (on the param icon).
        act(() => {
            fireEvent.click(getAllByRole('option')[1].getElementsByTagName('a')[0])
        })

        await waitFor(
            () => {
                // Select is closed and no other option is shown.
                expect(() => getByText(ADD_HOUSING_BUTTON_TEXT)).toThrow()
            },
            { timeout: 10000 },
        )
        // The current housing appears as default selected
        expect(getByText(LIST_OF_HOUSES[1].address.name)).toBeTruthy()
        expect(window.location.pathname).toBe(`/my-houses/${LIST_OF_HOUSES[1].id}`)
    }, 20000)

    test('When Clicking on add house, modal should appear, and when clicking on the backdrop it should close', async () => {
        const { getByText, container, getByRole } = reduxedRender(
            <BrowserRouter>
                <SelectHousing />
            </BrowserRouter>,
            { store },
        )

        // When select is closed Add should not show
        expect(() => getByText(ADD_HOUSING_BUTTON_TEXT)).toThrow()
        // Opening Select
        const selectMuiElement = container.getElementsByClassName(selectClassName)[0]
        userEvent.click(selectMuiElement)

        await waitFor(() => {
            expect(getByText(ADD_HOUSING_BUTTON_TEXT)).toBeTruthy()
        })

        // Clicking on AddHousing Button
        userEvent.click(getByText(ADD_HOUSING_BUTTON_TEXT))

        // HousingForm should show
        await waitFor(
            () => {
                expect(getByText(MODAL_HOUSING_TEXT)).toBeTruthy()
            },
            { timeout: 10000 },
        )

        // Click on the backdrop, to close the HousingForm
        act(() => {
            fireEvent.click(getByRole(MUI_MODAL_ROLE).firstChild as HTMLDivElement)
        })
        await waitFor(
            () => {
                expect(() => getByText(MODAL_HOUSING_TEXT)).toThrow()
            },
            { timeout: 10000 },
        )
    }, 25000)

    test('When widget mount and housing list is empty, we can add a new housing', async () => {
        await store.dispatch.housingModel.setHousingModelState([])

        const { getByText, container } = reduxedRender(
            <BrowserRouter>
                <SelectHousing />
            </BrowserRouter>,
            { store },
        )

        // No element appear
        expect(getByText(NO_ELEMENT_AVAILABLE)).toBeTruthy()

        // Get the select element and click on it.
        const selectMuiElement = container.getElementsByClassName(selectClassName)[0]
        userEvent.click(selectMuiElement)

        await waitFor(() => {
            expect(getByText(ADD_HOUSING_BUTTON_TEXT)).toBeTruthy()
        })

        // Clicking on AddHousing Button
        userEvent.click(getByText(ADD_HOUSING_BUTTON_TEXT))

        // HousingForm should show
        expect(getByText(MODAL_HOUSING_TEXT)).toBeTruthy()
    })
})
