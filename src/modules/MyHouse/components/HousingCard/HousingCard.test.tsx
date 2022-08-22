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
const mockReloadHousings = jest.fn()

const DEFAULT_GUID_TEXT = 'Veuillez renseigner votre compteur'
const MODAL_POPUP_TEXT_VERIFICATION = 'Êtes-vous sûr de vouloir continuer ?'

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
})
