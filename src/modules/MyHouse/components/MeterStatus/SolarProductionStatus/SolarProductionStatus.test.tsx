import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import { enphaseConsentStatus } from 'src/modules/Consents/Consents.d'
import dayjs from 'dayjs'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { applyCamelCase } from 'src/common/react-platform-components'
import { SolarProductionConsentStatus } from 'src/modules/MyHouse/components/MeterStatus/SolarProductionStatus'
import { ISolarProductionConsentStatusProps } from 'src/modules/MyHouse/components/MeterStatus/MeterStatus.d'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import { TEST_CONNECTED_PLUGS } from 'src/mocks/handlers/connectedPlugs'
import { IConnectedPlug } from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugs.d'

const TEST_MOCKED_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)
const MOCK_TEST_CONNECTED_PLUGS: IConnectedPlug[] = applyCamelCase(TEST_CONNECTED_PLUGS)
let mockConnectedPlugsList = MOCK_TEST_CONNECTED_PLUGS

const ERROR_ENPHASE_MESSAGE = 'Connectez votre onduleur Enphase'
const ERROR_SHELLY_MESSAGE = 'Reliez la prise Shelly de vos panneaux plug&play'
const PENDING_ENPHASE_MESSAGE = 'Votre connexion est en cours et sera active dans les plus brefs délais'
const ENPHASE_WINDOW_POPUP_TEXT = 'ENPHASE_WINDOW_POPUP_TEXT'
const CONNECTED_PLUG_PRODUCTION_CONSENT_POPUP_TEXT = 'CONNECTED_PLUG_PRODUCTION_CONSENT_POPUP_TEXT'
const circularProgressClassname = '.MuiCircularProgress-root'

const CREATED_AT = '2022-09-02T08:06:08Z'

let mockWindowOpen = jest.fn()
const REVOKE_SOLAR_PRODUCTION_CONSENT_TEXT = 'Annuler la récolte de mes données'
let mockAssociateConnectedPlug = jest.fn()
let mockLoadConnectedPlugList = jest.fn()
// eslint-disable-next-line jsdoc/require-jsdoc
let mockGetProductionConnectedPlug: () => IConnectedPlug | undefined = () => mockConnectedPlugsList[0]
window.open = mockWindowOpen
let mockHouseId = TEST_MOCKED_HOUSES[0].id
// eslint-disable-next-line sonarjs/no-duplicate-string
const STATUS_ON_SRC = './assets/images/content/housing/consent-status/meter-on.svg'
// eslint-disable-next-line sonarjs/no-duplicate-string
const STATUS_OFF_SRC = './assets/images/content/housing/consent-status/meter-off.svg'

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

let mockConnectedPlugLoadingInProgress = false

// Mock useInstallationRequestsList hook
jest.mock('src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook', () => ({
    ...jest.requireActual('src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConnectedPlugList: () => ({
        connectedPlugList: mockConnectedPlugsList,
        loadingInProgress: mockConnectedPlugLoadingInProgress,
        // eslint-disable-next-line jsdoc/require-jsdoc
        getProductionConnectedPlug: mockGetProductionConnectedPlug,
        associateConnectedPlug: mockAssociateConnectedPlug,
        loadConnectedPlugList: mockLoadConnectedPlugList,
    }),
}))

// Mocking the EnphaseConsentPopup to test the onClose and openEnphaseConsent.
jest.mock('src/modules/MyHouse/components/MeterStatus/EnphaseConsentPopup', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    EnphaseConsentPopup: (props: any) => {
        return <button onClick={props.onClose}>{ENPHASE_WINDOW_POPUP_TEXT}</button>
    },
}))

// Mocking the ConnectedPlugProductionConsentPopup to test the onClose and openEnphaseConsent.
jest.mock(
    'src/modules/MyHouse/components/MeterStatus/ConnectedPlugProductionConsentPopup',
    // eslint-disable-next-line jsdoc/require-jsdoc
    () => (props: any) => {
        return <button onClick={props.onClose}>{CONNECTED_PLUG_PRODUCTION_CONSENT_POPUP_TEXT}</button>
    },
)

/**
 * Solar Production Status Props.
 */
const mockSolarProductionStatusProps: ISolarProductionConsentStatusProps = {
    solarProductionConsent: {
        meterGuid: '123456',
        enphaseConsentState: 'ACTIVE' as enphaseConsentStatus,
        createdAt: CREATED_AT,
    },
    enphaseLink: 'fake',
    getEnphaseLink: jest.fn(),
    solarProductionConsentLoadingInProgress: false,
    onRevokeEnphaseConsent: jest.fn(),
}

describe('SolarProductionStatus component test', () => {
    test('when shelly connected plug is in production status should be active and when revoking dissaciotation should happen', async () => {
        // eslint-disable-next-line jsdoc/require-jsdoc
        const { getByText, getByAltText } = reduxedRender(
            <Router>
                <SolarProductionConsentStatus {...mockSolarProductionStatusProps} />
            </Router>,
            {
                initialState: {
                    housingModel: { currentHousing: TEST_MOCKED_HOUSES[0], housingList: TEST_MOCKED_HOUSES },
                },
            },
        )
        expect(
            getByText(`Prise Shelly connectée le ${dayjs(mockConnectedPlugsList[0].createdAt).format('DD/MM/YYYY')}`),
        ).toBeTruthy()
        const activeIcon = getByAltText('enphase-active-icon')
        expect(activeIcon).toHaveAttribute('src', STATUS_ON_SRC)

        userEvent.click(getByText(REVOKE_SOLAR_PRODUCTION_CONSENT_TEXT))
        await waitFor(() => {
            expect(mockAssociateConnectedPlug).toHaveBeenCalledWith(
                mockConnectedPlugsList[0].deviceId,
                mockHouseId,
                false,
            )
        })
    })
    test('when enphase status is ACTIVE', async () => {
        // eslint-disable-next-line jsdoc/require-jsdoc
        mockGetProductionConnectedPlug = () => undefined
        const { getByText, getByAltText } = reduxedRender(
            <Router>
                <SolarProductionConsentStatus {...mockSolarProductionStatusProps} />
            </Router>,
            {
                initialState: {
                    housingModel: { currentHousing: TEST_MOCKED_HOUSES[0], housingList: TEST_MOCKED_HOUSES },
                },
            },
        )
        expect(getByText(`Onduleur Enphase connecté le ${dayjs(CREATED_AT).format('DD/MM/YYYY')}`)).toBeTruthy()
        const activeIcon = getByAltText('enphase-active-icon')
        expect(activeIcon).toHaveAttribute('src', STATUS_ON_SRC)
    })
    test('when enphase status is PENDING', async () => {
        mockSolarProductionStatusProps.solarProductionConsent!.enphaseConsentState = 'PENDING'

        const { getByText } = reduxedRender(
            <Router>
                <SolarProductionConsentStatus {...mockSolarProductionStatusProps} />
            </Router>,
            {
                initialState: {
                    housingModel: { currentHousing: TEST_MOCKED_HOUSES[0], housingList: TEST_MOCKED_HOUSES },
                },
            },
        )

        // Children of <Icon> </Icon>
        expect(getByText('replay')).toBeTruthy()
        expect(getByText(PENDING_ENPHASE_MESSAGE)).toBeTruthy()
    })

    test('when enphase status is NOT ACTIVE', async () => {
        const offConsents: enphaseConsentStatus[] = ['EXPIRED', 'NONEXISTENT']
        offConsents.forEach((consent, index) => {
            mockSolarProductionStatusProps.solarProductionConsent!.enphaseConsentState = consent
            const { getAllByText, getAllByAltText } = reduxedRender(
                <Router>
                    <SolarProductionConsentStatus {...mockSolarProductionStatusProps} />
                </Router>,
                {
                    initialState: {
                        housingModel: { currentHousing: TEST_MOCKED_HOUSES[0], housingList: TEST_MOCKED_HOUSES },
                    },
                },
            )
            const offIcon = getAllByAltText('enphase-off-icon')[index]
            expect(getAllByText(ERROR_ENPHASE_MESSAGE)[index]).toBeTruthy()
            expect(getAllByText(ERROR_SHELLY_MESSAGE)[index]).toBeTruthy()
            expect(offIcon).toHaveAttribute('src', STATUS_OFF_SRC)
        })
    })
    test('When getting consent from enphases, getEnphaseLink should be called & enphasePopup should open and close with handleEnphaseClose', async () => {
        const mockGetEnphaseLink = jest.fn()
        mockSolarProductionStatusProps.getEnphaseLink = mockGetEnphaseLink
        const { getByText } = reduxedRender(
            <Router>
                <SolarProductionConsentStatus {...mockSolarProductionStatusProps} />
            </Router>,
            {
                initialState: {
                    housingModel: { currentHousing: TEST_MOCKED_HOUSES[0], housingList: TEST_MOCKED_HOUSES },
                },
            },
        )

        userEvent.click(getByText(ERROR_ENPHASE_MESSAGE))
        await waitFor(() => {
            // Enphase popup is open
            expect(getByText(ENPHASE_WINDOW_POPUP_TEXT)).toBeTruthy()
        })

        expect(mockGetEnphaseLink).toHaveBeenCalled()
        // Closing the Enphase popup.
        userEvent.click(getByText(ENPHASE_WINDOW_POPUP_TEXT))

        await waitFor(() => {
            expect(() => getByText(ENPHASE_WINDOW_POPUP_TEXT)).toThrow()
        })
    }, 10000)
    test('When requesting consent from connectedPlugs, connectedPlug popup should open and close when handleConnectedPlugClose', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <SolarProductionConsentStatus {...mockSolarProductionStatusProps} />
            </Router>,
            {
                initialState: {
                    housingModel: { currentHousing: TEST_MOCKED_HOUSES[0], housingList: TEST_MOCKED_HOUSES },
                },
            },
        )

        userEvent.click(getByText(ERROR_SHELLY_MESSAGE))
        await waitFor(() => {
            // Connected Plug popup is open
            expect(getByText(CONNECTED_PLUG_PRODUCTION_CONSENT_POPUP_TEXT)).toBeTruthy()
        })

        // Closing the Connected Plug popup.
        userEvent.click(getByText(CONNECTED_PLUG_PRODUCTION_CONSENT_POPUP_TEXT))

        await waitFor(() => {
            expect(() => getByText(CONNECTED_PLUG_PRODUCTION_CONSENT_POPUP_TEXT)).toThrow()
        })
    }, 10000)

    test('When solarProductionConsent loading in progress', async () => {
        mockSolarProductionStatusProps.solarProductionConsentLoadingInProgress = true
        const { container } = reduxedRender(
            <Router>
                <SolarProductionConsentStatus {...mockSolarProductionStatusProps} />
            </Router>,
            {
                initialState: {
                    housingModel: { currentHousing: TEST_MOCKED_HOUSES[0], housingList: TEST_MOCKED_HOUSES },
                },
            },
        )

        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
    })
})
