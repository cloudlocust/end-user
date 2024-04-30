import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { MeterConnectionStep } from 'src/modules/Onboarding/steps/MeterConnectionStep'
import { MeterConnectionStepProps } from 'src/modules/Onboarding/steps/MeterConnectionStep/MeterConnectionStep.types'
import { IEnedisSgeConsent, enedisSgeConsentStatus } from 'src/modules/Consents/Consents.d'
import { METER_GUID_REGEX_TEXT } from 'src/modules/MyHouse/utils/MyHouseVariables'
import { IMeter } from 'src/modules/Meters/Meters'

const guidMeterInputQuerySelector = 'input[name="guid"]'
const NEXT_BUTTON_TEXT = 'Suivant'
const REQUIRED_ERROR_TEXT = 'Champ obligatoire non renseigné'

let mockEnedisStatus: enedisSgeConsentStatus = 'NONEXISTENT'
const mockHandleNext = jest.fn()
let mockEnedisSgeConsent: IEnedisSgeConsent = {
    meterGuid: '133456',
    enedisSgeConsentState: mockEnedisStatus,
    expiredAt: '',
}
let mockMeter: IMeter = {
    guid: '',
    id: 1,
    features: {
        offpeak: {
            offpeakHours: [],
            readOnly: false,
        },
    },
}
const mockLoadHousingsAndScopes = jest.fn()

let mockIsMeterLoading = false
const mockAddMeter = jest.fn()
const mockEditMeter = jest.fn()

/**
 * Mocking the metersHook.
 */
jest.mock('src/modules/Meters/metersHook', () => ({
    ...jest.requireActual('src/modules/Meters/metersHook'),
    /**
     * Mock the useMeterForHousing hook.
     *
     * @returns UseMeterForHousing mocked.
     */
    useMeterForHousing: () => ({
        loadingInProgress: mockIsMeterLoading,
        addMeter: mockAddMeter,
        editMeter: mockEditMeter,
    }),
}))

let mockCreateEnedisSgeConsent = jest.fn()
let mockVerifyMeter = jest.fn()

// Mock consentsHook
jest.mock('src/modules/Consents/consentsHook', () => ({
    /**
     * Mock the useConsents hook.
     *
     * @returns Moked hook.
     */
    useConsents: () => ({
        verifyMeter: mockVerifyMeter,
        createEnedisSgeConsent: mockCreateEnedisSgeConsent,
    }),
}))

const mockMeterConnectionProps: MeterConnectionStepProps = {
    housingId: 123,
    onNext: mockHandleNext,
    enedisSgeConsent: mockEnedisSgeConsent,
    meter: mockMeter,
    loadHousingsAndScopes: mockLoadHousingsAndScopes,
}

describe('MeterConnection', () => {
    test('should render', () => {
        const { getByRole, getByText } = reduxedRender(<MeterConnectionStep {...mockMeterConnectionProps} />)
        expect(getByText('2/4: La vie antérieure...')).toBeInTheDocument()
        expect(
            getByText('Pour lier votre logement à l’application, saisissez ici votre N° de PDL :'),
        ).toBeInTheDocument()
        expect(
            getByText(
                'Votre N° PDL (point de livraison) est visible sur votre facture d’électricité ou sur votre compteur',
            ),
        ).toBeInTheDocument()
        expect(
            getByText(
                'Pour sortir les 3 dernières années données de votre Linky du placard et bénéficier de toutes nos fonctionnalités, j’autorise l’accès à mon historique.',
            ),
        ).toBeInTheDocument()
        expect(
            getByText(
                'Chez nous, vos données sont gardées sous haute tension, pas de court-circuit de confidentialité ici ! Ni partagées, ni vendues !',
            ),
        ).toBeInTheDocument()
        expect(getByRole('button', { name: 'Suivant' })).toBeInTheDocument()
    })
    describe('form validation', () => {
        test('should call empty', async () => {
            mockMeterConnectionProps.meter.guid = ''
            const { container, getByText } = reduxedRender(<MeterConnectionStep {...mockMeterConnectionProps} />)
            userEvent.type(container.querySelector(guidMeterInputQuerySelector)!, '')

            userEvent.click(getByText(NEXT_BUTTON_TEXT))
            await waitFor(() => {
                expect(getByText(REQUIRED_ERROR_TEXT)).toBeTruthy()
            })
        })
        test('Invalid meter guid', async () => {
            const { container, getByText } = reduxedRender(<MeterConnectionStep {...mockMeterConnectionProps} />)
            // Initially meter is field and nrlink_empty
            userEvent.type(container.querySelector(guidMeterInputQuerySelector)!, '123456')
            expect(container.querySelector(guidMeterInputQuerySelector)).toHaveValue('123456')

            userEvent.click(getByText(NEXT_BUTTON_TEXT))
            await waitFor(() => {
                expect(getByText(METER_GUID_REGEX_TEXT)).toBeTruthy()
            })
        })
    })
    describe('Submit form', () => {
        test('should edit existing meter, and call onNext when form is submitted', async () => {
            mockEditMeter.mockImplementation(() => ({ guid: '12345678912345' }))
            mockVerifyMeter.mockImplementation((_id, callback) => {
                callback('VERIFIED')
            })
            mockCreateEnedisSgeConsent.mockImplementation((_id, callback) => {
                callback()
            })
            const { container } = reduxedRender(<MeterConnectionStep {...mockMeterConnectionProps} />)
            userEvent.type(container.querySelector(guidMeterInputQuerySelector)!, '12345678912345')
            fireEvent.click(container.querySelector('#enedisSgeConsentStatus')!)

            const submitButton = screen.getByText('Suivant')
            screen.debug(container)
            fireEvent.click(submitButton)

            await waitFor(async () => {
                expect(mockEditMeter).toHaveBeenCalled()
                expect(mockLoadHousingsAndScopes).toHaveBeenCalled()
                expect(mockVerifyMeter).toHaveBeenCalled()
                expect(mockCreateEnedisSgeConsent).toHaveBeenCalled()
                expect(mockHandleNext).toHaveBeenCalled()
            })
        })

        test('should add new meter and call onNext when form is submitted', async () => {
            mockAddMeter.mockImplementation(() => ({ guid: '12345678912345' }))
            mockVerifyMeter.mockImplementation((_id, callback) => {
                callback('VERIFIED')
            })
            mockCreateEnedisSgeConsent.mockImplementation((_id, callback) => {
                callback()
            })
            const { container } = reduxedRender(
                <MeterConnectionStep {...mockMeterConnectionProps} meter={null as unknown as IMeter} />,
            )
            userEvent.type(container.querySelector(guidMeterInputQuerySelector)!, '12345678912345')
            fireEvent.click(container.querySelector('#enedisSgeConsentStatus')!)

            const submitButton = screen.getByText('Suivant')
            screen.debug(container)
            fireEvent.click(submitButton)

            await waitFor(async () => {
                expect(mockAddMeter).toHaveBeenCalled()
                expect(mockLoadHousingsAndScopes).toHaveBeenCalled()
                expect(mockVerifyMeter).toHaveBeenCalled()
                expect(mockCreateEnedisSgeConsent).toHaveBeenCalled()
                expect(mockHandleNext).toHaveBeenCalled()
            })
        })
    })
})
