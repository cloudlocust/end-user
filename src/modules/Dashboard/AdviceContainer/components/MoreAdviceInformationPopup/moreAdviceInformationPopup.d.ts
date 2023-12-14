import { IEcogeste } from 'src/modules/Ecogestes/components/ecogeste'

/**
 * Represents the props for the MoreAdviceInformationPopup component.
 */
export interface MoreAdviceInformationPopupProps {
    /**
     * Specifies whether the popup is open or not.
     */
    isOpen: boolean
    /**
     * Callback function to be called when the popup is closed.
     */
    onClose: () => void
    /**
     * Clicked ecogeste to display.
     */
    currentEcogeste: IEcogeste | null
}
