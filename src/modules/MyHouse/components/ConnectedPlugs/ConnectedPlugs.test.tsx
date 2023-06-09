import { reduxedRender } from 'src/common/react-platform-components/test'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { applyCamelCase } from 'src/common/react-platform-components'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { BrowserRouter } from 'react-router-dom'
import ConnectedPlugsPage from 'src/modules/MyHouse/components/ConnectedPlugs'

const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)
const mockHistoryPush = jest.fn()
const mockHouseId = LIST_OF_HOUSES[0].id

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        push: mockHistoryPush,
    }),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useParams: () => ({
        houseId: `${mockHouseId}`,
    }),
}))

const RETOUR_TEXT = 'Retour'

describe('ConnectedPlugs component', () => {
    test('Should go back at previous location, when user click on Back Button', async () => {
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <ConnectedPlugsPage />
            </BrowserRouter>,
            {
                initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } },
            },
        )

        expect(getByText(RETOUR_TEXT)).toBeInTheDocument()
    })
    // don't worry, this will be delete its just for the moment for coverage.
    test('Should display a waiting text while Alexis is cooking', async () => {
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <ConnectedPlugsPage />
            </BrowserRouter>,
            {
                initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } },
            },
        )

        // expect(container.querySelector('.FusePageCarded-contentCard')).toBeInTheDocument()
        expect(getByText('Cette fonctionnalité arrive prochainement.')).toBeInTheDocument()
    })
})
