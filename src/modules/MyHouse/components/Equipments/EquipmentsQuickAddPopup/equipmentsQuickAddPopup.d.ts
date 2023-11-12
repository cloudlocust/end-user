import { IEquipmentMeter, postEquipmentInputType } from 'src/modules/MyHouse/components/Installation/InstallationType'

/**
 * EquipmentsQuickAddPopup props.
 */
export interface EquipmentsQuickAddPopupProps {
    /**
     * Open state for dialog.
     *
     * @returns True.
     */
    open: boolean

    /**
     * OnClose function to close the dialog.
     *
     * @returns False.
     */
    handleClosePopup: () => void

    /**
     * Function that handle saving new equipments number.
     *
     * @param body EquipmentMeterType[].
     * @returns Promise.
     */
    addHousingEquipment: (body: postEquipmentInputType) => Promise<postEquipmentInputType | undefined>

    /**
     * List of all equipments.
     */
    housingEquipmentsList: IEquipmentMeter[] | null

    /**
     * Equipments loading state.
     */
    loadingEquipmentInProgress: boolean
}
