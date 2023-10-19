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
     * The global equipment id.
     */
    housingEquipmentId?: number
    /**
     * Measurement modes for the Equipment.
     */
    measurementModes?: string[]
    /**
     * Equipment icon.
     */
    icon?: JSX.Element
    /**
     * Function that handle the equipment number.
     */
    onEquipmentChange: (body: postEquipmentInputType) => void
}
