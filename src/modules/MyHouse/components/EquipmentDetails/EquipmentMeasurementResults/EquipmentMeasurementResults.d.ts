/**
 * EquipmentMeasurementResultsProps.
 */
export interface EquipmentMeasurementResultsProps {
    /**
     * The list of measurement modes for the equipment.
     */
    measurementModes?: string[]
    /**
     * The global equipment id.
     */
    housingEquipmentId?: number
    /**
     * The equipment number.
     */
    equipmentNumber: number | null
}

/**
 * Type for the result object.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type resultType = {
    /**
     * The result value.
     */
    value?: number | null
    /**
     * Boolean indicate that the value is not yet recieved.
     */
    isLoading: boolean
}

/**
 * The measurement results state type.
 */
export interface measurementResultsStateType {
    [key: string]: resultType
}

/**
 * MeasurementResultProps.
 */
export interface MeasurementResultProps {
    /**
     * The measurement result.
     */
    result?: resultType
    /**
     * We are in the mobile view.
     */
    isMobileView?: boolean
}
