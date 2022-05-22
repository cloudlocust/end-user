/**
 * Equipment Name type.
 */
export type equipmentNameType =
    | 'heating'
    | 'hotplates'
    | 'microwave'
    | 'fridge'
    | 'dishwasher'
    | 'stove'
    | 'desktop'
    | 'laptop'
    | 'television'
    | 'vacuum'
    | 'washing_machine'
    | 'dryer'

/**
 * Equipment model.
 */
export interface IEquipment {
    /**
     * Id of Equipment.
     */
    equipmentId: number
    /**
     * Number of possession for this equipment.
     */
    equipmentNumber: number
    /**
     * Type of the Equipment.
     */
    equipmentType: string
    /**
     * Name of the Equipment.
     */
    equipmentName: equipmentNameType
}

/**
 * Information to be passed when .
 */
//eslint-disable-next-line jsdoc/require-jsdoc
export type postEquipmentInputType = IEquipment[]
