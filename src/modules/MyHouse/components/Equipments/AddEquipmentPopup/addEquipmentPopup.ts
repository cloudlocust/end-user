import {
    addEquipmentType,
    equipmentType,
    postEquipmentInputType,
} from 'src/modules/MyHouse/components/Installation/InstallationType'

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
    equipmentsList?: equipmentType[]
    /**
     * Add equipment function.
     */
    addEquipment: (data: addEquipmentType) => Promise<postEquipmentInputType | undefined>
    /**
     * Loading boolean for adding equipment.
     */
    isAddEquipmentLoading: boolean
    /**
     * Add housing equipment function.
     */
    addHousingEquipment: (body: postEquipmentInputType) => Promise<postEquipmentInputType | undefined>
    /**
     * Callback to call when the equipment is added successfully.
     */
    onAddingEquipmentSuccesses?: (equipmentId: number) => void
}
