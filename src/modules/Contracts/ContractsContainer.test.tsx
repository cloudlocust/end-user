import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import { applyCamelCase } from 'src/common/react-platform-components'
import { waitFor } from '@testing-library/react'
import { URL_MY_HOUSE } from 'src/modules/MyHouse'
import { Contracts } from 'src/modules/Contracts'
import { DEFAULT_LOCALE } from 'src/configs'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing.d'
import { init } from '@rematch/core'
import { models } from 'src/models'

const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

let mockReplace = jest.fn()
const circularProgressClassname = '.MuiCircularProgress-root'
const CONTRACT_LIST_TEXT = 'CONTRACT_LIST_TEXT'
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

/**
 * Mocking the ContractList.
 */
jest.mock(
    'src/modules/Contracts/components/ContractList',
    // eslint-disable-next-line jsdoc/require-jsdoc
    () => () => <h1>{CONTRACT_LIST_TEXT}</h1>,
)

// mock store.
const store = init({
    models,
})

describe('Test Contracts Component', () => {
    beforeEach(async () => {
        await store.dispatch.translationModel.setLocale({ locale: DEFAULT_LOCALE, translations: null })
        await store.dispatch.housingModel.setHousingModelState(LIST_OF_HOUSES)
    })

    test('When Component mount and no select currentHousing happened, then history shouldnt change', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <Contracts />
            </Router>,
            { store },
        )

        await waitFor(() => {
            expect(mockReplace).not.toHaveBeenCalled()
        })
        // Contracts rerender
        expect(getByText(CONTRACT_LIST_TEXT)).toBeTruthy()
    })

    test('When Component mount and select currentHousing happened, then while history change spinner is shown', async () => {
        const { container } = reduxedRender(
            <Router>
                <Contracts />
            </Router>,
            { store },
        )

        // Select the current housing
        store.dispatch.housingModel.setCurrentHousingState(LIST_OF_HOUSES[1].id)
        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith(URL_MY_HOUSE + '/' + TEST_HOUSES[1].id + '/contracts')
        })
        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
    })

    // test('When currentHousing is valid, but no redirection yet or houseId is invalid loading is shown', async () => {
    //     mockHouseId = 'fake'
    //     const { container } = reduxedRender(
    //         <Router>
    //             <Contracts />
    //         </Router>,
    //         { store },
    //     )
    //     await waitFor(() => {
    //         expect(mockReplace).toHaveBeenCalledWith(URL_MY_HOUSE + '/' + TEST_HOUSES[0].id)
    //     })
    //     expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
    // })

    // test('when currentHousing is null, Error message is shown', async () => {
    //     await store.dispatch.housingModel.setHousingModelState([])

    //     const { getByText } = reduxedRender(
    //         <Router>
    //             <Contracts />
    //         </Router>,
    //     )
    //     await waitFor(() => {
    //         expect(getByText(NO_CURRENT_HOUSING_ERROR)).toBeTruthy()
    //     })
    //     expect(mockReplace).not.toHaveBeenCalled()
    // })
})
