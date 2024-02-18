import { BrowserRouter as Router } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import App from 'src/App'
import { SnackbarProvider } from 'src/common/react-platform-components/alerts/SnackbarProvider'
import { IEnedisSgeConsent, enedisSgeConsentStatus } from 'src/modules/Consents/Consents.d'

const MAINTENANCE_INFO_TEXT = 'Une maintenance est en cours. Nous revenons au plus vite.'
const ADD_NRLINK_CONNECTION_TEXT =
    'Connectez votre capteur à votre compteur et configurez votre afficheur nrLINK pour commencer à suivre votre consommation !'
const STEPPER_FIRST_STEP_TEXT = 'Connectons votre compteur Linky'

let mockIsMaintenanceMode = true
const mockGetTokenFromFirebase = jest.fn()
let mockIsAlpiqSubscriptionForm = false
let mockEnedisStatus: enedisSgeConsentStatus = 'REVOKED'

// Mock the getTokenFromFirebase function
jest.mock('src/firebase', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    get getTokenFromFirebase() {
        return mockGetTokenFromFirebase
    },
}))

jest.mock('src/configs/index.ts', () => ({
    ...jest.requireActual('src/configs/index.ts'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isMaintenanceMode() {
        return mockIsMaintenanceMode
    },
}))

let mockEnedisSgeConsent: IEnedisSgeConsent = {
    meterGuid: '133456',
    enedisSgeConsentState: mockEnedisStatus,
    expiredAt: '',
}

// Mock consents hook
jest.mock('src/modules/Consents/consentsHook', () => ({
    ...jest.requireActual('src/modules/Consents/consentsHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConsents: () => ({
        enedisSgeConsent: mockEnedisSgeConsent,
    }),
}))

jest.mock('src/modules/User/AlpiqSubscription/AlpiqSubscriptionConfig', () => ({
    ...jest.requireActual('src/modules/User/AlpiqSubscription/AlpiqSubscriptionConfig'),
    //eslint-disable-next-line
    get isAlpiqSubscriptionForm(){
        return mockIsAlpiqSubscriptionForm
    },
}))

// eslint-disable-next-line jsdoc/require-jsdoc
const renderAppComponent = (initialState?: {}) => {
    return reduxedRender(
        <Router basename={'/'}>
            <SnackbarProvider>
                <App />
            </SnackbarProvider>
        </Router>,
        {
            initialState,
        },
    )
}

describe('test App', () => {
    describe('Test when alpiq provider', () => {
        test('when alpiq provider variable is on and sge consent revoked, get alpiq stepper', () => {
            mockIsAlpiqSubscriptionForm = true
            mockIsMaintenanceMode = false
            const { getByText } = renderAppComponent({
                userModel: { user: { id: 'user_1' }, authenticationToken: 'token' },
            })
            expect(getByText(STEPPER_FIRST_STEP_TEXT)).toBeInTheDocument()
        })
        test('when alpiq provider variable is on and sge consent connect, home pages', () => {
            mockIsAlpiqSubscriptionForm = true
            mockIsMaintenanceMode = false
            mockEnedisStatus = 'CONNECTED'
            const { queryByText } = renderAppComponent({
                userModel: { user: { id: 'user_1' }, authenticationToken: 'token' },
            })
            expect(queryByText(STEPPER_FIRST_STEP_TEXT)).not.toBeInTheDocument()
        })
        test('when alpiq provider variable is off no stepper', () => {
            mockIsAlpiqSubscriptionForm = false
            mockIsMaintenanceMode = false
            const { queryByText } = renderAppComponent({
                userModel: { user: { id: 'user_1' }, authenticationToken: 'token' },
            })
            expect(queryByText(STEPPER_FIRST_STEP_TEXT)).not.toBeInTheDocument()
        })
    })
    test('when the user is authenticated, the device token was sent to the back', () => {
        renderAppComponent({ userModel: { user: { id: 'user_1' } } })

        expect(mockGetTokenFromFirebase).toHaveBeenCalledTimes(1)
    })
    test('when the user is not authenticated, the device token was not sent to the back', () => {
        renderAppComponent()

        expect(mockGetTokenFromFirebase).toHaveBeenCalledTimes(0)
    })
    describe('test Maintenance Mode', () => {
        test('when maintenance mode is true, Maintenance page is showing.', () => {
            mockIsMaintenanceMode = true
            const { getByText } = renderAppComponent()

            expect(getByText(MAINTENANCE_INFO_TEXT)).toBeInTheDocument()
        })
        test('when maintenance mode is false, and the user is not authenticated, Login page is not showing.', () => {
            mockIsMaintenanceMode = false
            const { queryByText, getByText } = renderAppComponent()

            expect(queryByText(MAINTENANCE_INFO_TEXT)).not.toBeInTheDocument()
            expect(getByText('Connexion')).toBeInTheDocument()
        })
        test('when maintenance mode is false, and the user is authenticated, nrlink connection page is showing.', () => {
            mockIsMaintenanceMode = false
            const { queryByText, getByText } = renderAppComponent({
                userModel: { user: { id: 'user_1' }, authenticationToken: 'token' },
            })

            expect(queryByText(MAINTENANCE_INFO_TEXT)).not.toBeInTheDocument()
            expect(getByText(ADD_NRLINK_CONNECTION_TEXT)).toBeInTheDocument()
        })
    })
})
