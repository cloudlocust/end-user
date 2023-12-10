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
    housingEquipmentId: number
    /**
     * The number of equipments.
     */
    equipmentsNumber: number
    /**
     * The equipment number.
     */
    equipmentNumber: number | null
    /**
     * The measurement result values.
     */
    measurementResults: measurementResultsStateType
    /**
     * The measurement result values is loading.
     */
    isLoadingMeasurements: boolean
    /**
     * Function to update the measurement result values.
     */
    updateEquipmentMeasurementResults: (
        equipmentNumber: number | null,
        housingEquipmentId: number,
        measurementModes: string[],
    ) => Promise<void>
}

/**
 * The measurement results state type.
 */
export interface measurementResultsStateType {
    [key: string]: number | null
}
