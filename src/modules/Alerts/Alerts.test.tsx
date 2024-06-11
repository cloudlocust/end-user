import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import { applyCamelCase } from 'src/common/react-platform-components'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { URL_MY_HOUSE } from 'src/modules/MyHouse'
import Alerts from 'src/modules/Alerts'
import { TEST_DATETIME } from 'src/mocks/handlers/contracts'
import { TEST_OFFERS } from 'src/mocks/handlers/commercialOffer'
import { TEST_PROVIDERS } from 'src/mocks/handlers/commercialOffer'
import { TEST_CONTRACT_TYPES } from 'src/mocks/handlers/commercialOffer'

// List of houses to add to the redux state
const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)
let mockHasMissingHousingContracts = false
const HAS_MISSING_CONTRACTS_WARNING_REDIRECT_LINK_TEXT = 'Renseignez votre contrat de fourniture'
const TEMPO_COMPONENT_TEXT = 'Tempo :'
let mockUseNovuAlertPreferences = false
const circularProgressClassname = '.MuiCircularProgress-root'
let mockManualContractFillingIsEnabled = true

const mockContracts = [
    {
        id: 1,
        commercialOffer: { ...TEST_OFFERS[0], provider: TEST_PROVIDERS[0] },
        tariffType: { name: 'Jour Tempo', id: 1 },
        contractType: TEST_CONTRACT_TYPES[0],
        power: 6,
        startSubscription: TEST_DATETIME,
    },
]

/**
 * Mocking the useContractList.
 */
jest.mock('src/modules/Contracts/contractsHook', () => ({
    ...jest.requireActual('src/modules/Contracts/contractsHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useContractList: () => ({
        elementList: mockContracts,
    }),
}))

// Mock useHasMissingHousingContracts.
jest.mock('src/hooks/HasMissingHousingContracts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHasMissingHousingContracts: () => ({
        hasMissingHousingContracts: mockHasMissingHousingContracts,
    }),
}))

jest.mock('src/modules/Alerts/NovuAlertPreferencesHook', () => ({
    ...jest.requireActual('src/modules/Alerts/NovuAlertPreferencesHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useNovuAlertPreferences: () => ({
        isLoadingInProgress: mockUseNovuAlertPreferences,
        getNovuAlertPreferences: jest.fn(),
        novuAlertPreferences: {
            isEmailTempo: false,
            isPushTempo: false,
        },
    }),
}))

jest.mock('src/modules/MyHouse/MyHouseConfig', () => ({
    ...jest.requireActual('src/modules/MyHouse/MyHouseConfig'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    get manualContractFillingIsEnabled() {
        return mockManualContractFillingIsEnabled
    },
}))

describe('Alerts test', () => {
    test('When mount component show change, and tempo available', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <Alerts />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        // HasMissingContractsExample Text
        expect(() => getByText(HAS_MISSING_CONTRACTS_WARNING_REDIRECT_LINK_TEXT)).toThrow()
        expect(getByText(TEMPO_COMPONENT_TEXT)).toBeTruthy()
    })
    test('When manual contract filling is enabled and hasMissingHousingContracts change', async () => {
        mockHasMissingHousingContracts = true
        const { getByText } = reduxedRender(
            <Router>
                <Alerts />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        // HasMissingContractsExample Redirection URL
        expect(getByText(HAS_MISSING_CONTRACTS_WARNING_REDIRECT_LINK_TEXT).parentElement!.closest('a')).toHaveAttribute(
            'href',
            `${URL_MY_HOUSE}/${LIST_OF_HOUSES[0].id}/contracts`,
        )
    })
    test('When manual contract filling is disabled, Missing housing contract does not show', async () => {
        mockHasMissingHousingContracts = true
        mockManualContractFillingIsEnabled = false
        const { queryByText } = reduxedRender(
            <Router>
                <Alerts />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        // HasMissingContractsExample Redirection URL
        expect(queryByText(HAS_MISSING_CONTRACTS_WARNING_REDIRECT_LINK_TEXT)).not.toBeInTheDocument()
    })
    test('When Ecowatt load, Spinner is shown', async () => {
        mockUseNovuAlertPreferences = true
        mockHasMissingHousingContracts = true
        const { container } = reduxedRender(
            <Router>
                <Alerts />
            </Router>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
    })
})
