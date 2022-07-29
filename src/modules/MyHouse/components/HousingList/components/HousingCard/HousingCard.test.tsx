import { reduxedRender } from 'src/common/react-platform-components/test'
import HousingCard from 'src/modules/MyHouse/components/HousingList/components/HousingCard'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { applyCamelCase } from 'src/common/react-platform-components/utils/mm'
import { BrowserRouter as Router } from 'react-router-dom'
import { act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing.d'

const TEST_MOCKED_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

const DEFAULT_GUID_TEXT = 'Veuillez renseigner votre compteur'
const URL_TO_GUID_INSCRIPTION = '/nrlink-connection-steps'

describe('Test HousingCard', () => {
    test('When Component Mount data should be shown', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <HousingCard element={TEST_MOCKED_HOUSES[0]} />
            </Router>,
        )
        const ADDRESS_TO_SHOW = `${TEST_MOCKED_HOUSES[0].address.city}, ${TEST_MOCKED_HOUSES[0].address.zipCode}, ${TEST_MOCKED_HOUSES[0].address.country}`
        const GUID_TEXT_TO_SHOW = `Compteur n°${TEST_MOCKED_HOUSES[0].guid}`

        expect(getByText('Mon Logement à ' + TEST_MOCKED_HOUSES[0].address.city.toUpperCase())).toBeTruthy()
        expect(getByText(GUID_TEXT_TO_SHOW)).toBeTruthy()
        expect(getByText(ADDRESS_TO_SHOW)).toBeTruthy()
    })

    test('When guid is null, link should be visible', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <HousingCard element={TEST_MOCKED_HOUSES[1]} />
            </Router>,
        )
        const ADDRESS_TO_SHOW = `${TEST_MOCKED_HOUSES[1].address.city}, ${TEST_MOCKED_HOUSES[1].address.zipCode}, ${TEST_MOCKED_HOUSES[0].address.country}`

        expect(getByText(DEFAULT_GUID_TEXT)).toBeTruthy()
        expect(getByText(ADDRESS_TO_SHOW)).toBeTruthy()
    })

    test('When guid not registered, test that navlink appear', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <HousingCard element={TEST_MOCKED_HOUSES[1]} />
            </Router>,
        )

        expect(getByText(DEFAULT_GUID_TEXT)).toBeTruthy()

        // Test that the URL works.
        act(() => {
            userEvent.click(getByText(DEFAULT_GUID_TEXT))
        })

        await waitFor(() => expect(window.location.pathname).toBe(URL_TO_GUID_INSCRIPTION))
    })
})
