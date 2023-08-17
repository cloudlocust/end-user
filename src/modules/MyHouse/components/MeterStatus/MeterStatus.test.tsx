import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import { MeterStatus } from 'src/modules/MyHouse/components/MeterStatus'
import {
    enedisSgeConsentStatus,
    MeterVerificationEnum,
    nrlinkConsentStatus,
    enphaseConsentStatus,
} from 'src/modules/Consents/Consents.d'
import { URL_NRLINK_CONNECTION_STEPS } from 'src/modules/nrLinkConnection'
import dayjs from 'dayjs'
import userEvent from '@testing-library/user-event'
import { IHousing, IHousingState } from 'src/modules/MyHouse/components/HousingList/housing'
import { TEST_SUCCESS_USER } from 'src/mocks/handlers/user'
import { IUser } from 'src/modules/User'
import { DEFAULT_LOCALE } from 'src/configs'
import { init } from '@rematch/core'
import { models } from 'src/models'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { applyCamelCase } from 'src/common/react-platform-components'
import * as reactRedux from 'react-redux'
import { sgeConsentMessage } from 'src/modules/MyHouse/MyHouseConfig'
import { waitFor } from '@testing-library/react'

const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)
const CURRENT_HOUSING = LIST_OF_HOUSES[0]
/**
 * Mock user model state.
 */
const mockUser: IUser = applyCamelCase(TEST_SUCCESS_USER)
const TEST_MOCKED_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

const COMPTEUR_TITLE = 'Compteur'
const NRLINK_TITLE = 'Consommation en temps réel'

const NRLINK_DISCONNECTED_MESSAGE = 'Veuillez vérifier le branchement de votre appareil et/ou la connexion wifi.'
const NRLINK_NONEXISTANT_EXPIRED_MESSAGE = 'Connectez votre nrLINK pour visualiser votre consommation.'

const ENEDIS_CONNECTED_MESSAGE = 'Historique de consommation'
const ENEDIS_NONEXISTANT_EXPIRED_MESSAGE =
    'Autorisez la récupération de vos données de consommation pour avoir accès à votre historique.'
const NO_METER_MESSAGE = 'Veuillez renseigner votre compteur'
const ENEDIS_UNSYNCHRONIZED_MESSAGE =
    'Les données de votre récolte dhistorique semblent incohérentes par rapport à celle de votre nrLINK'

const ENEDIS_CANCEL_COLLECTION_DATA_MESSAGE = 'Annuler la récolte de mes données'
const CONTACT_MAIL_MESSAGE = 'Contacter support@myem.fr'

const VERIFY_METER_MESSAGE = "Vérification de l'existence de votre compteur"
const CREATION_ENEDIS_SGE_CONSENT_TEXT = `${sgeConsentMessage}`
const REVOKE_ENPHASE_CONSENT_TEXT = 'Annuler la récolte de mes données'
const CREATED_AT = '2022-09-02T08:06:08Z'
const ERROR_ENPHASE_MESSAGE = 'Connectez votre onduleur Enphase'
const ERROR_SHELLY_MESSAGE = 'Reliez la prise Shelly de vos panneaux plug&play'

const CONNECTED_ICON_TEXT = 'connected-icon'

let mockNrlinkConsent: nrlinkConsentStatus
let mockEnedisSgeConsent: enedisSgeConsentStatus
let mockEnphaseConsent: enphaseConsentStatus
let mockGetConsent = jest.fn()
let mockVerifyMeter = jest.fn()
let mockNrlinkGuid = 'ABCD1234'
let enedisFormatedEndingDate = dayjs(CREATED_AT).add(3, 'year').format('DD/MM/YYYY')
let mockWindowOpen = jest.fn()
window.open = mockWindowOpen
let mockSetIsMeterVerifyLoading = jest.fn()
let mockisMeterVerifyLoading = false
let mockIsEnphaseConsentLoading = false
let mockMeterVerificationEnum = MeterVerificationEnum.NOT_VERIFIED
let mockHouseId = TEST_MOCKED_HOUSES[0].id
let mockCreateEnedisSgeConsent = jest.fn()
let mockSetMeterVerification = jest.fn()
let mockEditMeter = jest.fn()
const circularProgressClassname = '.MuiCircularProgress-root'
let mockRevokeEnphaseConsent = jest.fn()
let mockLoadConnectedPlugList = jest.fn()

const STATUS_ON_SRC = './assets/images/content/housing/consent-status/meter-on.svg'
const STATUS_OFF_SRC = './assets/images/content/housing/consent-status/meter-off.svg'
const STATUS_ERROR_SRC = './assets/images/content/housing/consent-status/meter-error.svg'

jest.mock('src/modules/Meters/metersHook', () => ({
    ...jest.requireActual('src/modules/Meters/metersHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMeterForHousing: () => ({
        editMeter: mockEditMeter,
    }),
}))

// Mock useInstallationRequestsList hook
jest.mock('src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook', () => ({
    ...jest.requireActual('src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConnectedPlugList: () => ({
        // eslint-disable-next-line jsdoc/require-jsdoc
        getProductionConnectedPlug: () => undefined,
        loadConnectedPlugList: mockLoadConnectedPlugList,
    }),
}))

/**
 * Mocking the useParams used in "meterStatus" to get the house id based on url /my-houses/:houseId params.
 */
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    /**
     * Mock the useParams to get the houseId from url.
     *
     * @returns UseParams containing houseId.
     */
    useParams: () => ({
        houseId: `${mockHouseId}`,
    }),
}))

// TODO REMOVE when Connected plug or revoke enphase is in prod
jest.mock('src/modules/MyHouse/MyHouseConfig', () => ({
    ...jest.requireActual('src/modules/MyHouse/MyHouseConfig'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    get connectedPlugsFeatureState() {
        return true
    },
}))

// Mock consentsHook
jest.mock('src/modules/Consents/consentsHook', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConsents: () => ({
        enedisSgeConsent: {
            meterGuid: '133456',
            enedisSgeConsentState: mockEnedisSgeConsent,
            createdAt: CREATED_AT,
        },
        nrlinkConsent: {
            meterGuid: '133456',
            nrlinkConsentState: mockNrlinkConsent,
            creratedAt: CREATED_AT,
            nrlinkGuid: mockNrlinkGuid,
        },
        enphaseConsent: {
            meterGuid: '123456',
            enphaseConsentState: mockEnphaseConsent,
            createdAt: CREATED_AT,
        },
        getConsents: mockGetConsent,
        verifyMeter: mockVerifyMeter,
        createEnedisSgeConsent: mockCreateEnedisSgeConsent,
        setIsMeterVerifyLoading: mockSetIsMeterVerifyLoading,
        isMeterVerifyLoading: mockisMeterVerifyLoading,
        meterVerification: mockMeterVerificationEnum,
        setMeterVerification: mockSetMeterVerification,
        revokeEnphaseConsent: mockRevokeEnphaseConsent,
        isEnphaseConsentLoading: mockIsEnphaseConsentLoading,
    }),
}))

/**
 * Housing Model State.
 */
let mockHousingModelState: IHousingState = {
    housingList: LIST_OF_HOUSES,
    currentHousing: CURRENT_HOUSING,
}

/**
 * Mock all state.
 */
const mockReduxState = {
    housingModel: mockHousingModelState,
    userModel: {
        user: mockUser,
    },
    translationModel: {
        locale: DEFAULT_LOCALE,
        translations: null,
    },
}

// mock store.
const mockStore = init({
    models,
})

const mockUseSelector = jest.spyOn(reactRedux, 'useSelector')
const mockUseDispatch = jest.spyOn(reactRedux, 'useDispatch')

describe('MeterStatus component test', () => {
    beforeEach(() => {
        mockUseDispatch.mockClear()
        mockUseSelector.mockClear()

        mockUseSelector.mockImplementation((selctorFn) => selctorFn(mockReduxState))
        mockUseDispatch.mockImplementation(() => mockStore.dispatch)
    })

    afterEach(() => {
        mockUseDispatch.mockClear()
        mockUseSelector.mockClear()
    })

    describe('nrlink status tests', () => {
        test('when nrlink status is connected', async () => {
            mockNrlinkConsent = 'CONNECTED'

            const { getByText, getByAltText } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )

            expect(mockGetConsent).toBeCalledWith(mockHouseId)
            // Retrieve image alt attribute
            const image = getByAltText(CONNECTED_ICON_TEXT)

            expect(getByAltText(CONNECTED_ICON_TEXT)).toBeTruthy()
            expect(getByText(COMPTEUR_TITLE)).toBeTruthy()
            expect(getByText(`n° ${CURRENT_HOUSING?.meter?.guid}`)).toBeTruthy()
            expect(getByText(NRLINK_TITLE)).toBeTruthy()
            expect(image).toHaveAttribute('src', STATUS_ON_SRC)
            expect(getByText(`nrLINK n° ${mockNrlinkGuid}`)).toBeTruthy()
        })
        test('when nrlink status is disconnected', async () => {
            mockNrlinkConsent = 'DISCONNECTED'

            const { getByText, getByAltText } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )
            expect(mockGetConsent).toBeCalledWith(mockHouseId)
            // Retrieve image alt attribute
            const image = getByAltText('error-icon')
            expect(getByText(COMPTEUR_TITLE)).toBeTruthy()
            expect(getByText(`n° ${CURRENT_HOUSING?.meter?.guid}`)).toBeTruthy()
            expect(getByText(NRLINK_TITLE)).toBeTruthy()
            expect(getByText(`nrLINK N° ${mockNrlinkGuid}`)).toBeTruthy()
            expect(getByText(NRLINK_DISCONNECTED_MESSAGE)).toBeTruthy()
            expect(image).toHaveAttribute('src', STATUS_ERROR_SRC)
        })
        test('when nrlink status is expired or nonexistant', async () => {
            mockNrlinkConsent = 'EXPIRED' || 'NONEXISTENT'

            const { getByText, getAllByAltText } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )
            expect(mockGetConsent).toBeCalledWith(mockHouseId)
            // Retrieve image alt attribute
            const image = getAllByAltText('off-icon')[0]
            expect(getByText(COMPTEUR_TITLE)).toBeTruthy()
            expect(getByText(`n° ${CURRENT_HOUSING?.meter?.guid}`)).toBeTruthy()
            expect(getByText(NRLINK_TITLE)).toBeTruthy()
            expect(getByText(NRLINK_NONEXISTANT_EXPIRED_MESSAGE)).toBeTruthy()
            expect(image).toHaveAttribute('src', STATUS_OFF_SRC)
            expect(getByText(NRLINK_NONEXISTANT_EXPIRED_MESSAGE).closest('a')).toHaveAttribute(
                'href',
                `${URL_NRLINK_CONNECTION_STEPS}/${mockHouseId}`,
            )
        })
        test('when there is no meterGuid, a message is displayed: Veuillez renseigner votre compteur', async () => {
            // Empty string represent a falsy value to test when there is no meter guid.
            CURRENT_HOUSING!.meter!.guid = ''

            const { getByText } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )

            expect(getByText(NO_METER_MESSAGE)).toBeTruthy()
            expect(getByText(NRLINK_NONEXISTANT_EXPIRED_MESSAGE)).toBeTruthy()
            expect(getByText(ERROR_ENPHASE_MESSAGE)).toBeTruthy()
            expect(getByText(ERROR_SHELLY_MESSAGE)).toBeTruthy()
            expect(getByText(ENEDIS_NONEXISTANT_EXPIRED_MESSAGE)).toBeTruthy()
        })
    })
    describe('enedis status test', () => {
        test('when enedis status is connected', async () => {
            CURRENT_HOUSING!.meter!.guid = '12345Her'
            mockNrlinkConsent = 'DISCONNECTED'
            mockEnedisSgeConsent = 'CONNECTED'
            const { getByText, getByAltText } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )
            expect(mockGetConsent).toBeCalledWith(mockHouseId)
            expect(getByText(COMPTEUR_TITLE)).toBeTruthy()
            expect(getByText(`n° ${CURRENT_HOUSING?.meter?.guid}`)).toBeTruthy()
            expect(getByText(ENEDIS_CONNECTED_MESSAGE)).toBeTruthy()
            const image = getByAltText(CONNECTED_ICON_TEXT)
            expect(image).toHaveAttribute('src', STATUS_ON_SRC)
            expect(getByText(enedisFormatedEndingDate)).toBeTruthy()
            const cancelMessage = getByText(ENEDIS_CANCEL_COLLECTION_DATA_MESSAGE)
            expect(cancelMessage).toBeTruthy()
            userEvent.click(cancelMessage)
            expect(getByText(CONTACT_MAIL_MESSAGE)).toBeInTheDocument()
        })
        test('when enedis status is expired or nonexistant', async () => {
            CURRENT_HOUSING!.meter!.guid = '12345Her'
            mockNrlinkConsent = 'DISCONNECTED'
            mockEnedisSgeConsent = 'EXPIRED' || 'NONEXISTENT'
            const { getByText, getByAltText } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )
            expect(getByText(COMPTEUR_TITLE)).toBeTruthy()
            expect(getByText(`n° ${CURRENT_HOUSING?.meter?.guid}`)).toBeTruthy()
            expect(getByText(ENEDIS_NONEXISTANT_EXPIRED_MESSAGE)).toBeTruthy()
            const image = getByAltText('off-icon')
            expect(image).toHaveAttribute('src', STATUS_OFF_SRC)
        })
        test('when enedis sge consent is UNSYNCHRONIZED', async () => {
            mockEnedisSgeConsent = 'UNSYNCHRONIZED'
            mockisMeterVerifyLoading = false

            const { getByAltText } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )

            const image = getByAltText('sge-error-icon')
            expect(image).toHaveAttribute('src', STATUS_ERROR_SRC)
            expect(ENEDIS_UNSYNCHRONIZED_MESSAGE).toBeTruthy()
        })
    })
    describe('enphase status', () => {
        test('when revoking enphase status', async () => {
            mockEnphaseConsent = 'ACTIVE'
            const { getByText } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )
            userEvent.click(getByText(REVOKE_ENPHASE_CONSENT_TEXT))
            await waitFor(() => {
                expect(mockRevokeEnphaseConsent).toHaveBeenCalledWith(CURRENT_HOUSING?.id)
            })
            expect(mockGetConsent).toHaveBeenCalledWith(mockHouseId)
        })
        test('when revoking enphase and isEnphaseLoading, spinner should be shown', async () => {
            mockEnphaseConsent = 'ACTIVE'
            mockIsEnphaseConsentLoading = true
            const { container } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )

            expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
        })
    })
    describe('test implementation of EnedisSgePopup', () => {
        test('when clicked on error message, verify meter popup is shown with loading', async () => {
            mockEnedisSgeConsent = 'EXPIRED' || 'NONEXISTENT'
            mockisMeterVerifyLoading = true
            const { getByText, getByTestId } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )
            userEvent.click(getByText(ENEDIS_NONEXISTANT_EXPIRED_MESSAGE))
            expect(mockVerifyMeter).toBeCalledWith(mockHouseId)
            expect(getByText(VERIFY_METER_MESSAGE)).toBeVisible()
            expect(getByTestId('linear-progess')).toHaveClass('MuiLinearProgress-colorPrimary')
        })
        test('when meter fails to be verified, an error message is shown', async () => {
            mockEnedisSgeConsent = 'EXPIRED' || 'NONEXISTENT'
            mockisMeterVerifyLoading = false
            mockMeterVerificationEnum = MeterVerificationEnum.NOT_VERIFIED

            const { getByText } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )

            userEvent.click(getByText(ENEDIS_NONEXISTANT_EXPIRED_MESSAGE))
            expect(mockVerifyMeter).toBeCalledWith(mockHouseId)
            expect(() => getByText(VERIFY_METER_MESSAGE)).toThrow()
            expect(getByText("Votre compteur n'a pas été reconnu")).toBeTruthy()
        })
        test('when enedis sge consent is retrieved succesfully', async () => {
            mockEnedisSgeConsent = 'EXPIRED' || 'NONEXISTENT'
            mockisMeterVerifyLoading = false
            mockMeterVerificationEnum = MeterVerificationEnum.VERIFIED

            const { getByText, getByTestId } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )

            userEvent.click(getByText(ENEDIS_NONEXISTANT_EXPIRED_MESSAGE))
            expect(mockVerifyMeter).toBeCalledWith(mockHouseId)
            expect(getByText(CREATION_ENEDIS_SGE_CONSENT_TEXT)).toBeTruthy()
            const checkbox = getByTestId('sge-checkbox').querySelector('input[type="checkbox"]') as Element
            expect(checkbox).toHaveProperty('checked', false)
            userEvent.click(checkbox)
            expect(mockCreateEnedisSgeConsent).toBeCalled()
        })
    })
})
