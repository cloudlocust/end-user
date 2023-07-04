import { reduxedRender } from 'src/common/react-platform-components/test'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { applyCamelCase } from 'src/common/react-platform-components'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import ConnectedPlugsPage from 'src/modules/MyHouse/components/ConnectedPlugs'
import { fireEvent, waitFor } from '@testing-library/react'
import { act } from '@testing-library/react-hooks'

const RETOUR_TEXT = 'Retour'
const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)
const mockHistoryGoBack = jest.fn()
const mockHouseId = 1

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),

    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        goBack: mockHistoryGoBack,
        listen: jest.fn(), // mocked for FuseScroll
    }),

    // eslint-disable-next-line jsdoc/require-jsdoc
    useParams: () => ({
        houseId: mockHouseId,
    }),
}))

describe('ConnectedPlugs component', () => {
    test('Should go back at previous location, when user click on Back Button', async () => {
        const { getByText } = reduxedRender(<ConnectedPlugsPage />, {
            initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } },
        })

        act(() => {
            fireEvent.click(getByText(RETOUR_TEXT))
        })

        await waitFor(
            () => {
                expect(mockHistoryGoBack).toHaveBeenCalled()
            },
            { timeout: 5000 },
        )
    })
    // don't worry, this will be delete its just for the moment for coverage.
    test('Should display a waiting text while Alexis is cooking', async () => {
        const { getByText } = reduxedRender(<ConnectedPlugsPage />, {
            initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } },
        })

        expect(getByText('Cette fonctionnalité arrive prochainement.')).toBeInTheDocument()
    })
})
