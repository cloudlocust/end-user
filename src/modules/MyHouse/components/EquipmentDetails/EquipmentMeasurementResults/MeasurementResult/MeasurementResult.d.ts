import { resultType } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResults/EquipmentMeasurementResults'

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
