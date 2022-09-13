import { MeterVerificationEnum } from 'src/modules/Consents/Consents'

/**
 * Interface for Sge Popup Props.
 */
export interface SgePopupProps {
    /**
     * State for openVerifyMeterPopup.
     */
    openSgePopup: boolean
    /**
     * Setter for openVerifyMeterPopup state.
     */
    setOpenSgePopup: (openVerifyMeterPopup: boolean) => void
    /**
     * Verifying meter state.
     */
    isMeterVerifyLoading: boolean
    /**
     * State that shows if the meterr has been verified successfully or not.
     */
    meterVerification: MeterVerificationEnum
    /**
     * Setterr for setIsMeterVerified.
     */
    setMeterVerification: React.Dispatch<React.SetStateAction<MeterVerificationEnum>>
}
