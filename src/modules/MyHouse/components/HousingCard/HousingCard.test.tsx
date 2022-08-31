import { reduxedRender } from 'src/common/react-platform-components/test'
import HousingCard from 'src/modules/MyHouse/components/HousingCard'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { applyCamelCase } from 'src/common/react-platform-components/utils/mm'
import { BrowserRouter as Router } from 'react-router-dom'
import { act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing.d'

const TEST_MOCKED_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

const mockRemoveHousing = jest.fn()
const mockAddMeter = jest.fn()
const mockReloadHousings = jest.fn()

const DEFAULT_GUID_TEXT = 'Veuillez renseigner votre compteur'
const DEFAULT_ADD_METER_NAME_TEXT = 'Nom de mon compteur'
const ADD_METER_NAME_PLACEHOLDER = 'Donnez un nom à votre compteur'
const DEFAULT_ADD_METER_NUMBER_TEXT = 'Numéro de mon compteur'
const ADD_METER_NUMBER_PLACEHOLDER = 'Donnez le numéro de votre compteur'
const MODAL_POPUP_TEXT_VERIFICATION = 'Êtes-vous sûr de vouloir continuer ?'

const NAME_OF_MY_METER_NAME = 'mon compteur'
const NUMBER_OF_MY_METER = '12345XRC8g5r9f'

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

describe('Test HousingCard', () => {
    describe('Test housing card', () => {
        test('When Component Mount data should be shown', async () => {
            const { getByText } = reduxedRender(
                <Router>
                    <HousingCard element={TEST_MOCKED_HOUSES[0]} reloadHousings={mockReloadHousings} />
                </Router>,
            )
            const ADDRESS_TO_SHOW = `${TEST_MOCKED_HOUSES[0].address.name}`
            const GUID_TEXT_TO_SHOW = `Compteur n°${TEST_MOCKED_HOUSES[0].meter?.guid}`

            expect(getByText('Mon Logement à ' + TEST_MOCKED_HOUSES[0].address.city.toUpperCase())).toBeTruthy()
            expect(getByText(GUID_TEXT_TO_SHOW)).toBeTruthy()
            expect(getByText(ADDRESS_TO_SHOW)).toBeTruthy()
        })

        test('When guid is null, link should be visible', async () => {
            const { getByText } = reduxedRender(
                <Router>
                    <HousingCard element={TEST_MOCKED_HOUSES[1]} reloadHousings={mockReloadHousings} />
                </Router>,
            )
            const ADDRESS_TO_SHOW = `${TEST_MOCKED_HOUSES[1].address.name}`

            expect(getByText(DEFAULT_GUID_TEXT)).toBeTruthy()
            expect(getByText(ADDRESS_TO_SHOW)).toBeTruthy()
        })

        test('When guid not registered, test that navlink appear', async () => {
            const { getByText } = reduxedRender(
                <Router>
                    <HousingCard element={TEST_MOCKED_HOUSES[1]} reloadHousings={mockReloadHousings} />
                </Router>,
            )

            expect(getByText(DEFAULT_GUID_TEXT)).toBeTruthy()

            // Test that the popup to add meter show.
            act(() => {
                userEvent.click(getByText(DEFAULT_GUID_TEXT))
            })

            await waitFor(() => expect(getByText('Nom de mon compteur')).toBeTruthy())
        })
    })
    describe('removeHousing, when clicking on on delete icon of card', () => {
        test('popup delete warning should open', async () => {
            const { getByRole, getByText } = reduxedRender(
                <Router>
                    <HousingCard element={TEST_MOCKED_HOUSES[1]} reloadHousings={mockReloadHousings} />
                </Router>,
            )
            // Open delete warning popup.
            act(() => {
                userEvent.click(getByRole('button', { name: /delete/i }))
            })
            // Test that delete warning popup is open.
            await waitFor(() => {
                expect(getByText(MODAL_POPUP_TEXT_VERIFICATION)).toBeTruthy()
            })
        })
        test('annuler popup delete warning should close popup', async () => {
            const { getByRole, getByText } = reduxedRender(
                <Router>
                    <HousingCard element={TEST_MOCKED_HOUSES[1]} reloadHousings={mockReloadHousings} />
                </Router>,
            )
            // Open delete warning popup.
            act(() => {
                userEvent.click(getByRole('button', { name: /delete/i }))
            })
            // Test that delete warning popup is open.
            await waitFor(() => {
                expect(getByText(MODAL_POPUP_TEXT_VERIFICATION)).toBeTruthy()
            })
            // Close delete warning popup.
            act(() => {
                userEvent.click(getByText('Annuler'))
            })
            // Test that delete warning popup is closed.
            await waitFor(() => {
                expect(() => getByText(MODAL_POPUP_TEXT_VERIFICATION)).toThrow()
            })
        })
        test('removeHousing function hook should be called, and loadHousings', async () => {
            const { getByRole, getByText } = reduxedRender(
                <Router>
                    <HousingCard element={TEST_MOCKED_HOUSES[1]} reloadHousings={mockReloadHousings} />
                </Router>,
            )
            // Open delete warning popup.
            act(() => {
                userEvent.click(getByRole('button', { name: /delete/i }))
            })
            // Test that delete warning popup is open.
            await waitFor(() => {
                expect(getByText(MODAL_POPUP_TEXT_VERIFICATION)).toBeTruthy()
            })
            // Confirm delete Housing.
            act(() => {
                userEvent.click(getByText('Continuer'))
            })
            await waitFor(() => {
                expect(mockRemoveHousing).toHaveBeenCalled()
            })
            expect(mockRemoveHousing).toHaveBeenCalled()
        })
    })
    describe('Add meter popup, when housing does not have meter.', () => {
        test('popup add meter show up when clicking on link', async () => {
            const { getByText } = reduxedRender(
                <Router>
                    <HousingCard element={TEST_MOCKED_HOUSES[1]} reloadHousings={mockReloadHousings} />
                </Router>,
            )
            // Open add meter popup.
            act(() => {
                userEvent.click(getByText(DEFAULT_GUID_TEXT))
            })
            // Test that add meter popup is open.
            await waitFor(() => {
                expect(getByText(DEFAULT_ADD_METER_NAME_TEXT)).toBeTruthy()
                expect(getByText(DEFAULT_ADD_METER_NUMBER_TEXT)).toBeTruthy()
            })
        })
        test('Fill the informations to add meter and save correctly.', async () => {
            const { getByText, getByPlaceholderText } = reduxedRender(
                <Router>
                    <HousingCard element={TEST_MOCKED_HOUSES[1]} reloadHousings={mockReloadHousings} />
                </Router>,
            )
            // Open add meter popup.
            act(() => {
                userEvent.click(getByText(DEFAULT_GUID_TEXT))
            })

            // Test that add meter popup is open.
            await waitFor(() => {
                expect(getByText(DEFAULT_ADD_METER_NAME_TEXT)).toBeTruthy()
            })

            // Fill the form. this classes are added automaticly, got them from classes shown when testing.
            const nameInput = getByPlaceholderText(ADD_METER_NAME_PLACEHOLDER)
            const numberInput = getByPlaceholderText(ADD_METER_NUMBER_PLACEHOLDER)

            userEvent.type(nameInput, NAME_OF_MY_METER_NAME)
            userEvent.type(numberInput, NUMBER_OF_MY_METER)

            // Save the changes.
            act(() => {
                userEvent.click(getByText('Enregistrer'))
            })

            // Add meter function is called
            await waitFor(() => {
                expect(mockAddMeter).toHaveBeenCalled()
            })
        })
        test('Fill the informations to add meter and cancel the process.', async () => {
            const { getByText, getByPlaceholderText, queryByPlaceholderText } = reduxedRender(
                <Router>
                    <HousingCard element={TEST_MOCKED_HOUSES[1]} reloadHousings={mockReloadHousings} />
                </Router>,
            )
            // Open add meter popup.
            act(() => {
                userEvent.click(getByText(DEFAULT_GUID_TEXT))
            })

            // Test that add meter popup is open.
            await waitFor(() => {
                expect(getByText(DEFAULT_ADD_METER_NAME_TEXT)).toBeTruthy()
            })

            // Fill the form. this classes are added automaticly, got them from classes shown when testing.
            const nameInput = getByPlaceholderText(ADD_METER_NAME_PLACEHOLDER)
            const numberInput = getByPlaceholderText(ADD_METER_NUMBER_PLACEHOLDER)

            userEvent.type(nameInput, NAME_OF_MY_METER_NAME)
            userEvent.type(numberInput, NUMBER_OF_MY_METER)

            // Cancel the changes.
            act(() => {
                userEvent.click(getByText('Annuler'))
            })

            // Add meter function is not called and popup closed
            await waitFor(() => {
                expect(queryByPlaceholderText(ADD_METER_NAME_PLACEHOLDER)).toBeNull()
                expect(mockAddMeter).not.toHaveBeenCalled()
            })
        })
        test('Dont Fill correctly the informations to add meter.', async () => {
            const { getByText, getByPlaceholderText } = reduxedRender(
                <Router>
                    <HousingCard element={TEST_MOCKED_HOUSES[1]} reloadHousings={mockReloadHousings} />
                </Router>,
            )
            // Open add meter popup.
            act(() => {
                userEvent.click(getByText(DEFAULT_GUID_TEXT))
            })

            // Test that add meter popup is open.
            await waitFor(() => {
                expect(getByText(DEFAULT_ADD_METER_NAME_TEXT)).toBeTruthy()
            })

            // Fill the form. this classes are added automaticly, got them from classes shown when testing.
            const nameInput = getByPlaceholderText(ADD_METER_NAME_PLACEHOLDER)
            const numberInput = getByPlaceholderText(ADD_METER_NUMBER_PLACEHOLDER)

            userEvent.type(nameInput, NAME_OF_MY_METER_NAME)

            // Fill the meter number with a smaller number then needed.
            userEvent.type(numberInput, '123')

            // Save the changes.
            act(() => {
                userEvent.click(getByText('Enregistrer'))
            })

            // Add meter function is not called
            await waitFor(() => {
                expect(mockAddMeter).not.toHaveBeenCalled()
            })
        })
    })
})
