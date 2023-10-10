import { postEquipmentInputType } from 'src/modules/MyHouse/components/Installation/InstallationType'

/**
 * EquipmentCardProps.
 */
export interface EquipmentCardProps {
    /**
     * Equipment id.
     */
    id: number
    /**
     * Equipment name.
     */
    name: string
    /**
     * Equipment type.
     */
    label?: string
    /**
     * Equipment number: represents how many of the same equipment the user has.
     */
    number: number
    /**
     * Equipment icon.
     */
    icon?: JSX.Element
    /**
     * Function that handle the equipment number.
     */
    onEquipmentChange: (body: postEquipmentInputType) => void
}
