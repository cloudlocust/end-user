import { reduxedRender } from 'src/common/react-platform-components/test'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { applyCamelCase } from 'src/common/react-platform-components'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import ConnectedPlugsPage from 'src/modules/MyHouse/components/ConnectedPlugs'
import { fireEvent, waitFor } from '@testing-library/react'
import { act } from '@testing-library/react-hooks'
import { TEST_CONNECTED_PLUGS } from 'src/mocks/handlers/connectedPlugs'
import { IConnectedPlug } from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugs.d'
import dayjs from 'dayjs'

const GO_BACK_TEXT = 'Retour'
const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)
const MOCK_TEST_CONNECTED_plugs: IConnectedPlug[] = applyCamelCase(TEST_CONNECTED_PLUGS)
let mockConnectedPlugsList = MOCK_TEST_CONNECTED_plugs
const mockHistoryGoBack = jest.fn()
const CONNECTED_PLUGS_HEADER_TEXT = 'Prises connectées Shelly'
const CONNECTED_PLUGS_EMPTY_TEXT = 'Prises connectées Shelly'
const CONNECTED_PLUG_CONSENT_EXIST_TEXT = 'Connectée le'
const CONNECTED_PLUG_CONSENT_NOT_EXIST_TEXT = 'Non Connectée'

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

let mockLoadingInProgress = false
let mockTotalConnectedPlugs = 0

// Mock useInstallationRequestsList hook
jest.mock('src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook', () => ({
    ...jest.requireActual('src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConnectedPlugList: () => ({
        elementList: mockConnectedPlugsList,
        loadingInProgress: mockLoadingInProgress,
        totalElementList: mockTotalConnectedPlugs,
    }),
}))

const LOADING_TEXT = 'Chargement...'

describe('ConnectedPlugs component', () => {
    describe('ConnectedPlugsHeader', () => {
        test('Should go back at previous location, when user click on Back Button', async () => {
            const { getByText } = reduxedRender(<ConnectedPlugsPage />, {
                initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } },
            })

            expect(getByText(CONNECTED_PLUGS_HEADER_TEXT)).toBeTruthy()

            act(() => {
                fireEvent.click(getByText(GO_BACK_TEXT))
            })

            await waitFor(
                () => {
                    expect(mockHistoryGoBack).toHaveBeenCalled()
                },
                { timeout: 5000 },
            )
        })
    })

    describe('Connected Plug List Test', () => {
        test('when Connected Plugs List', async () => {
            mockConnectedPlugsList = MOCK_TEST_CONNECTED_plugs.slice(0, 2)
            const { getByText } = reduxedRender(<ConnectedPlugsPage />, {
                initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } },
            })

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
        test('when connected plugs are empty', async () => {
            mockConnectedPlugsList = []
            const { getByText } = reduxedRender(<ConnectedPlugsPage />, {
                initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } },
            })
            expect(getByText(CONNECTED_PLUGS_EMPTY_TEXT)).toBeTruthy()
        })

        test('when loading is true', async () => {
            mockLoadingInProgress = true
            const { getByText } = reduxedRender(<ConnectedPlugsPage />, {
                initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } },
            })
            expect(mockLoadingInProgress).toBeTruthy()
            expect(getByText(LOADING_TEXT)).toBeTruthy()
        })
    })
})
