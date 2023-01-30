import { reduxedRender } from 'src/common/react-platform-components/test'
import { HousingCardForm } from 'src/modules/MyHouse/components/HousingCardForm'
import { HousingCardFormProps } from 'src/modules/MyHouse/components/HousingCardForm/HousingCardFormProps.d'
import { TEST_HOUSES as MOCK_HOUSES } from 'src/mocks/handlers/houses'
import userEvent from '@testing-library/user-event'
import { fireEvent, waitFor } from '@testing-library/react'
import { applyCamelCase } from 'src/common/react-platform-components'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'

const TEST_HOUSES: IHousing[] = applyCamelCase(MOCK_HOUSES)
const EDIT_HOUSE_CARD_FORM_TITLE = 'Mon Logement à ' + TEST_HOUSES[0].address.city.toUpperCase()
const CANCEL_BUTTON_TEXT = 'Annuler'
const loadingButtonClassname = '.MuiLoadingButton-loadingIndicator'
let mockLoadingRequest = false
let mockEditHousing = jest.fn()
const EDIT_HOUSE_BUTTON_DATA_TESTID = 'EditIcon'
const SUBMIT_HOUSE_FORM_BUTTON_TEXT = 'Enregistrer'

/**
 * Mock for HousingCardForm props.
 */
const mockHousingCardFormProps: HousingCardFormProps = {
    housing: TEST_HOUSES[0],
}

/**
 * Mocking the useHousingsDetails.
 */
jest.mock('src/modules/MyHouse/components/HousingList/HousingsHooks', () => ({
    ...jest.requireActual('src/modules/MyHouse/components/HousingList/HousingsHooks'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHousingsDetails: () => ({
        editHousing: mockEditHousing,
        loadingRequest: mockLoadingRequest,
    }),
}))

describe('Test HousingCardForm Component', () => {
    test('When clicking on editIcon, housing card form opens.', async () => {
        const { getAllByRole, getByText, getByTestId } = reduxedRender(
            <HousingCardForm {...mockHousingCardFormProps} />,
        )
        expect(() => getByText(EDIT_HOUSE_CARD_FORM_TITLE)).toThrow()
        userEvent.click(getByTestId(EDIT_HOUSE_BUTTON_DATA_TESTID))
        await waitFor(() => {
            expect(getByText(EDIT_HOUSE_CARD_FORM_TITLE)).toBeTruthy()
        })
        // Click on the backdrop
        fireEvent.click(getAllByRole('presentation')[0].firstChild as HTMLDivElement)
        await waitFor(() => {
            expect(() => getByText(EDIT_HOUSE_CARD_FORM_TITLE)).toThrow()
        })

        // OPEN AGAIN
        userEvent.click(getByTestId(EDIT_HOUSE_BUTTON_DATA_TESTID))
        await waitFor(() => {
            expect(getByText(EDIT_HOUSE_CARD_FORM_TITLE)).toBeTruthy()
        })
        // Cancel button
        userEvent.click(getByText(CANCEL_BUTTON_TEXT))
        await waitFor(() => {
            expect(() => getByText(EDIT_HOUSE_CARD_FORM_TITLE)).toThrow()
        })
    })

    test('When submiting, editHousing should be called and onAfterDeleteUpdateSucces.', async () => {
        const mockOnAfterDeleteUpdateSuccess = jest.fn()
        mockHousingCardFormProps.onAfterDeleteUpdateSuccess = mockOnAfterDeleteUpdateSuccess
        const { getByText, getByTestId } = reduxedRender(<HousingCardForm {...mockHousingCardFormProps} />)

        userEvent.click(getByTestId(EDIT_HOUSE_BUTTON_DATA_TESTID))
        await waitFor(() => {
            expect(getByText(EDIT_HOUSE_CARD_FORM_TITLE)).toBeTruthy()
        })
        userEvent.click(getByText(SUBMIT_HOUSE_FORM_BUTTON_TEXT))

        // Form close
        await waitFor(() => {
            expect(mockEditHousing).toHaveBeenCalled()
        })
        expect(mockOnAfterDeleteUpdateSuccess).toHaveBeenCalled()
        expect(() => getByText(EDIT_HOUSE_CARD_FORM_TITLE)).toThrow()
    })

    test('When mockLoadingRequest spinner should be shown', async () => {
        mockLoadingRequest = true
        const { getByText, getByTestId } = reduxedRender(<HousingCardForm {...mockHousingCardFormProps} />)

        userEvent.click(getByTestId(EDIT_HOUSE_BUTTON_DATA_TESTID))
        await waitFor(() => {
            expect(getByText(EDIT_HOUSE_CARD_FORM_TITLE)).toBeTruthy()
        })
        expect(
            getByText(SUBMIT_HOUSE_FORM_BUTTON_TEXT).parentElement!.querySelector(loadingButtonClassname),
        ).not.toBeNull()
    })
})
