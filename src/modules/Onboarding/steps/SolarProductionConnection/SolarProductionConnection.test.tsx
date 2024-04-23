import { reduxedRender } from 'src/common/react-platform-components/test'
import userEvent from '@testing-library/user-event'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { SolarProductionConnection } from 'src/modules/Onboarding/steps/SolarProductionConnection'
import { SolarProductionConnectionProps } from 'src/modules/Onboarding/steps/SolarProductionConnection/SolarProductionConnection.types'

const NEXT_BUTTON_TEXT = 'Suivant'
const ENPHASE_INSTALLATION_BUTTON_TEXT = 'Lier mon installation avec Enphase'
const SHELLY_INSTALLATION_BUTTON_TEXT = 'Lier mon installation avec Shelly'
const ENPHASE_WINDOW_POPUP_TEXT = 'ENPHASE_WINDOW_POPUP_TEXT'
const CONNECTED_PLUG_PRODUCTION_CONSENT_POPUP_TEXT = 'CONNECTED_PLUG_PRODUCTION_CONSENT_POPUP_TEXT'

const mockGetEnphaseLink = jest.fn()

jest.mock('src/modules/Consents/consentsHook', () => ({
    ...jest.requireActual('src/modules/Consents/consentsHook'),
    /**
     * Mock useConsents hook.
     *
     * @returns Mocked useConsents.
     */
    useConsents: () => ({
        getEnphaseLink: mockGetEnphaseLink,
        enphaseLink: 'test link',
        isEnphaseConsentLoading: false,
    }),
}))

/**
 * Mock EnphaseConsentPopup props.
 */
type MockEnphaseConsentPopupProps =
    /**
     * MockEnphaseConsentPopupProps.
     */
    {
        /**
         * Close callback.
         *
         * @returns Void.
         */
        onClose: () => void
    }

// Mocking the EnphaseConsentPopup to test the onClose and openEnphaseConsent.
jest.mock('src/modules/MyHouse/components/MeterStatus/EnphaseConsentPopup', () => ({
    /**
     * Mock EnphaseConsentPopup component.
     *
     * @param props EnphaseConsentPopup props.
     * @param props.onClose On close callback.
     * @returns EnphaseConsentPopup component.
     */
    EnphaseConsentPopup: (props: MockEnphaseConsentPopupProps) => {
        return <button onClick={props.onClose}>{ENPHASE_WINDOW_POPUP_TEXT}</button>
    },
}))

/**
 * Mock MockConnectedPlugProductionConsentPopup props.
 */
type MockConnectedPlugProductionConsentPopupProps =
    /**
     * Mock ConnectedPlugProductionConsentPopup props.
     */
    {
        /**
         * Close callback.
         *
         * @returns Void.
         */
        onClose: () => void
    }

// Mocking the ConnectedPlugProductionConsentPopup to test the onClose and openEnphaseConsent.
jest.mock(
    'src/modules/MyHouse/components/MeterStatus/ConnectedPlugProductionConsentPopup',
    /**
     * Mock ConnectedPlugProductionConsentPopup module.
     *
     * @returns ConnectedPlugProductionConsentPopup module.
     */
    () => {
        /**
         * Mock ConnectedPlugProductionConsentPopup component.
         *
         * @param props ConnectedPlugProductionConsentPopup props.
         * @returns ConnectedPlugProductionConsentPopup component.
         */
        return (props: MockConnectedPlugProductionConsentPopupProps) => {
            return <button onClick={props.onClose}>{CONNECTED_PLUG_PRODUCTION_CONSENT_POPUP_TEXT}</button>
        }
    },
)

const mockHandleNext = jest.fn()
const solarProductionConnectionProps: SolarProductionConnectionProps = {
    housingId: 123,
    onNext: mockHandleNext,
}

describe('SolarProductionConnection', () => {
    test('should render SolarProductionConnection component', () => {
        const { getByText, getByRole } = reduxedRender(
            <SolarProductionConnection {...solarProductionConnectionProps} />,
        )

        // Assert that the component renders correctly
        expect(getByText('Bonus: Soleil soleil !')).toBeInTheDocument()
        expect(
            getByText(
                'Avez-vous une installation solaire avec des identifiants Enphase ou une prise connectée Shelly plug S ?',
            ),
        ).toBeInTheDocument()
        expect(getByRole('button', { name: ENPHASE_INSTALLATION_BUTTON_TEXT })).toBeInTheDocument()
        expect(getByRole('button', { name: SHELLY_INSTALLATION_BUTTON_TEXT })).toBeInTheDocument()
        expect(getByRole('button', { name: NEXT_BUTTON_TEXT })).toBeInTheDocument()
        // todo: to enable later when the button is enabled
        // expect(getByText("Mon installation solaire n'est pas compatible")).toBeInTheDocument()
    })

    test('should call onNext when Suivant button is clicked', () => {
        reduxedRender(<SolarProductionConnection {...solarProductionConnectionProps} />)
        fireEvent.click(screen.getByText(NEXT_BUTTON_TEXT))
        expect(mockHandleNext).toHaveBeenCalled()
    })

    test('When getting consent from enphases, getEnphaseLink should be called & enphasePopup should open and close with handleEnphaseClose', async () => {
        const { getByText, getByRole } = reduxedRender(
            <>
                <SolarProductionConnection {...solarProductionConnectionProps} />
            </>,
        )
        const button = getByRole('button', { name: ENPHASE_INSTALLATION_BUTTON_TEXT })
        userEvent.click(button)
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
        const { getByText, getByRole } = reduxedRender(
            <>
                <SolarProductionConnection {...solarProductionConnectionProps} />
            </>,
        )

        userEvent.click(getByRole('button', { name: SHELLY_INSTALLATION_BUTTON_TEXT }))
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
