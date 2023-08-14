import { fireEvent, act, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { AccomodationForm } from 'src/modules/MyHouse/components/Accomodation/AccomodationForm'
import { TEST_ACCOMODATION_RESPONSE as MOCK_TEST_ACCOMODATION_RESPONSE } from 'src/mocks/handlers/accomodation'
import { AccomodationDataType } from './AccomodationType'
import { applyCamelCase } from 'src/common/react-platform-components'
import userEvent from '@testing-library/user-event'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'

const TEST_MOCKED_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

let mockHouseId = TEST_MOCKED_HOUSES[0].id

let mockIsLoadingInProgress = false
const mockUpdateAccomodation = jest.fn()
const mockLoadAccomodation = jest.fn()
const MODIFIER_BUTTON_TEXT = 'Modifier'
const DISABLED_CLASS = 'Mui-disabled'
const INPUT_DISABLED_ELEMENT = `input.${DISABLED_CLASS}`
const BUTTON_DISABLED_ELEMENT = `button.${DISABLED_CLASS}`
const ANNULER_BUTTON_TEXT = 'Annuler'
const ENREGISTRER_BUTTON_TEXT = 'Enregistrer'
const mockEnqueueSnackbar = jest.fn()
const TEST_ACCOMODATION_RESPONSE = applyCamelCase(MOCK_TEST_ACCOMODATION_RESPONSE)
let mockAccomodation: AccomodationDataType = TEST_ACCOMODATION_RESPONSE

/**
 * Mocking the useSnackbar used in AccomodationForm.
 */
jest.mock('notistack', () => ({
    ...jest.requireActual('notistack'),
    /**
     * Mock the notistack useSnackbar hooks.
     *
     * @returns The notistack useSnackbar hook.
     */
    useSnackbar: () => ({
        enqueueSnackbar: mockEnqueueSnackbar,
    }),
}))
jest.mock('src/modules/MyHouse/components/Accomodation/AccomodationHooks', () => ({
    ...jest.requireActual('src/modules/MyHouse/components/Accomodation/AccomodationHooks'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useAccomodation: () => ({
        isLoadingInProgress: mockIsLoadingInProgress,
        updateAccomodation: mockUpdateAccomodation,
        loadAccomodation: mockLoadAccomodation,
        accomodation: mockAccomodation,
    }),
}))

/**
 * Mocking the useParams used in "accomodationForm" to get the house id based on url /houses/:houseId/accomodation {houseId} params.
 */
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    /**
     * Mock the react-router useParams hooks.
     *
     * @returns The react-router useParams hook.
     */
    useParams: () => ({
        houseId: mockHouseId,
    }),
}))

describe('Test AccomodationForm', () => {
    test('When clicking on Modifier form should not be disabled', async () => {
        const { getByText, container } = reduxedRender(
            <BrowserRouter>
                <AccomodationForm />
            </BrowserRouter>,
        )
        expect(container.querySelectorAll(INPUT_DISABLED_ELEMENT)!.length).toBe(2)
        expect(container.querySelectorAll(BUTTON_DISABLED_ELEMENT)!.length).toBe(9)
        expect(getByText(MODIFIER_BUTTON_TEXT)).toBeTruthy()
        expect(() => getByText(ANNULER_BUTTON_TEXT)).toThrow()
        expect(() => getByText(ENREGISTRER_BUTTON_TEXT)).toThrow()
        act(() => {
            fireEvent.click(getByText(MODIFIER_BUTTON_TEXT))
        })
        act(() => {
            fireEvent.click(getByText('Maison'))
        })
        await waitFor(() => {
            expect(container.querySelectorAll(INPUT_DISABLED_ELEMENT)!.length).toBe(0)
            expect(container.querySelectorAll(BUTTON_DISABLED_ELEMENT)!.length).toBe(0)
        })
        expect(getByText(ANNULER_BUTTON_TEXT)).toBeTruthy()
        expect(getByText(ENREGISTRER_BUTTON_TEXT)).toBeTruthy()
        expect(() => getByText(MODIFIER_BUTTON_TEXT)).toThrow()
    })

    test('When we select the data, after confirmation they are saved in the form', async () => {
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <AccomodationForm />
            </BrowserRouter>,
        )
        act(() => {
            fireEvent.click(getByText(MODIFIER_BUTTON_TEXT))
        })
        await act(async () => {
            fireEvent.click(getByText('Propriétaire'))
            fireEvent.click(getByText('Maison'))
            fireEvent.click(getByText('Avant 1950'))
            fireEvent.click(getByText('Secondaire'))
        })
        await waitFor(async () => {
            expect(getByText('Propriétaire').getAttribute('value')).toBe('owner')
            expect(getByText('Maison').getAttribute('value')).toBe('Maison')
            expect(getByText('Avant 1950').getAttribute('value')).toBe('Avant_1950')
            expect(getByText('Secondaire').getAttribute('value')).toBe('Secondaire')
        })
        await waitFor(() => {
            expect(getByText(ENREGISTRER_BUTTON_TEXT)).toBeTruthy()
        })
        act(() => {
            fireEvent.click(getByText(ENREGISTRER_BUTTON_TEXT))
        })
        await waitFor(() => {
            expect(mockUpdateAccomodation).toHaveBeenCalled()
        })
    })
    test('when we click on the radio button, the data changes', async () => {
        const { getByText, getByRole } = reduxedRender(
            <BrowserRouter>
                <AccomodationForm />
            </BrowserRouter>,
        )
        act(() => {
            fireEvent.click(getByText(MODIFIER_BUTTON_TEXT))
        })
        act(() => {
            fireEvent.click(getByRole('radio', { name: 'Non' }))
        })

        expect(getByRole('radio', { name: 'Non' })).toBeChecked()
        act(() => {
            fireEvent.click(getByRole('radio', { name: 'Oui' }))
        })

        expect(getByRole('radio', { name: 'Oui' })).toBeChecked()
        act(() => {
            fireEvent.click(getByText(ENREGISTRER_BUTTON_TEXT))
        })
    })
    test('When clicking on Cancel Edit it should disableEdit', async () => {
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <AccomodationForm />
            </BrowserRouter>,
        )
        expect(() => getByText(ANNULER_BUTTON_TEXT)).toThrow()
        expect(() => getByText(ENREGISTRER_BUTTON_TEXT)).toThrow()
        userEvent.click(getByText(MODIFIER_BUTTON_TEXT))
        await waitFor(() => {
            expect(getByText(ANNULER_BUTTON_TEXT)).toBeTruthy()
        })
        expect(() => getByText(MODIFIER_BUTTON_TEXT)).toThrow()
        userEvent.click(getByText(ANNULER_BUTTON_TEXT))
        await waitFor(() => {
            expect(getByText(MODIFIER_BUTTON_TEXT)).toBeTruthy()
        })
        expect(() => getByText(ENREGISTRER_BUTTON_TEXT)).toThrow()
        expect(() => getByText(ANNULER_BUTTON_TEXT)).toThrow()
    })
    test('When loading equipmentList, Circular progress should be shown', async () => {
        mockIsLoadingInProgress = true
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <AccomodationForm />
            </BrowserRouter>,
        )
        expect(() => getByText(MODIFIER_BUTTON_TEXT)).toThrow()
        expect(() => getByText(ANNULER_BUTTON_TEXT)).toThrow()
        expect(() => getByText(ENREGISTRER_BUTTON_TEXT)).toThrow()
    })
})
