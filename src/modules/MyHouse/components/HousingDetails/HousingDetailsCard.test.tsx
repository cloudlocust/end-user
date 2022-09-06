import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { applyCamelCase } from 'src/common/react-platform-components'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import HousingDetailsCard from 'src/modules/MyHouse/components/HousingDetails/HousingDetailsCard'
import { ReactComponent as SuperficieIcon } from 'src/assets/images/content/housing/Superficie.svg'
import { ReactComponent as OccupantIcon } from 'src/assets/images/content/housing/Occupant.svg'
import { ReactComponent as MainIcon } from 'src/assets/images/content/housing/Main.svg'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import { HousingCardTypeOfDetails } from 'src/modules/MyHouse/components/HousingDetails/housingDetails'

// mocks text and icons
const SUPERFICIE_ICON = 'Superficie.svg'
const SUPERFICIE_TEXT = 'superficie'

const OCCUPANT_ICON = 'Occupant.svg'
const OCCUPANT_TEXT = "Nombre d'occupants"

const MAIN_ICON = 'Main.svg'
const MAIN_TEXT = 'Type de logement'

// mock housing id for the useParams from url.

const TEST_MOCKED_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)
let mockHouseId = TEST_MOCKED_HOUSES[0].id

// mock housing details props
const mockTitle = 'Informations logement'
const mockTypeOfDetails: HousingCardTypeOfDetails = 'accomodation'
let mockIsConfigured = true
let mockIsLoadingInProgress = false

// mock an array of elements to display
const mockElements = [
    {
        icon: <MainIcon />,
        label: MAIN_TEXT,
    },
    {
        icon: <OccupantIcon />,
        label: OCCUPANT_TEXT,
    },
    {
        icon: <SuperficieIcon />,
        label: SUPERFICIE_TEXT,
    },
]

let mockHousingDetailsCardProps = {
    title: mockTitle,
    elements: mockElements,
    typeOfDetails: mockTypeOfDetails,
    isConfigured: mockIsConfigured,
    loadingInProgress: mockIsLoadingInProgress,
}

/**
 * Mocking the useParams used in "accomodationForm" to get the house id based on url /houses/:houseId/accomodation {houseId} params.
 */
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    /**
     * Mock the react-router useParams hooks.
     *
     * @returns The react-router useParams hook.
     */
    useParams: () => ({
        houseId: mockHouseId,
    }),
}))

describe('Test HousingDetailsCard', () => {
    test('When passing elements to housing details card they show correctly', async () => {
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <HousingDetailsCard {...mockHousingDetailsCardProps} />
            </BrowserRouter>,
        )

        // icons displayed
        expect(getByText(SUPERFICIE_ICON)).toBeTruthy()
        expect(getByText(OCCUPANT_ICON)).toBeTruthy()
        expect(getByText(MAIN_ICON)).toBeTruthy()

        // text displayed
        expect(getByText(SUPERFICIE_TEXT)).toBeTruthy()
        expect(getByText(OCCUPANT_TEXT)).toBeTruthy()
        expect(getByText(MAIN_TEXT)).toBeTruthy()
    })
    test('When isConfigured is true the button modify should appear', async () => {
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <HousingDetailsCard {...mockHousingDetailsCardProps} />
            </BrowserRouter>,
        )

        expect(getByText('Modifier')).toBeTruthy()
    })
    test('When isConfigured is false the button configuration should appear', async () => {
        mockHousingDetailsCardProps.isConfigured = false
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <HousingDetailsCard {...mockHousingDetailsCardProps} />
            </BrowserRouter>,
        )

        expect(getByText('Configuration')).toBeTruthy()
    })
    test('Navlink points to the correct page.', async () => {
        const { container } = reduxedRender(
            <BrowserRouter>
                <HousingDetailsCard {...mockHousingDetailsCardProps} />
            </BrowserRouter>,
        )

        expect(container.getElementsByTagName('a')[0].href).toContain(
            `${URL_MY_HOUSE}/${mockHouseId}/${mockTypeOfDetails}`,
        )
    })
})
