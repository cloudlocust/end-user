import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import { applyCamelCase } from 'src/common/react-platform-components'
import { HousingDetails } from 'src/modules/MyHouse/components/HousingDetails'
import { DEFAULT_LOCALE } from 'src/configs'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing.d'
import { init } from '@rematch/core'
import { models } from 'src/models'
import { AccomodationDataType } from 'src/modules/MyHouse/components/Accomodation/AccomodationType.d'
import { TEST_ACCOMODATION_RESPONSE as MOCK_TEST_ACCOMODATION_RESPONSE } from 'src/mocks/handlers/accomodation'
import { TEST_HOUSING_EQUIPMENTS as MOCK_EQUIPMENTS } from 'src/mocks/handlers/equipments'
import { IEquipmentMeter } from 'src/modules/MyHouse/components/Installation/InstallationType.d'
import { TEST_CONNECTED_PLUGS } from 'src/mocks/handlers/connectedPlugs'
import { IConnectedPlug } from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugs.d'

import * as houseConfig from 'src/modules/MyHouse/MyHouseConfig'

const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)
const TEST_METER_EQUIPMENTS = applyCamelCase(MOCK_EQUIPMENTS)
const TEST_ACCOMODATION_RESPONSE = applyCamelCase(MOCK_TEST_ACCOMODATION_RESPONSE)
const MOCK_TEST_CONNECTED_PLUGS: IConnectedPlug[] = applyCamelCase(TEST_CONNECTED_PLUGS)
let mockConnectedPlugsList = MOCK_TEST_CONNECTED_PLUGS

let mockHouseId = LIST_OF_HOUSES[0].id
const INFORMATION_DOMICILE_TEXT = 'Information domicile'

/**
 * Mocking the react-router-dom for houseId in useParams.
 */
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    /**
     * Mock the react-router useParams hooks.
     *
     * @returns The react-router useParams hook.
     */
    useParams: () => ({
        houseId: mockHouseId,
    }),
}))

let mockArePlugsUsedBasedOnProductionStatusReturnValue = true

// need to mock this because myHouseConfig uses it
jest.mock('src/modules/MyHouse/utils/MyHouseHooks.ts', () => ({
    ...jest.requireActual('src/modules/MyHouse/utils/MyHouseHooks.ts'),
    //eslint-disable-next-line
    arePlugsUsedBasedOnProductionStatus: () => mockArePlugsUsedBasedOnProductionStatusReturnValue,
}))

let mockIsLoadingInProgress = false
const mockUpdateAccomodation = jest.fn()
const mockLoadAccomodation = jest.fn()
let mockLoadConnectedPlugList = jest.fn()
let mockAccomodation: AccomodationDataType = TEST_ACCOMODATION_RESPONSE

/**
 * Mock the useAccomodation hook.
 */
jest.mock('src/modules/MyHouse/components/Accomodation/AccomodationHooks', () => ({
    ...jest.requireActual('src/modules/MyHouse/components/Accomodation/AccomodationHooks'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useAccomodation: () => ({
        isLoadingInProgress: mockIsLoadingInProgress,
        updateAccomodation: mockUpdateAccomodation,
        loadAccomodation: mockLoadAccomodation,
        accomodation: mockAccomodation,
    }),
}))

let mockIsEquipmentMeterListEmpty = false
const mockSaveEquipment = jest.fn()
const mockLoadEquipmentList = jest.fn()
let mockEquipmentList: IEquipmentMeter[] | null = TEST_METER_EQUIPMENTS
/**
 * Mock the useEquipment hook.
 */
jest.mock('src/modules/MyHouse/components/Installation/installationHook', () => ({
    ...jest.requireActual('src/modules/MyHouse/components/Installation/installationHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useEquipmentList: () => ({
        loadEquipmentList: mockLoadEquipmentList,
        loadingEquipmentInProgress: mockIsLoadingInProgress,
        saveEquipment: mockSaveEquipment,
        equipmentList: mockEquipmentList,
        isEquipmentMeterListEmpty: mockIsEquipmentMeterListEmpty,
    }),
}))

let mockConnectedPlugListLoadingInProgress = false

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
// mock store.
const store = init({
    models,
})

/**
 * Mock House Config.
 */

// eslint-disable-next-line jsdoc/require-jsdoc
const mockHouseConfig = houseConfig as { connectedPlugsFeatureState: boolean }

jest.mock('src/modules/MyHouse/MyHouseConfig', () => ({
    __esModule: true,
    connectedPlugsFeatureState: true,
}))

describe('Test HousingDetails Component', () => {
    beforeEach(async () => {
        await store.dispatch.translationModel.setLocale({ locale: DEFAULT_LOCALE, translations: null })
        await store.dispatch.housingModel.setHousingModelState(LIST_OF_HOUSES)
    })

    describe('Information domicile card', () => {
        test('Information domicile card is displayed', async () => {
            const { getByText } = reduxedRender(
                <Router>
                    <HousingDetails />
                </Router>,
                { store },
            )
            expect(getByText(INFORMATION_DOMICILE_TEXT)).toBeInTheDocument()
        })
    })

    describe('Should display connectedPlugs correctly', () => {
        test('connectedPlugList loaded, detail card should show correctly', async () => {
            mockConnectedPlugsList = [MOCK_TEST_CONNECTED_PLUGS[0]]
            const { getByText } = reduxedRender(
                <Router>
                    <HousingDetails />
                </Router>,
                { store },
            )
            expect(getByText('Mes prises connectées')).toBeTruthy()
            expect(getByText(MOCK_TEST_CONNECTED_PLUGS[0].deviceName)).toBeTruthy()
            expect(getByText('Prise 2')).toBeTruthy()
            expect(getByText('Prise 3')).toBeTruthy()
        })

        test('Should display correctly skeleton data when empty', async () => {
            mockConnectedPlugListLoadingInProgress = true
            mockConnectedPlugsList = []
            const { getByText } = reduxedRender(
                <Router>
                    <HousingDetails />
                </Router>,
                { store },
            )
            expect(getByText('Prise 1')).toBeTruthy()
            expect(getByText('Prise 2')).toBeTruthy()
            expect(getByText('Prise 3')).toBeTruthy()
        })

        test('Should not display when Enphase is disabled', async () => {
            mockHouseConfig.connectedPlugsFeatureState = false
            mockArePlugsUsedBasedOnProductionStatusReturnValue = false
            const { queryByText } = reduxedRender(
                <Router>
                    <HousingDetails />
                </Router>,
                { store },
            )
            expect(queryByText('Mes prises connectées')).not.toBeInTheDocument()
            expect(queryByText('Prise 1')).not.toBeInTheDocument()
        })
    })
})
