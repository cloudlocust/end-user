import { reduxedRender } from 'src/common/react-platform-components/test'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { applyCamelCase } from 'src/common/react-platform-components'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import ConnectedPlugsList from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugsList'
import { TEST_CONNECTED_PLUGS } from 'src/mocks/handlers/connectedPlugs'
import { IConnectedPlug } from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugs.d'
import dayjs from 'dayjs'
import { BrowserRouter as Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)
const MOCK_TEST_CONNECTED_PLUGS: IConnectedPlug[] = applyCamelCase(TEST_CONNECTED_PLUGS)
const ADD_CONNECTED_PLUG_BUTTON_TEXT = 'Ajouter une prise'
let mockConnectedPlugsList = MOCK_TEST_CONNECTED_PLUGS
const mockHistoryGoBack = jest.fn()
const mockOpenShellyConnectedPlugs = jest.fn()
const CONNECTED_PLUGS_EMPTY_TEXT = `Aucune prise connectée n'a encore été renseignée, cliquez "configuration" pour ouvrir l'onglet de paramètrage des prises connectée.`
const CONNECTED_PLUG_CONSENT_EXIST_TEXT = 'Connectée le'
const CONFIGURE_SHELLY_TEXT = 'Configuration'
const CONNECTED_PLUG_CONSENT_NOT_EXIST_TEXT = 'Non Connectée'

const mockHouseId = LIST_OF_HOUSES[0].meter?.guid

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

let mockLoadingInProgress = false

// Mock useInstallationRequestsList hook
jest.mock('src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook', () => ({
    ...jest.requireActual('src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConnectedPlugList: () => ({
        connectedPlugList: mockConnectedPlugsList,
        loadingInProgress: mockLoadingInProgress,
    }),

    // eslint-disable-next-line jsdoc/require-jsdoc
    useShellyConnectedPlugs: () => ({
        openShellyConnectedPlugs: mockOpenShellyConnectedPlugs,
    }),
}))

const LOADING_TEXT = 'Chargement...'

describe('ConnectedPlugList component', () => {
    test('when Connected Plugs List', async () => {
        mockConnectedPlugsList = MOCK_TEST_CONNECTED_PLUGS.slice(0, 2)
        const { getByText } = reduxedRender(
            <Router>
                <ConnectedPlugsList />
            </Router>,
            {
                initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0], housingList: LIST_OF_HOUSES } },
            },
        )

        expect(getByText(mockConnectedPlugsList[0].deviceId)).toBeTruthy()
        expect(getByText(CONNECTED_PLUG_CONSENT_EXIST_TEXT, { exact: false })).toBeTruthy()
        expect(
            getByText(dayjs.utc(mockConnectedPlugsList[0].createdAt).local().format('DD/MM/YYYY'), {
                exact: false,
            }),
        ).toBeTruthy()
        expect(getByText(mockConnectedPlugsList[1].deviceId)).toBeTruthy()
        expect(getByText(CONNECTED_PLUG_CONSENT_NOT_EXIST_TEXT, { exact: false })).toBeTruthy()
    })
    describe('Opening shelly window', () => {
        test('Clicking on Add Connected Plug in Header', async () => {
            const { getByText } = reduxedRender(
                <Router>
                    <ConnectedPlugsList />
                </Router>,
                {
                    initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0], housingList: LIST_OF_HOUSES } },
                },
            )
            userEvent.click(getByText(ADD_CONNECTED_PLUG_BUTTON_TEXT))
            expect(mockOpenShellyConnectedPlugs).toHaveBeenCalled()
        })

        test('When Connected plug list is empty, Clicking on Configuration', async () => {
            mockConnectedPlugsList = []
            const { getByText } = reduxedRender(
                <Router>
                    <ConnectedPlugsList />
                </Router>,
                {
                    initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0], housingList: LIST_OF_HOUSES } },
                },
            )

            expect(getByText(CONNECTED_PLUGS_EMPTY_TEXT)).toBeTruthy()

            userEvent.click(getByText(CONFIGURE_SHELLY_TEXT))
            expect(mockOpenShellyConnectedPlugs).toHaveBeenCalled()
        })
    })

    test('when loading is true', async () => {
        mockLoadingInProgress = true
        const { getByText } = reduxedRender(
            <Router>
                <ConnectedPlugsList />
            </Router>,
            {
                initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0], housingList: LIST_OF_HOUSES } },
            },
        )
        expect(mockLoadingInProgress).toBeTruthy()
        expect(getByText(LOADING_TEXT)).toBeTruthy()
    })
})
