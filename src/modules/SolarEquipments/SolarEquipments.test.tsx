import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import { ISolarEquipment } from 'src/modules/SolarEquipments/solarEquipments'
import { TEST_SOLAR_EQUIPMENTS } from 'src/mocks/handlers/solarEquipments'
import { SolarEquipments } from 'src/modules/SolarEquipments'

let mockSolarEquipmentsList: ISolarEquipment | null = applyCamelCase(TEST_SOLAR_EQUIPMENTS[0])
let mockLoadingInProgress = false
let mockReloadEquipmentRequestList = jest.fn()
let mockTotalSolarEquipments = 0

// Mock useInstallationRequestsList hook
jest.mock('src/modules/SolarEquipments/solarEquipmentsHook', () => ({
    ...jest.requireActual('src/modules/SolarEquipments/solarEquipmentsHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useInstallationRequestsList: () => ({
        elementList: mockSolarEquipmentsList,
        loadingInProgress: mockLoadingInProgress,
        reloadElements: mockReloadEquipmentRequestList,
        totalElementList: mockTotalSolarEquipments,
    }),
}))

const SOLAR_EQUIPMENTS_TEXT = 'Mes équipements'
const AJOUTER_EQUIPMENT_TEXT = 'Ajouter un équipement'
const LOADING_TEXT = 'Chargement...'

describe('Solar Equipments', () => {
    test('when he header is shown', async () => {
        mockLoadingInProgress = true
        const { getByText } = reduxedRender(
            <Router>
                <SolarEquipments />
            </Router>,
        )
        expect(getByText(SOLAR_EQUIPMENTS_TEXT)).toBeTruthy()
        expect(getByText(AJOUTER_EQUIPMENT_TEXT)).toBeTruthy()
    })
    test('when solar equipments list is null', async () => {
        mockSolarEquipmentsList = null
        const { getByText } = reduxedRender(
            <Router>
                <SolarEquipments />
            </Router>,
        )
        expect(mockLoadingInProgress).toBeTruthy()
        expect(getByText(LOADING_TEXT)).toBeTruthy()
    })
    test('when loading is true', async () => {
        mockLoadingInProgress = true
        mockTotalSolarEquipments = applyCamelCase(TEST_SOLAR_EQUIPMENTS[0])
        const { getByText } = reduxedRender(
            <Router>
                <SolarEquipments />
            </Router>,
        )
        expect(mockLoadingInProgress).toBeTruthy()
        expect(getByText(LOADING_TEXT)).toBeTruthy()
    })
})
