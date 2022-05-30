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
export type equipmentMeterType = {
    /**
     * Id of Equipment.
     */
    equipmentId: number
    /**
     * Number value of the equipment.
     */
    equipmentNumber?: number
    /**
     * Type value of the Equipment.
     */
    equipmentType?: equipmentAllowedTypeT
}

// eslint-disable-next-line jsdoc/require-jsdoc
export type equipmentType = {
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
}

/**
 * Equipment Meter model.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type IEquipmentMeter = equipmentMeterType & {
    /**
     * Indicate information about the equipments.
     */
    equipment: equipmentType
}

/**
 * Information to be passed when .
 */
//eslint-disable-next-line jsdoc/require-jsdoc
export type postEquipmentInputType = equipmentMeterType[]

//eslint-disable-next-line jsdoc/require-jsdoc
export type equipmentValuesType = { [key in equipmentNameType]: number | string }
