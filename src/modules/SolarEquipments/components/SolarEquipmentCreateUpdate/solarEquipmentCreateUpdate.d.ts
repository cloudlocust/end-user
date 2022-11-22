import { ISolarEquipment } from 'src/modules/SolarEquipments/solarEquipments'

/**
 * Props for SolarEquipmentCreateUpdateProps component.
 */
export interface SolarEquipmentCreateUpdateProps {
    /**
     *
     */
    open: boolean
    /**
     *
     */
    onClose: () => void
    /**
     *
     */
    solarEquipmentDetails: ISolarEquipment | null
    /**
     *
     */
    reloadSolarEquipmentsList: () => void
}
