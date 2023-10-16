import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import { applyCamelCase } from 'src/common/react-platform-components'
import { waitFor } from '@testing-library/react'
import { MyHouse, URL_MY_HOUSE } from 'src/modules/MyHouse'
import { DEFAULT_LOCALE } from 'src/configs'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing.d'
import { init } from '@rematch/core'
import { models } from 'src/models'

const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

let mockReplace = jest.fn()
const NO_CURRENT_HOUSING_ERROR = 'Veuillez sélectionner un logement pour voir ses détails.'
const circularProgressClassname = '.MuiCircularProgress-root'
const HOUSING_DETAILS_TEXT = 'HOUSING_DETAILS_TEXT'
let mockHouseId = '' + LIST_OF_HOUSES[0].id

/**
 * Mocking the react-router-dom for houseId in useParams.
 */
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        replace: mockReplace,
    }),
    /**
     * Mock the useParams to get the houseId from url.
     *
     * @returns UseParams containing houseId.
     */
    useParams: () => ({
        houseId: mockHouseId,
    }),
}))

jest.mock('src/modules/MyHouse/MyHouseConfig', () => ({
    ...jest.requireActual('src/modules/MyHouse/MyHouseConfig'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    URL_MY_HOUSE: '/my-house',
}))

/**
 * Mocking the HousingDetails.
 */
jest.mock('src/modules/MyHouse/components/HousingDetails', () => ({
    ...jest.requireActual('src/modules/MyHouse/components/HousingDetails'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    HousingDetails: () => <h1>{HOUSING_DETAILS_TEXT}</h1>,
}))

// mock store.
const store = init({
    models,
})

describe('Test MyHouse Component', () => {
    beforeEach(async () => {
        await store.dispatch.translationModel.setLocale({ locale: DEFAULT_LOCALE, translations: null })
        await store.dispatch.housingModel.setHousingModelState(LIST_OF_HOUSES)
    })

    test('When currentHousing is valid, and redirection happened, HousingDetails should show', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <MyHouse />
            </Router>,
            { store },
        )

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith(URL_MY_HOUSE + '/' + TEST_HOUSES[0].id)
        })
        expect(getByText(HOUSING_DETAILS_TEXT)).toBeTruthy()
    })

    test('When currentHousing is valid, but no redirection yet or houseId is invalid loading is shown', async () => {
        mockHouseId = 'fake'
        const { container } = reduxedRender(
            <Router>
                <MyHouse />
            </Router>,
            { store },
        )
        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith(URL_MY_HOUSE + '/' + TEST_HOUSES[0].id)
        })
        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
    })

    test('when currentHousing is null, Error message is shown', async () => {
        await store.dispatch.housingModel.setHousingModelState([])

        const { getByText } = reduxedRender(
            <Router>
                <MyHouse />
            </Router>,
        )
        await waitFor(() => {
            expect(getByText(NO_CURRENT_HOUSING_ERROR)).toBeTruthy()
        })
        expect(mockReplace).not.toHaveBeenCalled()
    })
})
