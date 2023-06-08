import { reduxedRender } from 'src/common/react-platform-components/test'
import Accomodation from 'src/modules/MyHouse/components/Accomodation'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { applyCamelCase } from 'src/common/react-platform-components'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { BrowserRouter } from 'react-router-dom'

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

describe('Accomation component', () => {
    test('when clicked on return, route changes', async () => {
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <Accomodation />
            </BrowserRouter>,
            {
                initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } },
            },
        )

        expect(getByText(RETOUR_TEXT)).toBeInTheDocument()
    })
    test('Content is shown', async () => {
        const { container } = reduxedRender(
            <BrowserRouter>
                <Accomodation />
            </BrowserRouter>,
            {
                initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } },
            },
        )

        expect(container.querySelector('.FusePageCarded-contentCard')).toBeInTheDocument()
    })
})
