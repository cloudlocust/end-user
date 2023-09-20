import { equipmentAllowedTypeT } from 'src/modules/MyHouse/components/Installation/InstallationType'

/**
 * EquipmentCardProps.
 */
export interface EquipmentCardProps {
    /**
     * Equipment name.
     */
    name: string
    /**
     * Equipment type.
     */
    type: equipmentAllowedTypeT
    /**
     * Equipment number: represents how many of the same equipment the user has.
     */
    number: number
}
