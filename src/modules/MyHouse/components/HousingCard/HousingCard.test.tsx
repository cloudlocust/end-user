import { reduxedRender } from 'src/common/react-platform-components/test'
import HousingCard from 'src/modules/MyHouse/components/HousingCard'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { applyCamelCase } from 'src/common/react-platform-components/utils/mm'
import { BrowserRouter as Router } from 'react-router-dom'
import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing.d'
import { models } from 'src/models'
import { init } from '@rematch/core'
import { DEFAULT_LOCALE } from 'src/configs'

const TEST_MOCKED_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

const mockRemoveHousing = jest.fn()

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

// mock store.
const store = init({
    models,
})

const mockLoadHousings = jest.spyOn(store.dispatch.housingModel, 'loadHousingsList')

describe('Test HousingCard', () => {
    beforeEach(async () => {
        await store.dispatch.translationModel.setLocale({ locale: DEFAULT_LOCALE, translations: null })
        await store.dispatch.housingModel.setHousingModelState(TEST_MOCKED_HOUSES)
    })
    describe('Test housing card', () => {
        test('When Component Mount data should be shown', async () => {
            const { getByText } = reduxedRender(
                <Router>
                    <HousingCard />
                </Router>,
                { store },
            )
            const ADDRESS_TO_SHOW = `${TEST_MOCKED_HOUSES[0].address.name}`

            expect(getByText('Mon Logement à ' + TEST_MOCKED_HOUSES[0].address.city.toUpperCase())).toBeTruthy()
            expect(getByText(ADDRESS_TO_SHOW)).toBeTruthy()
        })
    })
    describe('removeHousing, when clicking on on delete icon of card', () => {
        test('popup delete warning should open', async () => {
            const { getByRole, getByText } = reduxedRender(
                <Router>
                    <HousingCard />
                </Router>,
                { store },
            )
            // Open delete warning popup.
            userEvent.click(getByRole('button', { name: /delete/i }))

            // Test that delete warning popup is open.
            await waitFor(() => {
                expect(getByText(MODAL_POPUP_TEXT_VERIFICATION)).toBeTruthy()
            })
        })
        test('annuler popup delete warning should close popup', async () => {
            const { getByRole, getByText } = reduxedRender(
                <Router>
                    <HousingCard />
                </Router>,
                { store },
            )
            // Open delete warning popup.
            userEvent.click(getByRole('button', { name: /delete/i }))

            // Test that delete warning popup is open.
            await waitFor(() => {
                expect(getByText(MODAL_POPUP_TEXT_VERIFICATION)).toBeTruthy()
            })
            // Close delete warning popup.
            userEvent.click(getByText('Annuler'))

            // Test that delete warning popup is closed.
            await waitFor(() => {
                expect(() => getByText(MODAL_POPUP_TEXT_VERIFICATION)).toThrow()
            })
        })
        test('removeHousing function hook should be called, and loadHousings', async () => {
            const { getByRole, getByText } = reduxedRender(
                <Router>
                    <HousingCard />
                </Router>,
                { store },
            )
            // Open delete warning popup.
            userEvent.click(getByRole('button', { name: /delete/i }))

            // Test that delete warning popup is open.
            await waitFor(() => {
                expect(getByText(MODAL_POPUP_TEXT_VERIFICATION)).toBeTruthy()
            })
            // Confirm delete Housing.
            userEvent.click(getByText('Continuer'))

            await waitFor(() => {
                expect(mockRemoveHousing).toHaveBeenCalled()
            })
            expect(mockLoadHousings).toHaveBeenCalledTimes(1)
        })
    })
})
