import { addEquipmentType, equipmentType } from 'src/modules/MyHouse/components/Installation/InstallationType'

/**
 * Add equipment popup props.
 */
export interface AddEquipmentPopupProps {
    /**
     * Callback to close popup.
     */
    onClosePopup: () => void
    /**
     * Boolean for popup open or not.
     */
    isOpen: boolean
    /**
     * Equipments list.
     */
    equipmentsList: equipmentType[] | null
    /**
     * Add equipment function.
     */
    addEquipment: (bodu: addEquipmentType) => Promise<void>
    /**
     * Loading boolean for adding equipment.
     */
    isaAdEquipmentLoading: boolean
}
