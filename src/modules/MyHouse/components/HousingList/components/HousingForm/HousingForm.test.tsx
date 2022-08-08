import { reduxedRender } from 'src/common/react-platform-components/test'
import HousingForm from 'src/modules/MyHouse/components/HousingList/components/HousingForm'
import { BrowserRouter as Router } from 'react-router-dom'

const mockAddHousing = jest.fn()

const SAVE_BUTTON = 'Enregistrer'
const MY_NEW_HOUSING_TITLE = 'Mon Nouveau Logement'
const ADDRESS_PLACEHOLDER = 'Adresse'

/**
 * Mocking the useHousingsDetails.
 */
jest.mock('src/modules/MyHouse/components/HousingList/HousingsHooks', () => ({
    ...jest.requireActual('src/modules/MyHouse/components/HousingList/HousingsHooks'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHousingList: () => ({
        addElement: mockAddHousing,
    }),
}))

describe('Test HousingForm', () => {
    test('When Housing Form called, elements should Appear.', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <HousingForm />
            </Router>,
        )

        expect(getByText(MY_NEW_HOUSING_TITLE)).toBeTruthy()
        expect(getByText(SAVE_BUTTON)).toBeTruthy()
        expect(getByText(ADDRESS_PLACEHOLDER)).toBeTruthy()
    })
    // test('When clicking on Enregistrer addElement Should be called.', async () => {
    //     const { getByTestId, getByText } = reduxedRender(
    //         <Router>
    //             <HousingForm />
    //         </Router>,
    //     )
    //     // Fill the address.
    //     const addressInput = getByTestId('AddressAutoCompleteField')
    //     expect(addressInput).toBe(0)
    //     fireEvent.change(addressInput, { target: { value: TEST_MOCKED_HOUSES[0] } })

    //     // Open delete warning popup.
    //     act(() => {
    //         userEvent.click(getByText('Enregistrer'))
    //     })

    //     await waitFor(() => {
    //         expect(mockAddHousing).toHaveBeenCalled()
    //     })
    // })
})
