import { fireEvent, act, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { AccomodationTab } from 'src/modules/MyHouse/components/Accomodation/AccomodationTab'
import { TEST_ACCOMODATION_RESPONSE as MOCK_TEST_ACCOMODATION_RESPONSE } from 'src/mocks/handlers/accomodation'
import { AccomodationDataType } from './AccomodationType'
import { applyCamelCase } from 'src/common/react-platform-components'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import userEvent from '@testing-library/user-event'

const TEST_MOCKED_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

let mockHouseId = TEST_MOCKED_HOUSES[0].id

let mockIsLoadingInProgress = false
const mockUpdateAccomodation = jest.fn()
const mockLoadAccomodation = jest.fn()
const SUBMIT_BUTTON_TEXT = 'Enregistrer mes modifications'
const mockEnqueueSnackbar = jest.fn()
const TEST_ACCOMODATION_RESPONSE = applyCamelCase(MOCK_TEST_ACCOMODATION_RESPONSE)
let mockAccomodation: AccomodationDataType = TEST_ACCOMODATION_RESPONSE

/**
 * Mocking the useSnackbar used in Accomodation.
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
 * Mocking the useParams used in "Accomodation" to get the house id based on url /houses/:houseId/accomodation {houseId} params.
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

describe('Test Accomodation', () => {
    test('When clicking on Enregistrer mes modifications button, updateAccomodation should be called', async () => {
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <AccomodationTab />
            </BrowserRouter>,
        )
        userEvent.click(getByText('Propriétaire'))
        userEvent.click(getByText('Maison'))
        userEvent.click(getByText('Avant 1950'))
        userEvent.click(getByText('Secondaire'))

        userEvent.click(getByText(SUBMIT_BUTTON_TEXT))
        await waitFor(() => {
            expect(mockUpdateAccomodation).toHaveBeenCalled()
        })
    })
    test('when we click on the radio button, the data changes', async () => {
        const { getByRole } = reduxedRender(
            <BrowserRouter>
                <AccomodationTab />
            </BrowserRouter>,
        )
        act(() => {
            fireEvent.click(getByRole('radio', { name: 'Non' }))
        })

        expect(getByRole('radio', { name: 'Non' })).toBeChecked()
        act(() => {
            fireEvent.click(getByRole('radio', { name: 'Oui' }))
        })

        expect(getByRole('radio', { name: 'Oui' })).toBeChecked()
    })
    test('When loading equipmentList, Circular progress should be shown', async () => {
        mockIsLoadingInProgress = true
        const { container } = reduxedRender(
            <BrowserRouter>
                <AccomodationTab />
            </BrowserRouter>,
        )

        expect(container.querySelector('.MuiCircularProgress-root')).toBeInTheDocument()
    })
})
