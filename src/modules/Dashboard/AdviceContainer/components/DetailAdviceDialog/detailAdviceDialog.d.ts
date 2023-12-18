import { IEcogeste } from 'src/modules/Ecogestes/components/ecogeste'

/**
 * Represents the props for the MoreAdviceInformationPopup component.
 */
export interface DetailAdviceDialogProps {
    /**
     * Specifies whether the popup is open or not.
     */
    isDetailAdvicePopupOpen: boolean
    /**
     * Callback function to be called when the popup is closed.
     */
    onCloseDetailAdvicePopup: () => void
    /**
     * Clicked ecogeste to display.
     */
    currentEcogeste: IEcogeste | null
}
