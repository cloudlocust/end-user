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
import {
    MSG_REPLACE_NRLINK_CLEAR_OLD_DATA,
    MSG_REPLACE_NRLINK_MODAL_TITLE,
} from 'src/modules/MyHouse/components/ReplaceNRLinkFormPopup/replaceNrLinkFormPopupConfig'

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
const NO_METER_MESSAGE = 'Veuillez renseigner votre compteur'
const ENEDIS_UNSYNCHRONIZED_MESSAGE =
    'Les données de votre récolte dhistorique semblent incohérentes par rapport à celle de votre nrLINK'

const ENEDIS_CANCEL_COLLECTION_DATA_MESSAGE = 'Annuler la récolte de mes données'
const CONTACT_MAIL_MESSAGE = 'Contacter support@myem.fr'

const VERIFY_METER_MESSAGE = "Vérification de l'existence de votre compteur"
const CREATION_ENEDIS_SGE_CONSENT_TEXT = `${sgeConsentMessage}`

const ERROR_ENPHASE_MESSAGE = 'Connectez votre onduleur Enphase'
const PENDING_ENPHASE_MESSAGE = 'Votre connexion est en cours et sera active dans les plus brefs délais'

const CREATED_AT = '2022-09-02T08:06:08Z'

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
let mockMeterVerificationEnum = MeterVerificationEnum.NOT_VERIFIED
let mockHouseId = TEST_MOCKED_HOUSES[0].id
let mockCreateEnedisSgeConsent = jest.fn()
let mockSetMeterVerification = jest.fn()
let mockEditMeter = jest.fn()
// eslint-disable-next-line sonarjs/no-duplicate-string
const STATUS_ON_SRC = './assets/images/content/housing/consent-status/meter-on.svg'
// eslint-disable-next-line sonarjs/no-duplicate-string
const STATUS_OFF_SRC = './assets/images/content/housing/consent-status/meter-off.svg'

jest.mock('src/modules/Meters/metersHook', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    ...jest.requireActual('src/modules/Meters/metersHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMeterForHousing: () => ({
        editMeter: mockEditMeter,
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

            const { getByText, getByAltText, getByTestId, queryByAltText } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )

            expect(mockGetConsent).toBeCalledWith(foundHouse?.meter?.guid, mockHouseId)
            // Retrieve image alt attribute
            // eslint-disable-next-line sonarjs/no-duplicate-string
            const image = getByAltText('connected-icon')

            expect(getByTestId('EditIcon')).toBeTruthy()
            expect(getByAltText('connected-icon')).toBeTruthy()
            expect(getByText(COMPTEUR_TITLE)).toBeTruthy()
            expect(getByText(`n° ${foundHouse?.meter?.guid}`)).toBeTruthy()
            expect(getByText(NRLINK_TITLE)).toBeTruthy()
            expect(image).toHaveAttribute('src', STATUS_ON_SRC)
            expect(getByText(`nrLINK n° ${mockNrlinkGuid}`)).toBeTruthy()

            expect(queryByAltText('ReplaceNRLinkFormPopup')).not.toBeTruthy()
        })
        test('when nrlink status is disconnected', async () => {
            mockNrlinkConsent = 'DISCONNECTED'

            const { getByText, getByAltText } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )
            expect(mockGetConsent).toBeCalledWith(foundHouse?.meter?.guid, mockHouseId)
            // Retrieve image alt attribute
            const image = getByAltText('error-icon')
            expect(getByText(COMPTEUR_TITLE)).toBeTruthy()
            expect(getByText(`n° ${foundHouse?.meter?.guid}`)).toBeTruthy()
            expect(getByText(NRLINK_TITLE)).toBeTruthy()
            expect(getByText(NRLINK_DISCONNECTED_MESSAGE)).toBeTruthy()
            expect(image).toHaveAttribute('src', './assets/images/content/housing/consent-status/meter-error.svg')
        })
        test('when nrlink status is expired or nonexistant', async () => {
            mockNrlinkConsent = 'EXPIRED' || 'NONEXISTENT'

            const { getByText, getAllByAltText } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )
            expect(mockGetConsent).toBeCalledWith(foundHouse?.meter?.guid, mockHouseId)
            // Retrieve image alt attribute
            const image = getAllByAltText('off-icon')[0]
            expect(getByText(COMPTEUR_TITLE)).toBeTruthy()
            expect(getByText(`n° ${foundHouse?.meter?.guid}`)).toBeTruthy()
            expect(getByText(NRLINK_TITLE)).toBeTruthy()
            expect(getByText(NRLINK_NONEXISTANT_EXPIRED_MESSAGE)).toBeTruthy()
            expect(image).toHaveAttribute('src', './assets/images/content/housing/consent-status/meter-off.svg')
            expect(getByText(NRLINK_NONEXISTANT_EXPIRED_MESSAGE).closest('a')).toHaveAttribute(
                'href',
                `${URL_NRLINK_CONNECTION_STEPS}/${mockHouseId}`,
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
        test('when clicking on Edit, display ReplaceNRLinkForm', async () => {
            mockNrlinkConsent = 'CONNECTED'

            const { getByTestId, getByText, queryByLabelText } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )

            expect(getByTestId('EditIcon')).toBeTruthy()
            expect(queryByLabelText('ReplaceNRLinkFormPopup')).not.toBeTruthy()

            userEvent.click(getByTestId('EditIcon'))
            await waitFor(() => {
                expect(queryByLabelText('ReplaceNRLinkFormPopup')).toBeTruthy()
            })

            expect(getByText(MSG_REPLACE_NRLINK_MODAL_TITLE)).toBeTruthy()
            expect(getByText(MSG_REPLACE_NRLINK_CLEAR_OLD_DATA)).toBeTruthy()
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
            expect(mockGetConsent).toBeCalledWith(foundHouse?.meter?.guid, mockHouseId)
            expect(getByText(COMPTEUR_TITLE)).toBeTruthy()
            expect(getByText(`n° ${foundHouse?.meter?.guid}`)).toBeTruthy()
            expect(getByText(ENEDIS_CONNECTED_MESSAGE)).toBeTruthy()
            const image = getByAltText('connected-icon')
            expect(image).toHaveAttribute('src', './assets/images/content/housing/consent-status/meter-on.svg')
            expect(getByText(enedisFormatedEndingDate)).toBeTruthy()
            const cancelMessage = getByText(ENEDIS_CANCEL_COLLECTION_DATA_MESSAGE)
            expect(cancelMessage).toBeTruthy()
            userEvent.click(cancelMessage)
            expect(getByText(CONTACT_MAIL_MESSAGE)).toBeInTheDocument()
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
            expect(image).toHaveAttribute('src', './assets/images/content/housing/consent-status/meter-off.svg')
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
            expect(image).toHaveAttribute('src', './assets/images/content/housing/consent-status/meter-error.svg')
            expect(ENEDIS_UNSYNCHRONIZED_MESSAGE).toBeTruthy()
        })
    })
    describe('enphase status', () => {
        test('when enphase status is ACTIVE', async () => {
            foundHouse!.meter!.guid = '12345Her'
            mockEnphaseConsent = 'ACTIVE'
            const { getByText, getByAltText } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )
            expect(getByText(`Connexion le ${dayjs(CREATED_AT).format('DD/MM/YYYY')}`)).toBeTruthy()
            const activeIcon = getByAltText('enphase-active-icon')
            expect(activeIcon).toHaveAttribute('src', STATUS_ON_SRC)
        })
        test('when enphase status is NOT ACTIVE', async () => {
            foundHouse!.meter!.guid = '12345Her'
            mockEnphaseConsent = 'EXPIRED' || 'NONEXISTENT'
            const { getByText, getByAltText } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )
            const activeIcon = getByAltText('enphase-off-icon')
            expect(getByText(ERROR_ENPHASE_MESSAGE)).toBeTruthy()
            expect(activeIcon).toHaveAttribute('src', STATUS_OFF_SRC)
        })
        test('when enphase status is PENDING', async () => {
            foundHouse!.meter!.guid = '12345Her'
            mockEnphaseConsent = 'PENDING'

            const { getByText } = reduxedRender(
                <Router>
                    <MeterStatus />
                </Router>,
            )

            // Children of <Icon> </Icon>
            expect(getByText('replay')).toBeTruthy()
            expect(getByText(PENDING_ENPHASE_MESSAGE)).toBeTruthy()
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
