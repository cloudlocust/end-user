import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import { IEquipmentRequest } from 'src/modules/EquipmentRequests/equipmentRequests'
import { TEST_EQUIPMENT_REQUESTS } from 'src/mocks/handlers/equipmentRequests'
import { EquipmentRequests } from 'src/modules/EquipmentRequests'
import userEvent from '@testing-library/user-event'

let mockEquipmentRequestList: IEquipmentRequest | null = applyCamelCase(TEST_EQUIPMENT_REQUESTS[0])
let mockLoadingInProgress = false
let mockReloadEquipmentRequestList = jest.fn()
let mockTotalEquipmentRequests = 0

// Mock useInstallationRequestsList hook
jest.mock('src/modules/EquipmentRequests/EquipmentRequestsHook', () => ({
    ...jest.requireActual('src/modules/EquipmentRequests/EquipmentRequestsHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useInstallationRequestsList: () => ({
        elementList: mockEquipmentRequestList,
        loadingInProgress: mockLoadingInProgress,
        reloadElements: mockReloadEquipmentRequestList,
        totalElementList: mockTotalEquipmentRequests,
    }),
}))

const EQUIPMENT_INSTALLATION_TEXT = "Demandes d'équipements"
const AJOUTER_DEMANDE_TEXT = 'Ajouter une demande'
const LOADING_TEXT = 'Chargement...'

describe('Equipment requests', () => {
    test('when he header is shown', async () => {
        mockLoadingInProgress = true
        const { getByText } = reduxedRender(
            <Router>
                <EquipmentRequests />
            </Router>,
        )
        expect(getByText(EQUIPMENT_INSTALLATION_TEXT)).toBeTruthy()
        expect(getByText(AJOUTER_DEMANDE_TEXT)).toBeTruthy()
    })
    test('when installation requests list is null', async () => {
        mockEquipmentRequestList = null
        const { getByText } = reduxedRender(
            <Router>
                <EquipmentRequests />
            </Router>,
        )
        expect(mockLoadingInProgress).toBeTruthy()
        expect(getByText(LOADING_TEXT)).toBeTruthy()
    })
    test('when loading is true', async () => {
        mockLoadingInProgress = true
        mockEquipmentRequestList = applyCamelCase(TEST_EQUIPMENT_REQUESTS[0])
        const { getByText } = reduxedRender(
            <Router>
                <EquipmentRequests />
            </Router>,
        )
        expect(mockLoadingInProgress).toBeTruthy()
        expect(getByText(LOADING_TEXT)).toBeTruthy()
    })
    test('when EquipmentRequestCreatePopup is shown when clicked on Ajouter', async () => {
        const { getByText, getByTestId } = reduxedRender(
            <Router>
                <EquipmentRequests />
            </Router>,
        )

        userEvent.click(getByText(AJOUTER_DEMANDE_TEXT))

        expect(getByText("Demande d'équipement")).toBeTruthy()
        expect(getByTestId('EquipmentRequestsPopupCloseIcon')).toBeTruthy()
    })
    test('when EquipmentRequestCreatePopup is closed', async () => {
        const { getByTestId, getByText } = reduxedRender(
            <Router>
                <EquipmentRequests />
            </Router>,
        )
        userEvent.click(getByText(AJOUTER_DEMANDE_TEXT))
        userEvent.click(getByTestId('EquipmentRequestsPopupCloseIcon'))
        expect(() => getByText("Demande d'équipement")).toThrow()
    })
})
