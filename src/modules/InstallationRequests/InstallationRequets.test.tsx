import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_INSTALLATION_REQUESTS } from 'src/mocks/handlers/installationRequests'
import { InstallationRequests } from 'src/modules/InstallationRequests'
import { BrowserRouter as Router } from 'react-router-dom'
import { IInstallationRequests } from 'src/modules/InstallationRequests/installationRequests'

let mockInstallationRequestList: IInstallationRequests | null = applyCamelCase(TEST_INSTALLATION_REQUESTS[0])
let mockLoadingInProgress = false
let mockReloadInstallationRequestList = jest.fn()
let mockTotalInstallationRequests = 0

// Mock useInstallationRequestsList hook
jest.mock('src/modules/InstallationRequests/installationRequestsHooks', () => ({
    ...jest.requireActual('src/modules/InstallationRequests/installationRequestsHooks'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useInstallationRequestsList: () => ({
        elementList: mockInstallationRequestList,
        loadingInProgress: mockLoadingInProgress,
        reloadElements: mockReloadInstallationRequestList,
        totalElementList: mockTotalInstallationRequests,
    }),
}))

const DEMANDE_INSTALLATION_TEXT = "Demandes d'installations"
const AJOUTER_DEMANDE_TEXT = 'Ajouter une demande'
const LOADING_TEXT = 'Chargement...'

describe('Installation requests', () => {
    test('when he header is shown', async () => {
        mockLoadingInProgress = true
        const { getByText } = reduxedRender(
            <Router>
                <InstallationRequests />
            </Router>,
        )
        expect(getByText(DEMANDE_INSTALLATION_TEXT)).toBeTruthy()
        expect(getByText(AJOUTER_DEMANDE_TEXT)).toBeTruthy()
    })
    test('when installation requests list is null', async () => {
        mockInstallationRequestList = null
        const { getByText } = reduxedRender(
            <Router>
                <InstallationRequests />
            </Router>,
        )
        expect(mockLoadingInProgress).toBeTruthy()
        expect(getByText(LOADING_TEXT)).toBeTruthy()
    })
    test('when loading is true', async () => {
        mockLoadingInProgress = true
        mockInstallationRequestList = applyCamelCase(TEST_INSTALLATION_REQUESTS[0])
        const { getByText } = reduxedRender(
            <Router>
                <InstallationRequests />
            </Router>,
        )
        expect(mockLoadingInProgress).toBeTruthy()
        expect(getByText(LOADING_TEXT)).toBeTruthy()
    })
})
