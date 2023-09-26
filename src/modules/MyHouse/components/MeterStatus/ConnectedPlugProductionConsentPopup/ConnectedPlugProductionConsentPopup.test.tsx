import { reduxedRender } from 'src/common/react-platform-components/test'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { applyCamelCase } from 'src/common/react-platform-components'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { TEST_CONNECTED_PLUGS } from 'src/mocks/handlers/connectedPlugs'
import { IConnectedPlug } from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugs.d'
import { BrowserRouter as Router } from 'react-router-dom'
import ConnectedPlugProductionConsentPopup from 'src/modules/MyHouse/components/MeterStatus/ConnectedPlugProductionConsentPopup'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'

const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)
const MOCK_TEST_CONNECTED_PLUGS: IConnectedPlug[] = applyCamelCase(TEST_CONNECTED_PLUGS)
const CONFIGURE_SHELLY_TEXT = 'Configurer'
let mockConnectedPlugsList = MOCK_TEST_CONNECTED_PLUGS
let mockAssociateConnectedPlug = jest.fn()
let mockLoadConnectedPlugList = jest.fn()
const mockHistoryGoBack = jest.fn()
const mockHistoryPush = jest.fn()
const mockOpenShellyConnectedPlugsWindow = jest.fn()
const CONNECTED_PLUGS_EMPTY_TEXT = `Aucune prise détectée. Renseignez vos prises connectées Shelly dans l'espace dedié`
const ASSOCIATE_BUTTON_TEXT = 'Enregistrer'
const circularProgressRole = 'progressbar'
const checkedOptionClassname = 'Mui-checked'
const mockHouseId = LIST_OF_HOUSES[0].meter?.id
const mockHouseMeterGuid = LIST_OF_HOUSES[0].meter?.guid

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),

    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        push: mockHistoryPush,
        goBack: mockHistoryGoBack,
        listen: jest.fn(), // mocked for FuseScroll
    }),

    // eslint-disable-next-line jsdoc/require-jsdoc
    useParams: () => ({
        houseId: mockHouseId,
    }),
}))

// need to mock this because myHouseConfig uses it
jest.mock('src/modules/MyHouse/utils/MyHouseHooks.ts', () => ({
    ...jest.requireActual('src/modules/MyHouse/utils/MyHouseHooks.ts'),
    //eslint-disable-next-line
    arePlugsUsedBasedOnProductionStatus: () => true,
}))

let mockLoadingInProgress = false

// Mock useInstallationRequestsList hook
jest.mock('src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook', () => ({
    ...jest.requireActual('src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConnectedPlugList: () => ({
        connectedPlugList: mockConnectedPlugsList,
        loadingInProgress: mockLoadingInProgress,
        associateConnectedPlug: mockAssociateConnectedPlug,
        loadConnectedPlugList: mockLoadConnectedPlugList,
    }),

    // eslint-disable-next-line jsdoc/require-jsdoc
    useShellyConnectedPlugs: () => ({
        openShellyConnectedPlugsWindow: mockOpenShellyConnectedPlugsWindow,
    }),
}))

describe('ConnectedPlugProductionConsentPopup component', () => {
    test('When Connected plug list is empty, Clicking on Configuration', async () => {
        mockConnectedPlugsList = []
        const { getByText } = reduxedRender(
            <Router>
                <ConnectedPlugProductionConsentPopup />
            </Router>,
            {
                initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0], housingList: LIST_OF_HOUSES } },
            },
        )

        expect(getByText(CONNECTED_PLUGS_EMPTY_TEXT)).toBeTruthy()

        userEvent.click(getByText(CONFIGURE_SHELLY_TEXT))
        expect(mockOpenShellyConnectedPlugsWindow).toHaveBeenCalled()
    })

    test('Opening shelly window when Clicking on Configure', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <ConnectedPlugProductionConsentPopup />
            </Router>,
            {
                initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0], housingList: LIST_OF_HOUSES } },
            },
        )
        userEvent.click(getByText(CONFIGURE_SHELLY_TEXT))
        expect(mockOpenShellyConnectedPlugsWindow).toHaveBeenCalled()
    })

    test('When loading is true, spinner is shown', async () => {
        mockLoadingInProgress = true
        const { getByRole } = reduxedRender(
            <Router>
                <ConnectedPlugProductionConsentPopup />
            </Router>,
            {
                initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0], housingList: LIST_OF_HOUSES } },
            },
        )

        expect(getByRole(circularProgressRole)).toBeInTheDocument()
    })

    describe('SelectConnectedPlugProductionList', () => {
        test('when Connected Plugs List are display', async () => {
            mockLoadingInProgress = false
            mockConnectedPlugsList = MOCK_TEST_CONNECTED_PLUGS.slice(0, 2)
            const { getByText } = reduxedRender(
                <Router>
                    <ConnectedPlugProductionConsentPopup />
                </Router>,
                {
                    initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0], housingList: LIST_OF_HOUSES } },
                },
            )

            expect(getByText(mockConnectedPlugsList[0].deviceName)).toBeTruthy()
            expect(getByText(mockConnectedPlugsList[1].deviceName)).toBeTruthy()
        })

        test('when Selecting a connected plug and submitting, associate connected plug should be called and history pushed', async () => {
            mockAssociateConnectedPlug = jest.fn().mockImplementationOnce(() => true)
            const { getByLabelText, getByText } = reduxedRender(
                <Router>
                    <ConnectedPlugProductionConsentPopup />
                </Router>,
                {
                    initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0], housingList: LIST_OF_HOUSES } },
                },
            )

            userEvent.click(getByLabelText(mockConnectedPlugsList[0].deviceName))

            const selectedConnectedPlugOption = getByLabelText(mockConnectedPlugsList[0].deviceName)
                .parentElement as HTMLDivElement

            expect(selectedConnectedPlugOption.classList.contains(checkedOptionClassname)).toBeTruthy()
            userEvent.click(getByText(ASSOCIATE_BUTTON_TEXT))
            await waitFor(() => {
                expect(mockAssociateConnectedPlug).toHaveBeenCalledWith(
                    mockConnectedPlugsList[0].deviceId,
                    mockHouseId,
                    mockHouseMeterGuid,
                )
            })
            expect(mockHistoryPush).toHaveBeenCalledWith(`${URL_MY_HOUSE}/${mockHouseId}/connected-plugs`)
        })
    })
})
