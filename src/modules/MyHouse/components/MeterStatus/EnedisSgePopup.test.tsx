import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MeterVerificationEnum } from 'src/modules/Consents/Consents.d'
import { EnedisSgePopup } from 'src/modules/MyHouse/components/MeterStatus/EnedisSgePopup'
import { BrowserRouter as Router } from 'react-router-dom'
import { EnedisSgePopupProps } from 'src/modules/MyHouse/components/MeterStatus/enedisSgePopup.d'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'

const SGE_MESSAGE = 'Example text'
const VERIFY_METER_MESSAGE = "Vérification de l'existence de votre compteur"
let mockCreateEnedisSgeConsent = jest.fn()

// Component Props.
let mockEnedisSgePopup: EnedisSgePopupProps = {
    openEnedisSgeConsentText: SGE_MESSAGE,
    houseId: TEST_HOUSES[0].id,
    createEnedisSgeConsent: mockCreateEnedisSgeConsent,
    createEnedisSgeConsentError: false,
    isCreateEnedisSgeConsentLoading: false,
}

let mockVerifyMeter = jest.fn()
let mockSetIsMeterVerifyLoading = jest.fn()
let mockisMeterVerifyLoading = false
let mockMeterVerificationEnum = MeterVerificationEnum.NOT_VERIFIED

// Mock consentsHook
jest.mock('src/modules/Consents/consentsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConsents: () => ({
        verifyMeter: mockVerifyMeter,
        setIsMeterVerifyLoading: mockSetIsMeterVerifyLoading,
        isMeterVerifyLoading: mockisMeterVerifyLoading,
        meterVerification: mockMeterVerificationEnum,
    }),
}))

describe('Test EnedisSgePopup component', () => {
    test('when popup is open', async () => {
        mockisMeterVerifyLoading = true
        const { getByText, getByTestId } = reduxedRender(
            <Router>
                <EnedisSgePopup {...mockEnedisSgePopup} />
            </Router>,
        )
        expect(getByText(SGE_MESSAGE)).toBeTruthy()
        userEvent.click(getByText(SGE_MESSAGE))
        expect(mockVerifyMeter).toBeCalledWith(mockEnedisSgePopup.houseId)
        expect(getByText(VERIFY_METER_MESSAGE)).toBeVisible()
        expect(getByTestId('linear-progess')).toHaveClass('MuiLinearProgress-colorPrimary')
    })
    test('when popup is not shown', async () => {
        mockEnedisSgePopup.houseId = undefined
        const { getByText } = reduxedRender(
            <Router>
                <EnedisSgePopup {...mockEnedisSgePopup} />
            </Router>,
        )
        expect(() => getByText(VERIFY_METER_MESSAGE)).toThrow()
    })
    test('when popup goes to the next step', async () => {
        mockEnedisSgePopup.houseId = TEST_HOUSES[0].id
        mockMeterVerificationEnum = MeterVerificationEnum.VERIFIED
        const { getByText, getByTestId } = reduxedRender(
            <Router>
                <EnedisSgePopup {...mockEnedisSgePopup} />
            </Router>,
        )
        expect(getByText(SGE_MESSAGE)).toBeTruthy()
        userEvent.click(getByText(SGE_MESSAGE))
        expect(mockVerifyMeter).toBeCalledWith(mockEnedisSgePopup.houseId)
        const checkbox = getByTestId('sge-checkbox').querySelector('input[type="checkbox"]') as Element
        expect(checkbox).toHaveProperty('checked', false)
        userEvent.click(checkbox)
        expect(mockCreateEnedisSgeConsent).toBeCalled()
    })
})
