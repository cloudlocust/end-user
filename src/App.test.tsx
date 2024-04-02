import { BrowserRouter as Router } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import App from 'src/App'
import { SnackbarProvider } from 'src/common/react-platform-components/alerts/SnackbarProvider'
import { IEnedisSgeConsent, enedisSgeConsentStatus } from 'src/modules/Consents/Consents.d'
import { IHousing } from './modules/MyHouse/components/HousingList/housing'
import { TEST_HOUSES } from './mocks/handlers/houses'
import { applyCamelCase } from './common/react-platform-components'
import { cleanup } from '@testing-library/react'

const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)
const MAINTENANCE_INFO_TEXT = 'Une maintenance est en cours. Nous revenons au plus vite.'
const ADD_NRLINK_CONNECTION_TEXT =
    'Connectez votre capteur à votre compteur et configurez votre afficheur nrLINK pour commencer à suivre votre consommation !'
const STEPPER_FIRST_STEP_TEXT = 'Connectons votre compteur électrique'

let mockIsMaintenanceMode = true
const mockGetTokenFromFirebase = jest.fn()
var mockIsAlpiqSubscriptionForm = false
let mockEnedisStatus: enedisSgeConsentStatus = 'REVOKED'
let mockIsNrlinkPopupShowing = true

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
        getConsents: jest.fn(),
    }),
}))

jest.mock('src/modules/User/AlpiqSubscription/index.d', () => ({
    ...jest.requireActual('src/modules/User/AlpiqSubscription/index.d'),
    //eslint-disable-next-line
    get isAlpiqSubscriptionForm() {
        return mockIsAlpiqSubscriptionForm
    },
}))

jest.mock('src/modules/nrLinkConnection/NrLinkConnectionHook', () => ({
    ...jest.requireActual('src/modules/nrLinkConnection/NrLinkConnectionHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useGetShowNrLinkPopupHook: () => ({
        isNrLinkPopupShowing: mockIsNrlinkPopupShowing,
        isGetShowNrLinkLoading: false,
    }),
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

let mockCurrentHousing = LIST_OF_HOUSES[1]
let initialHousingModelState = {
    currentHousing: mockCurrentHousing,
    alpiqSubscriptionSpecs: null,
}

describe('test App', () => {
    afterEach(cleanup)

    test('when the user is authenticated, the device token was sent to the back', () => {
        renderAppComponent({ userModel: { user: { id: 'user_1' } } })

        expect(mockGetTokenFromFirebase).toHaveBeenCalledTimes(1)
    })
    test('when the user is not authenticated, the device token was not sent to the back', () => {
        renderAppComponent()

        expect(mockGetTokenFromFirebase).toHaveBeenCalledTimes(0)
    })
    describe('Test when alpiq provider', () => {
        test('when alpiq provider variable is on and their is not meter and sge consent revoked, get alpiq stepper in first step', () => {
            mockIsAlpiqSubscriptionForm = true
            mockIsMaintenanceMode = false
            const { getByText } = renderAppComponent({
                userModel: { user: { id: 'user_1' }, authenticationToken: 'token' },
                housingModel: initialHousingModelState,
            })
            expect(getByText(STEPPER_FIRST_STEP_TEXT)).toBeInTheDocument()
        })
        test('when alpiq provider variable is off no stepper', () => {
            mockIsAlpiqSubscriptionForm = false
            mockIsMaintenanceMode = false
            const { queryByText } = renderAppComponent({
                userModel: { user: { id: 'user_1' }, authenticationToken: 'token' },
                housingModel: initialHousingModelState,
            })
            expect(queryByText(STEPPER_FIRST_STEP_TEXT)).not.toBeInTheDocument()
        })
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
        test('when maintenance mode is false, and the user is authenticated, and show nrlink popup is true, nrlink connection page is showing.', () => {
            mockIsMaintenanceMode = false
            const { queryByText, getByText } = renderAppComponent({
                userModel: { user: { id: 'user_1' }, authenticationToken: 'token' },
            })

            // expect(console.log).toHaveBeenCalledWith('Hello, world!')
            expect(queryByText(MAINTENANCE_INFO_TEXT)).not.toBeInTheDocument()
            expect(getByText(ADD_NRLINK_CONNECTION_TEXT)).toBeInTheDocument()
        })
        test('when maintenance mode is false, and the user is authenticated, and show nrlink popup is false, dashboard page with message of missing housing & meter.', () => {
            mockIsNrlinkPopupShowing = false
            const { queryByText, getByText } = renderAppComponent({
                userModel: { user: { id: 'user_1' }, authenticationToken: 'token' },
            })

            expect(queryByText(MAINTENANCE_INFO_TEXT)).not.toBeInTheDocument()
            expect(getByText('Aucun logement disponible')).toBeInTheDocument()
            expect(getByText("Pour voir votre consommation vous devez d'abord")).toBeInTheDocument()
            expect(getByText('enregistrer votre compteur et votre nrLINK')).toBeInTheDocument()
        })
    })
})
