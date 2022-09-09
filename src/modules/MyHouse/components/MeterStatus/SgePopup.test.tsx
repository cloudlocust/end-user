import { reduxedRender } from 'src/common/react-platform-components/test'
import { SgePopup } from 'src/modules/MyHouse/components/MeterStatus/SgePopup'

// Component Props.
let mockVerifyMeterPopupProps = {
    openSgePopup: false,
    setOpenSgePopup: jest.fn(),
    isMeterVerifyLoading: false,
    isMeterVerified: false,
    setIsMeterVerified: jest.fn(),
}

const VERIFY_METER_MESSAGE = "Vérification de l'existence de votre compteur"

describe('Test VerifyMetePopup component', () => {
    test('when popup is open', async () => {
        mockVerifyMeterPopupProps.openSgePopup = true
        mockVerifyMeterPopupProps.isMeterVerifyLoading = true
        const { getByText, getByTestId } = reduxedRender(<SgePopup {...mockVerifyMeterPopupProps} />)
        expect(getByText(VERIFY_METER_MESSAGE)).toBeVisible()
        expect(getByTestId('linear-progess')).toHaveClass('MuiLinearProgress-colorPrimary')
    })
    test('whhen popup is not shown', async () => {
        mockVerifyMeterPopupProps.openSgePopup = false
        const { getByText } = reduxedRender(<SgePopup {...mockVerifyMeterPopupProps} />)
        expect(() => getByText(VERIFY_METER_MESSAGE)).toThrow()
    })
})
