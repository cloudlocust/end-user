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

/**
 * Mocking the react-router-dom for houseId in useParams.
 */
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        replace: mockReplace,
    }),
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

    test('When currentHousing is valid, it should redirect to housing details and loading is shown meanwhile', async () => {
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
            // { store },
        )
        expect(getByText(NO_CURRENT_HOUSING_ERROR)).toBeTruthy()
    })
})
