import { reduxedRender } from 'src/common/react-platform-components/test'
import { VerifyMeterPopup } from 'src/modules/MyHouse/components/MeterStatus/VerifyMeterPopup'

// Component Props.
let mockVerifyMeterPopupProps = {
    openVerifyMeterPopup: false,
    setOpenVerifyMeterPopup: jest.fn(),
}

const VERIFY_METER_MESSAGE = "Vérification de l'existence de votre compteur"

describe('Test VerifyMetePopup component', () => {
    test('when popup is open', async () => {
        mockVerifyMeterPopupProps.openVerifyMeterPopup = true
        const { getByText, getByTestId } = reduxedRender(<VerifyMeterPopup {...mockVerifyMeterPopupProps} />)
        expect(getByText(VERIFY_METER_MESSAGE)).toBeVisible()
        expect(getByTestId('linear-progess')).toHaveClass('MuiLinearProgress-colorPrimary')
    })
    test('whhen popup is not shown', async () => {
        mockVerifyMeterPopupProps.openVerifyMeterPopup = false
        const { getByText } = reduxedRender(<VerifyMeterPopup {...mockVerifyMeterPopupProps} />)
        expect(() => getByText(VERIFY_METER_MESSAGE)).toThrow()
    })
})
