/**
 * Equipment Name type.
 */
export type equipmentNameType =
    | 'heater'
    | 'hotplate'
    | 'tv'
    | 'vacuum'
    | 'oven'
    | 'microwave'
    | 'fridge'
    | 'dishwasher'
    | 'washingmachine'
    | 'dryer'
    | 'laptop'
    | 'desktopcomputer'

// eslint-disable-next-line jsdoc/require-jsdoc
export type equipmentAllowedTypeT = 'induction' | 'electricity' | 'other' | 'vitroceramic'

// eslint-disable-next-line jsdoc/require-jsdoc
export type equipmentMetersType = {
    // eslint-disable-next-line jsdoc/require-jsdoc
    equipmentId: number
    // eslint-disable-next-line jsdoc/require-jsdoc
    equipmentNumber?: number
    // eslint-disable-next-line jsdoc/require-jsdoc
    equipmentType?: equipmentAllowedTypeT
}

/**
 * Equipment model.
 */
export interface IEquipment {
    /**
     * Id of Equipment.
     */
    id: number
    /**
     * Name of the equipment.
     */
    name: equipmentNameType
    /**
     * Type of the Equipment.
     */
    allowedType: equipmentAllowedTypeT[]
    /**
     * Indicate if this equipment is associated to the meter with meter_id.
     */
    equipmentMeters: null | equipmentMetersType[]
}

/**
 * Information to be passed when .
 */
//eslint-disable-next-line jsdoc/require-jsdoc
export type postEquipmentInputType = equipmentMetersType[]

//eslint-disable-next-line jsdoc/require-jsdoc
export type equipmentValuesType = { [key in equipmentNameType]: number | string }
