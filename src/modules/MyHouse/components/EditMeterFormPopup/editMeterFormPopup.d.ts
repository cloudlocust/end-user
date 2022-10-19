import { editMeterInputType } from 'src/modules/Meters/Meters.d'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing.d'

/**
 * Props for EditMeterFormPopup component.
 */
export interface EditMeterFormPopupProps {
    /**
     * Open modal.
     */
    open: boolean
    /**
     * Function to close modal.
     */
    onClose: () => void
    /**
     * House id.
     */
    houseId: string
    /**
     * Function that edits the meter.
     */
    editMeter: (houseId: number, values: editMeterInputType) => void
    /**
     * LoadHousingList for redux dispatch.
     */
    loadHousinglist: () => void
    /**
     * Loading state.
     */
    loadingInProgress: boolean
    /**
     * Found housing.
     */
    foundHousing: IHousing
}
