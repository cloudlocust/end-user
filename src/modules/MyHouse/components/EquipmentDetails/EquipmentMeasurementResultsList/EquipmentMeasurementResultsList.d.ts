/**
 * EquipmentMeasurementResultsListProps.
 */
export interface EquipmentMeasurementResultsListProps {
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
 * The measurement results state type.
 */
export interface measurementResultsStateType {
    [key: string]: number | null
}
