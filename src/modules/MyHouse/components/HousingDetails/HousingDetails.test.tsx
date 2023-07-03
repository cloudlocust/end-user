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
import { IEquipmentMeter } from 'src/modules/MyHouse/components/Equipments/EquipmentsType'

import * as houseConfig from 'src/modules/MyHouse/MyHouseConfig'

const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)
const TEST_METER_EQUIPMENTS = applyCamelCase(MOCK_EQUIPMENTS)
const TEST_ACCOMODATION_RESPONSE = applyCamelCase(MOCK_TEST_ACCOMODATION_RESPONSE)

const circularProgressClassname = '.MuiCircularProgress-root'
let mockHouseId = LIST_OF_HOUSES[0].id

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

let mockIsLoadingInProgress = false
const mockUpdateAccomodation = jest.fn()
const mockLoadAccomodation = jest.fn()
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
jest.mock('src/modules/MyHouse/components/Equipments/equipmentHooks', () => ({
    ...jest.requireActual('src/modules/MyHouse/components/Equipments/equipmentHooks'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useEquipmentList: () => ({
        loadEquipmentList: mockLoadEquipmentList,
        loadingEquipmentInProgress: mockIsLoadingInProgress,
        saveEquipment: mockSaveEquipment,
        equipmentList: mockEquipmentList,
        isEquipmentMeterListEmpty: mockIsEquipmentMeterListEmpty,
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
const mockHouseConfig = houseConfig as { enphaseConsentFeatureState: boolean }

jest.mock('src/modules/MyHouse/MyHouseConfig', () => ({
    __esModule: true,
    enphaseConsentFeatureState: true,
}))

describe('Test HousingDetails Component', () => {
    beforeEach(async () => {
        await store.dispatch.translationModel.setLocale({ locale: DEFAULT_LOCALE, translations: null })
        await store.dispatch.housingModel.setHousingModelState(LIST_OF_HOUSES)
    })

    test('when Equipment valid', async () => {
        await store.dispatch.housingModel.setHousingModelState(LIST_OF_HOUSES)

        const { getByText } = reduxedRender(
            <Router>
                <HousingDetails />
            </Router>,
            { store },
        )
        expect(getByText('Chauffage')).toBeTruthy()
        expect(getByText('Eau')).toBeTruthy()
        expect(getByText('Plaques')).toBeTruthy()
    })
    test('when HousingList is null, Loading is shown', async () => {
        await store.dispatch.housingModel.setHousingModelState([])

        const { container } = reduxedRender(
            <Router>
                <HousingDetails />
            </Router>,
            { store },
        )
        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
    })

    describe('Should display connectedPlugs correctly', () => {
        test('Should display correctly skeleton data at mount', async () => {
            const { getByText } = reduxedRender(
                <Router>
                    <HousingDetails />
                </Router>,
                { store },
            )
            expect(getByText('Mes prises connectées')).toBeTruthy()
            expect(getByText('Prise 1')).toBeTruthy()
            expect(getByText('Prise 2')).toBeTruthy()
            expect(getByText('Prise 3')).toBeTruthy()
        })
        test('Should not display when Enphase is disabled', async () => {
            mockHouseConfig.enphaseConsentFeatureState = false
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
