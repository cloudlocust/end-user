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
    housingEquipmentId: number
    /**
     * The number of equipments.
     */
    equipmentsNumber?: number
    /**
     * The equipment number.
     */
    equipmentNumber: number
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
        equipmentNumber: number,
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

/**
 * MeasurementResultProps.
 */
export interface MeasurementResultProps {
    /**
     * Function that open the measurement modal.
     */
    handleClickingOnMeasurementResult: () => void
    /**
     * The measurement result.
     */
    result?: number | null
    /**
     * The measurement result is loading.
     */
    isLoading?: boolean
    /**
     * We are in the mobile view.
     */
    isMobileView?: boolean
}
