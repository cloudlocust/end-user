import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import SolarProductionLinkingPrompt from 'src/modules/MyConsumption/components/SolarProductionLinkingPrompt'

const ADD_ENPHASE_CONSENT_TEXT_BUTTON = 'Liaison avec mon compte Enphase'
const ADD_CONNECTED_PLUG_CONSENT_TEXT_BUTTON = 'Liaison avec une prise connectée Shelly plug S'
const ENPHASE_WINDOW_POPUP_TEXT = 'ENPHASE_WINDOW_POPUP_TEXT'
const CONNECTED_PLUG_PRODUCTION_CONSENT_POPUP_TEXT = 'CONNECTED_PLUG_PRODUCTION_CONSENT_POPUP_TEXT'

let mockArePlugsUsedBasedOnProductionStatus = true
const mockGetEnphaseLink = jest.fn()

jest.mock('src/modules/MyHouse/MyHouseConfig', () => ({
    ...jest.requireActual('src/modules/MyHouse/MyHouseConfig'),
    //eslint-disable-next-line
    arePlugsUsedBasedOnProductionStatus: () => mockArePlugsUsedBasedOnProductionStatus,
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

// Mock consentsHook
jest.mock('src/modules/Consents/consentsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConsents: () => ({
        enphaseLink: 'fake',
        getEnphaseLink: mockGetEnphaseLink,
    }),
}))

describe('test SolarProductionLinkingPrompt', () => {
    test('When SolarProductionLinkingPrompt is called, and used plugs are based on production status, all buttons are shown', async () => {
        const { getByText } = reduxedRender(<SolarProductionLinkingPrompt />)
        expect(getByText("Actuellement aucune production solaire n'est liée à l'application")).toBeInTheDocument()
        expect(getByText('Lier ma production solaire:')).toBeInTheDocument()
        expect(getByText('Installation avec un onduleur Enphase:')).toBeInTheDocument()
        expect(getByText(ADD_ENPHASE_CONSENT_TEXT_BUTTON)).toBeInTheDocument()
        expect(getByText('Installation "plug & play"')).toBeInTheDocument()
        expect(getByText(ADD_CONNECTED_PLUG_CONSENT_TEXT_BUTTON)).toBeInTheDocument()
    })
    test('When used plugs are not based on production status, the part "Plag & play" should not be shown', async () => {
        mockArePlugsUsedBasedOnProductionStatus = false
        const { getByText, queryByText } = reduxedRender(<SolarProductionLinkingPrompt />)

        expect(getByText("Actuellement aucune production solaire n'est liée à l'application")).toBeInTheDocument()
        expect(getByText('Lier ma production solaire:')).toBeInTheDocument()
        expect(getByText('Installation avec un onduleur Enphase:')).toBeInTheDocument()
        expect(getByText(ADD_ENPHASE_CONSENT_TEXT_BUTTON)).toBeInTheDocument()

        expect(queryByText('Installation "plug & play"')).not.toBeInTheDocument()
        expect(queryByText(ADD_CONNECTED_PLUG_CONSENT_TEXT_BUTTON)).not.toBeInTheDocument()
    })
    test('When adding consent from "enphase", getEnphaseLink should be called & enphasePopup should open and close with handleEnphaseClose', async () => {
        // we should set current housing to be able to get the enphase link
        const { getByText } = reduxedRender(<SolarProductionLinkingPrompt />, {
            initialState: {
                housingModel: { currentHousing: { id: 1 } },
            },
        })

        userEvent.click(getByText(ADD_ENPHASE_CONSENT_TEXT_BUTTON))
        await waitFor(() => {
            // Enphase popup is open
            expect(getByText(ENPHASE_WINDOW_POPUP_TEXT)).toBeTruthy()
        })
        expect(mockGetEnphaseLink).toHaveBeenCalledWith(1)

        // Closing the Enphase popup.
        userEvent.click(getByText(ENPHASE_WINDOW_POPUP_TEXT))

        await waitFor(() => {
            expect(() => getByText(ENPHASE_WINDOW_POPUP_TEXT)).toThrow()
        })
    })
    test('When requesting consent from connectedPlugs, connectedPlug popup should open and close when handleConnectedPlugClose', async () => {
        mockArePlugsUsedBasedOnProductionStatus = true
        const { getByText } = reduxedRender(<SolarProductionLinkingPrompt />)

        userEvent.click(getByText(ADD_CONNECTED_PLUG_CONSENT_TEXT_BUTTON))
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
})
