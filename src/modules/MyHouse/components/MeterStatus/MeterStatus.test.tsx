import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import { MeterStatus } from 'src/modules/MyHouse/components/MeterStatus'
import { enedisSgeConsentStatus, MeterVerificationEnum, nrlinkConsentStatus } from 'src/modules/Consents/Consents.d'
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

const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)
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
const NO_METER_MESSAGE = 'Aucun compteur renseigné'

const VERIFY_METER_MESSAGE = "Vérification de l'existence de votre compteur"
const CREATION_ENEDIS_SGE_CONSENT_TEXT =
    "J'autorise My Energy Manager à la récolte de mon historique de données de consommation auprès d'Enedis."

let mockNrlinkConsent: nrlinkConsentStatus
let mockEnedisSgeConsent: enedisSgeConsentStatus
let mockGetConsent = jest.fn()
let mockVerifyMeter = jest.fn()
let mockNrlinkCreatedAt = '2022-09-02T08:06:08Z'
let mockNrlinkGuid = 'ABCD1234'
let mockEnedisCreatedAt = mockNrlinkCreatedAt
let enedisFormatedEndingDate = dayjs(mockNrlinkCreatedAt).add(3, 'year').format('DD/MM/YYYY')
let mockWindowOpen = jest.fn()
window.open = mockWindowOpen
let mockSetIsMeterVerifyLoading = jest.fn()
let mockisMeterVerifyLoading = false
let mockMeterVerificationEnum = MeterVerificationEnum.NOT_VERIFIED
let mockHouseId = TEST_MOCKED_HOUSES[0].id
let mockCreateEnedisSgeConsent = jest.fn()
let mockSetMeterVerification = jest.fn()

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

// Mock consentsHook
jest.mock('src/modules/Consents/consentsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConsents: () => ({
        enedisSgeConsent: {
            meterGuid: '133456',
            enedisSgeConsentState: mockEnedisSgeConsent,
            createdAt: mockEnedisCreatedAt,
        },
        nrlinkConsent: {
            meterGuid: '133456',
            nrlinkConsentState: mockNrlinkConsent,
            creratedAt: mockNrlinkCreatedAt,
            nrlinkGuid: mockNrlinkGuid,
        },
        getConsents: mockGetConsent,
        verifyMeter: mockVerifyMeter,
        createEnedisSgeConsent: mockCreateEnedisSgeConsent,
        setIsMeterVerifyLoading: mockSetIsMeterVerifyLoading,
        isMeterVerifyLoading: mockisMeterVerifyLoading,
        meterVerification: mockMeterVerificationEnum,
        setMeterVerification: mockSetMeterVerification,
    }),
}))

/**
 * Housing Model State.
 */
let mockHousingModelState: IHousingState = {
    housingList: LIST_OF_HOUSES,
    currentHousing: LIST_OF_HOUSES[0],
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

let foundHouse = mockHousingModelState.housingList.find((house) => house.id === mockHouseId)

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

            expect(mockGetConsent).toBeCalledWith(foundHouse?.meter?.guid)
            // Retrieve image alt attribute
            // eslint-disable-next-line sonarjs/no-duplicate-string
            const image = getByAltText('connected-icon')

            expect(getByAltText('connected-icon')).toBeTruthy()
            expect(getByText(COMPTEUR_TITLE)).toBeTruthy()
            expect(getByText(`n° ${foundHouse?.meter?.guid}`)).toBeTruthy()
            expect(getByText(NRLINK_TITLE)).toBeTruthy()
            expect(image).toHaveAttribute('src', '/assets/images/content/housing/consent-status/meter-on.svg')
            expect(getByText(`nrLink n° ${mockNrlinkGuid}`)).toBeTruthy()
        })
        test('when nrlink status is disconnected', async () => {
            mockNrlinkConsent = 'DISCONNECTED'

            const { getByText, getByAltText } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )
            expect(mockGetConsent).toBeCalledWith(foundHouse?.meter?.guid)
            // Retrieve image alt attribute
            const image = getByAltText('error-icon')
            expect(getByText(COMPTEUR_TITLE)).toBeTruthy()
            expect(getByText(`n° ${foundHouse?.meter?.guid}`)).toBeTruthy()
            expect(getByText(NRLINK_TITLE)).toBeTruthy()
            expect(getByText(NRLINK_DISCONNECTED_MESSAGE)).toBeTruthy()
            expect(image).toHaveAttribute('src', '/assets/images/content/housing/consent-status/meter-error.svg')
        })
        test('when nrlink status is expired or nonexistant', async () => {
            mockNrlinkConsent = 'EXPIRED' || 'NONEXISTENT'

            const { getByText, getAllByAltText } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )
            expect(mockGetConsent).toBeCalledWith(foundHouse?.meter?.guid)
            // Retrieve image alt attribute
            const image = getAllByAltText('off-icon')[0]
            expect(getByText(COMPTEUR_TITLE)).toBeTruthy()
            expect(getByText(`n° ${foundHouse?.meter?.guid}`)).toBeTruthy()
            expect(getByText(NRLINK_TITLE)).toBeTruthy()
            expect(getByText(NRLINK_NONEXISTANT_EXPIRED_MESSAGE)).toBeTruthy()
            expect(image).toHaveAttribute('src', '/assets/images/content/housing/consent-status/meter-off.svg')
            expect(getByText(NRLINK_NONEXISTANT_EXPIRED_MESSAGE).closest('a')).toHaveAttribute(
                'href',
                URL_NRLINK_CONNECTION_STEPS,
            )
        })
        test('when there is no meterGuid, a message is displayed: Veuillez renseigner votre compteur', async () => {
            // Empty string represent a falsy value to test when there is no meter guid.
            foundHouse!.meter!.guid = ''

            const { getByText } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )

            expect(mockGetConsent).not.toBeCalledWith()
            expect(getByText(NO_METER_MESSAGE)).toBeTruthy()
        })
    })
    describe('enedis status test', () => {
        test('when enedis status is connected', async () => {
            foundHouse!.meter!.guid = '12345Her'
            mockNrlinkConsent = 'DISCONNECTED'
            mockEnedisSgeConsent = 'CONNECTED'
            const { getByText, getByAltText } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )
            expect(mockGetConsent).toBeCalledWith(foundHouse?.meter?.guid)
            expect(getByText(COMPTEUR_TITLE)).toBeTruthy()
            expect(getByText(`n° ${foundHouse?.meter?.guid}`)).toBeTruthy()
            expect(getByText(ENEDIS_CONNECTED_MESSAGE)).toBeTruthy()
            const image = getByAltText('connected-icon')
            expect(image).toHaveAttribute('src', '/assets/images/content/housing/consent-status/meter-on.svg')
            expect(getByText(enedisFormatedEndingDate)).toBeTruthy()
        })
        test('when enedis status is expired or nonexistant', async () => {
            foundHouse!.meter!.guid = '12345Her'
            mockNrlinkConsent = 'DISCONNECTED'
            mockEnedisSgeConsent = 'EXPIRED' || 'NONEXISTENT'
            const { getByText, getByAltText } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )
            expect(getByText(COMPTEUR_TITLE)).toBeTruthy()
            expect(getByText(`n° ${foundHouse?.meter?.guid}`)).toBeTruthy()
            expect(getByText(ENEDIS_NONEXISTANT_EXPIRED_MESSAGE)).toBeTruthy()
            const image = getByAltText('off-icon')
            expect(image).toHaveAttribute('src', '/assets/images/content/housing/consent-status/meter-off.svg')
        })
    })
    describe('test implementation of EnedisSgePopup', () => {
        test('when clicked on error message, verify meter popup is shown with loading', async () => {
            foundHouse!.meter!.guid = '12345Her'
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
            expect(getByText('Veuillez renseigner un numéro de compteur').closest('a')).toHaveAttribute(
                'href',
                '/my-houses',
            )
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
