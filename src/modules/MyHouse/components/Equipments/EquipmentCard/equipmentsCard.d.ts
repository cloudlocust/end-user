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
     * Funcrion that increament equipment number.
     */
    onIncreasmentEquipmentNumber: () => void
    /**
     * Function that decreament equipment number.
     */
    onDecrementEquipmentNumber: () => void
}
