import { reduxedRender } from 'src/common/react-platform-components/test'
import MeterInfo from 'src/modules/MyHouse/components/MeterInfo'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { applyCamelCase } from 'src/common/react-platform-components/utils/mm'
import { BrowserRouter as Router } from 'react-router-dom'
import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing.d'
import { store } from 'src/redux'

const TEST_MOCKED_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

const mockRemoveHousing = jest.fn()
const mockAddMeter = jest.fn()

const DEFAULT_GUID_TEXT = 'Veuillez renseigner votre compteur'
const DEFAULT_ADD_METER_NUMBER_TEXT = 'Numéro de PDL ou PRM'
const ADD_METER_NUMBER_PLACEHOLDER = 'Ex: 12345678912345'

const NUMBER_OF_MY_METER = '12345XRC8g5r9f'

const mockLoadHousingsAndScopes = jest.fn()
const mockSetDefaultHousingModel = jest.fn()

jest.mock('src/modules/MyHouse/utils/MyHouseHooks.ts', () => ({
    ...jest.requireActual('src/modules/MyHouse/utils/MyHouseHooks.ts'),
    //eslint-disable-next-line
    useHousingRedux: () => ({
        loadHousingsAndScopes: mockLoadHousingsAndScopes,
        setDefaultHousingModel: mockSetDefaultHousingModel,
    }),
    //eslint-disable-next-line
    arePlugsUsedBasedOnProductionStatus: () => true,
}))

/**
 * Mocking the useHousingsDetails.
 */
jest.mock('src/modules/MyHouse/components/HousingList/HousingsHooks', () => ({
    ...jest.requireActual('src/modules/MyHouse/components/HousingList/HousingsHooks'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHousingsDetails: () => ({
        removeHousing: mockRemoveHousing,
    }),
}))

/**
 * Mocking the useMeterForHousing.
 */
jest.mock('src/modules/Meters/metersHook', () => ({
    ...jest.requireActual('src/modules/Meters/metersHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMeterForHousing: () => ({
        addMeter: mockAddMeter,
    }),
}))

describe('Test MeterInfo', () => {
    describe('Test housing card', () => {
        test('When guid is null, link should be visible', async () => {
            const { getByText } = reduxedRender(
                <Router>
                    <MeterInfo element={TEST_MOCKED_HOUSES[1]} />
                </Router>,
            )

            expect(getByText(DEFAULT_GUID_TEXT)).toBeTruthy()
        })

        test('When guid not registered, test that navlink appear', async () => {
            const { getByText } = reduxedRender(
                <Router>
                    <MeterInfo element={TEST_MOCKED_HOUSES[1]} />
                </Router>,
            )

            expect(getByText(DEFAULT_GUID_TEXT)).toBeTruthy()

            // Test that the popup to add meter show.
            userEvent.click(getByText(DEFAULT_GUID_TEXT))

            await waitFor(() => expect(getByText(DEFAULT_ADD_METER_NUMBER_TEXT)).toBeTruthy())
        })
    })

    describe('Add meter popup, when housing does not have meter.', () => {
        test('popup add meter show up when clicking on link', async () => {
            const { getByText } = reduxedRender(
                <Router>
                    <MeterInfo element={TEST_MOCKED_HOUSES[1]} />
                </Router>,
                { store },
            )
            // Open add meter popup.
            userEvent.click(getByText(DEFAULT_GUID_TEXT))

            // Test that add meter popup is open.
            await waitFor(() => {
                expect(getByText(DEFAULT_ADD_METER_NUMBER_TEXT)).toBeTruthy()
            })
        })
        test('Fill the informations to add meter and save correctly.', async () => {
            const { getByText, getByPlaceholderText } = reduxedRender(
                <Router>
                    <MeterInfo element={TEST_MOCKED_HOUSES[1]} />
                </Router>,
                { store },
            )
            // Open add meter popup.
            userEvent.click(getByText(DEFAULT_GUID_TEXT))

            // Test that add meter popup is open.
            await waitFor(() => {
                expect(getByText(DEFAULT_ADD_METER_NUMBER_TEXT)).toBeTruthy()
            })

            // Fill the form. this classes are added automaticly, got them from classes shown when testing.
            const numberInput = getByPlaceholderText(ADD_METER_NUMBER_PLACEHOLDER)

            userEvent.type(numberInput, NUMBER_OF_MY_METER)

            // Save the changes.
            userEvent.click(getByText('Enregistrer'))

            // Add meter function is called
            await waitFor(() => {
                expect(mockAddMeter).toHaveBeenCalled()
                expect(mockLoadHousingsAndScopes).toBeCalled()
            })
        })
        test('Fill the informations to add meter and cancel the process.', async () => {
            const { getByText, getByPlaceholderText, queryByPlaceholderText } = reduxedRender(
                <Router>
                    <MeterInfo element={TEST_MOCKED_HOUSES[1]} />
                </Router>,
                { store },
            )
            // Open add meter popup.
            userEvent.click(getByText(DEFAULT_GUID_TEXT))

            // Test that add meter popup is open.
            await waitFor(() => {
                expect(getByText(DEFAULT_ADD_METER_NUMBER_TEXT)).toBeTruthy()
            })

            // Fill the form. this classes are added automaticly, got them from classes shown when testing.
            const numberInput = getByPlaceholderText(ADD_METER_NUMBER_PLACEHOLDER)

            userEvent.type(numberInput, NUMBER_OF_MY_METER)

            // Cancel the changes.
            userEvent.click(getByText('Annuler'))

            // Add meter function is not called and popup closed
            await waitFor(() => {
                expect(queryByPlaceholderText(ADD_METER_NUMBER_PLACEHOLDER)).toBeNull()
                expect(mockAddMeter).not.toHaveBeenCalled()
                expect(mockLoadHousingsAndScopes).not.toBeCalled()
            })
        })
        test('Dont Fill correctly the informations to add meter.', async () => {
            const { getByText, getByPlaceholderText } = reduxedRender(
                <Router>
                    <MeterInfo element={TEST_MOCKED_HOUSES[1]} />
                </Router>,
                { store },
            )
            // Open add meter popup.
            userEvent.click(getByText(DEFAULT_GUID_TEXT))

            // Test that add meter popup is open.
            await waitFor(() => {
                expect(getByText(DEFAULT_ADD_METER_NUMBER_TEXT)).toBeTruthy()
            })

            // Fill the form. this classes are added automaticly, got them from classes shown when testing.
            const numberInput = getByPlaceholderText(ADD_METER_NUMBER_PLACEHOLDER)

            // Fill the meter number with a smaller number then needed.
            userEvent.type(numberInput, '123')

            // Save the changes.
            userEvent.click(getByText('Enregistrer'))

            // Add meter function is not called
            await waitFor(() => {
                expect(mockAddMeter).not.toHaveBeenCalled()
                expect(mockLoadHousingsAndScopes).not.toBeCalled()
            })
        })
    })
})
