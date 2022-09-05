import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import { MeterStatus } from 'src/modules/MyHouse/components/MeterStatus'
import { enedisConsentStatus, nrlinkConsentStatus } from 'src/modules/Consents/Consents'
import { URL_NRLINK_CONNECTION_STEPS } from 'src/modules/nrLinkConnection'
import dayjs from 'dayjs'

let mockMeterStatusProps = {
    houseId: 1,
    meterGuid: '12345678901234',
}

const COMPTEUR_TITLE = 'Compteur'
const NRLINK_TITLE = 'Consommation en temps réel'
const METER_GUID = '12345678901234'

const NRLINK_DISCONNECTED_MESSAGE = 'Veuillez vérifier le branchement de votre appareil et/ou la connexion wifi.'
const NRLINK_NONEXISTANT_EXPIRED_MESSAGE = 'Connectez votre nrLINK pour visualiser votre consommation.'

const ENEDIS_CONNECTED_MESSAGE = 'Historique de consommation'
const ENEDIS_NONEXISTANT_EXPIRED_MESSAGE =
    'Autorisez la récupération de vos données de consommation pour avoir accès à votre historique.'

const NO_METER_MESSAGE = 'Veuillez renseigner votre compteur'
let mockNrlinkConsent: nrlinkConsentStatus
let mockEnedisConsent: enedisConsentStatus
let mockGetConsent = jest.fn()
let mockNrlinkCreatedAt = '2022-09-02T08:06:08Z'
let mockNrlinkGuid = 'ABCD1234'
let mockEnedisCreatedAt = mockNrlinkCreatedAt
let enedisFormatedEndingDate = dayjs(mockNrlinkCreatedAt).add(3, 'year').format('DD/MM/YYYY')

// Mock consentsHook
jest.mock('src/modules/Consents/consentsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConsents: () => ({
        enedisConsent: {
            meterGuid: '133456',
            enedisConsentState: mockEnedisConsent,
            createdAt: mockEnedisCreatedAt,
        },
        nrlinkConsent: {
            meterGuid: '133456',
            nrlinkConsentState: mockNrlinkConsent,
            creratedAt: mockNrlinkCreatedAt,
            nrlinkGuid: mockNrlinkGuid,
        },
        getConsents: mockGetConsent,
    }),
}))

describe('MeterStatus component test', () => {
    describe('nrlink status tests', () => {
        test('when nrlink status is connected', async () => {
            mockNrlinkConsent = 'CONNECTED'

            const { getByText, getByAltText } = reduxedRender(
                <Router>
                    <MeterStatus {...mockMeterStatusProps} />
                </Router>,
            )
            expect(mockGetConsent).toBeCalledWith(mockMeterStatusProps.meterGuid)
            // Retrieve image alt attribute
            // eslint-disable-next-line sonarjs/no-duplicate-string
            const image = getByAltText('connected-icon')

            expect(getByAltText('connected-icon')).toBeTruthy()
            expect(getByText(COMPTEUR_TITLE)).toBeTruthy()
            expect(getByText(`n° ${METER_GUID}`)).toBeTruthy()
            expect(getByText(NRLINK_TITLE)).toBeTruthy()
            expect(image).toHaveAttribute('src', '/assets/images/content/housing/consent-status/meter-on.svg')
            expect(getByText(`nrLink n° ${mockNrlinkGuid}`)).toBeTruthy()
        })
        test('when nrlink status is disconnected', async () => {
            mockNrlinkConsent = 'DISCONNECTED'

            const { getByText, getByAltText } = reduxedRender(
                <Router>
                    <MeterStatus {...mockMeterStatusProps} />
                </Router>,
            )
            expect(mockGetConsent).toBeCalledWith(mockMeterStatusProps.meterGuid)
            // Retrieve image alt attribute
            const image = getByAltText('error-icon')
            expect(getByText(COMPTEUR_TITLE)).toBeTruthy()
            expect(getByText(`n° ${METER_GUID}`)).toBeTruthy()
            expect(getByText(NRLINK_TITLE)).toBeTruthy()
            expect(getByText(NRLINK_DISCONNECTED_MESSAGE)).toBeTruthy()
            expect(image).toHaveAttribute('src', '/assets/images/content/housing/consent-status/meter-error.svg')
        })
        test('when nrlink status is expired or nonexistant', async () => {
            mockNrlinkConsent = 'EXPIRED' || 'NONEXISTENT'

            const { getByText, getByAltText } = reduxedRender(
                <Router>
                    <MeterStatus {...mockMeterStatusProps} />
                </Router>,
            )
            expect(mockGetConsent).toBeCalledWith(mockMeterStatusProps.meterGuid)
            // Retrieve image alt attribute
            const image = getByAltText('off-icon')
            expect(getByText(COMPTEUR_TITLE)).toBeTruthy()
            expect(getByText(`n° ${METER_GUID}`)).toBeTruthy()
            expect(getByText(NRLINK_TITLE)).toBeTruthy()
            expect(getByText(NRLINK_NONEXISTANT_EXPIRED_MESSAGE)).toBeTruthy()
            expect(image).toHaveAttribute('src', '/assets/images/content/housing/consent-status/meter-off.svg')
            expect(getByText(NRLINK_NONEXISTANT_EXPIRED_MESSAGE).closest('a')).toHaveAttribute(
                'href',
                URL_NRLINK_CONNECTION_STEPS,
            )
        })
        test('when there is no meterGuid, a message is displayed: Veuillez renseigner votre compteur', async () => {
            mockMeterStatusProps.meterGuid = ''

            const { getByText } = reduxedRender(
                <Router>
                    <MeterStatus {...mockMeterStatusProps} />
                </Router>,
            )

            expect(mockGetConsent).toBeCalledWith(mockMeterStatusProps.meterGuid)
            expect(getByText(NO_METER_MESSAGE)).toBeTruthy()
        })
    })
    describe('enedis status test', () => {
        test('when enedis status is connected', async () => {
            mockMeterStatusProps.meterGuid = '12345678901234'
            mockNrlinkConsent = 'DISCONNECTED'
            mockEnedisConsent = 'CONNECTED'

            const { getByText, getByAltText } = reduxedRender(
                <Router>
                    <MeterStatus {...mockMeterStatusProps} />
                </Router>,
            )

            expect(getByText(COMPTEUR_TITLE)).toBeTruthy()
            expect(getByText(`n° ${METER_GUID}`)).toBeTruthy()
            expect(getByText(ENEDIS_CONNECTED_MESSAGE)).toBeTruthy()

            const image = getByAltText('connected-icon')
            expect(image).toHaveAttribute('src', '/assets/images/content/housing/consent-status/meter-on.svg')
            expect(getByText(enedisFormatedEndingDate)).toBeTruthy()
        })
        test('when enedis status is expired or nonexistant', async () => {
            mockMeterStatusProps.meterGuid = '12345678901234'
            mockNrlinkConsent = 'DISCONNECTED'
            mockEnedisConsent = 'EXPIRED' || 'NONEXISTENT'

            const { getByText, getByAltText } = reduxedRender(
                <Router>
                    <MeterStatus {...mockMeterStatusProps} />
                </Router>,
            )

            expect(getByText(COMPTEUR_TITLE)).toBeTruthy()
            expect(getByText(`n° ${METER_GUID}`)).toBeTruthy()
            expect(getByText(ENEDIS_NONEXISTANT_EXPIRED_MESSAGE)).toBeTruthy()

            const image = getByAltText('off-icon')
            expect(image).toHaveAttribute('src', '/assets/images/content/housing/consent-status/meter-off.svg')
        })
    })
})
