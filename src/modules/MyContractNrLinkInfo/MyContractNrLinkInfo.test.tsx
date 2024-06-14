import { init } from '@rematch/core'
import { BrowserRouter as Router } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MyContractNrLinkInfo } from 'src/modules/MyContractNrLinkInfo'
import { models } from 'src/models'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { applyCamelCase } from 'src/common/react-platform-components'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { IConnectedPlug } from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugs'
import { TEST_CONNECTED_PLUGS } from 'src/mocks/handlers/connectedPlugs'
import { DEFAULT_LOCALE } from 'src/configs'
import * as houseConfig from 'src/modules/MyHouse/MyHouseConfig'

const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)
const MOCK_TEST_CONNECTED_PLUGS: IConnectedPlug[] = applyCamelCase(TEST_CONNECTED_PLUGS)
let mockConnectedPlugsList = MOCK_TEST_CONNECTED_PLUGS

let mockHouseId = LIST_OF_HOUSES[0].id
let mockConnectedPlugListLoadingInProgress = false

let mockLoadConnectedPlugList = jest.fn()

// mock store.
const store = init({
    models,
})

/**
 * Mock House Config.
 */

// eslint-disable-next-line jsdoc/require-jsdoc
const mockHouseConfig = houseConfig as { connectedPlugsFeatureState: boolean }

// Mock useInstallationRequestsList hook
jest.mock('src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook', () => ({
    ...jest.requireActual('src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConnectedPlugList: () => ({
        connectedPlugList: mockConnectedPlugsList,
        loadingInProgress: mockConnectedPlugListLoadingInProgress,
        // eslint-disable-next-line jsdoc/require-jsdoc
        getProductionConnectedPlug: () => undefined,
        loadConnectedPlugList: mockLoadConnectedPlugList,
    }),
}))

describe('test MyContractNrLinkInfo', () => {
    beforeEach(async () => {
        await store.dispatch.translationModel.setLocale({ locale: DEFAULT_LOCALE, translations: null })
        await store.dispatch.housingModel.setHousingModelState(LIST_OF_HOUSES)
    })
    test('the title the meter part are showing correctly', async () => {
        await store.dispatch.housingModel.setCurrentHousingState(mockHouseId)
        const { getByText } = reduxedRender(
            <Router>
                <MyContractNrLinkInfo />
            </Router>,
            { store },
        )
        expect(getByText('Mes paramètres (Contrat, nrLINK, PDL)')).toBeInTheDocument()
        expect(getByText('Mon Logement à MONACO')).toBeInTheDocument()
        expect(getByText('the name of something')).toBeInTheDocument()
        expect(getByText('Compteur')).toBeInTheDocument()
        expect(getByText('n° 12345678911234')).toBeInTheDocument()
    })

    describe('Should display connectedPlugs correctly', () => {
        test('connectedPlugList loaded, detail card should show correctly', async () => {
            mockConnectedPlugsList = [MOCK_TEST_CONNECTED_PLUGS[0]]
            const { getByText } = reduxedRender(
                <Router>
                    <MyContractNrLinkInfo />
                </Router>,
                { store },
            )
            expect(getByText('Mes prises connectées')).toBeInTheDocument()
            expect(getByText(MOCK_TEST_CONNECTED_PLUGS[0].deviceName)).toBeInTheDocument()
            expect(getByText('Prise 2')).toBeInTheDocument()
            expect(getByText('Prise 3')).toBeInTheDocument()
        })

        test('Should display correctly skeleton data when empty', async () => {
            mockConnectedPlugsList = []
            const { getByText } = reduxedRender(
                <Router>
                    <MyContractNrLinkInfo />
                </Router>,
                { store },
            )
            expect(getByText('Prise 1')).toBeInTheDocument()
            expect(getByText('Prise 2')).toBeInTheDocument()
            expect(getByText('Prise 3')).toBeInTheDocument()
        })

        test('Should not display when Enphase is disabled', async () => {
            mockHouseConfig.connectedPlugsFeatureState = false
            process.env.REACT_APP_CONNECTED_PLUGS_FEATURE_STATE = 'disabled'
            const { queryByText } = reduxedRender(
                <Router>
                    <MyContractNrLinkInfo />
                </Router>,
                { store },
            )
            expect(queryByText('Mes prises connectées')).not.toBeInTheDocument()
            expect(queryByText('Prise 1')).not.toBeInTheDocument()

            process.env.REACT_APP_CONNECTED_PLUGS_FEATURE_STATE = 'enabled'
        })
    })
})
