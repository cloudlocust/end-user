import { HousingEquipmentType } from 'src/modules/MyHouse/components/Equipments/EquipmentsList/equipmentsList'

/**
 * EquipmentDetailsContentProps.
 */
export interface EquipmentDetailsContentProps {
    /**
     * The equipment details object.
     */
    equipmentDetails: HousingEquipmentType
}

/**
 * Type of the select onChange handler function.
 */
export type SelectOnChangeHandler = (event: SelectChangeEvent<string>) => void
