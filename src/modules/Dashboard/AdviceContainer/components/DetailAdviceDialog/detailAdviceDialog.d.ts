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
    /**
     * Function to set the view status of the ecogeste.
     */
    setViewStatus?: (ecogesteId: number, status: boolean) => Promise<void>
    /**
     * Specifies whether the popup is for a dashboard advice or not.
     */
    isDashboardAdvice?: boolean
}
