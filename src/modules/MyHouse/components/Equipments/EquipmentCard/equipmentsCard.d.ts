import { postEquipmentInputType } from 'src/modules/MyHouse/components/Installation/InstallationType'
import { Theme } from '@mui/material'
import { ReactElement } from 'react'
import { HousingEquipmentType } from 'src/modules/MyHouse/components/Equipments/EquipmentsList/equipmentsList'

/**
 * Equipment icon.
 *
 * It can be a function with theme param or a react element.
 *
 * @param theme Client theme.
 * @param isDisabled Is icon disabled.
 * @returns Icon component.
 */
export type IconComponentType = (theme: Theme, isDisabled?: boolean, fill?: string) => ReactElement | ReactElement

/**
 * EquipmentCardProps.
 */
export interface EquipmentCardProps {
    /**
     * The equipment details object.
     */
    equipment: HousingEquipmentType
    /**
     * Equipment type.
     */
    label?: string
    /**
     * Equipment icon.
     */
    iconPath?: string
    /**
     * Function that handle the equipment number.
     */
    onEquipmentChange: (body: postEquipmentInputType) => void
    /**
     * Boolean indicating if adding equipment is in progress.
     */
    addingEquipmentInProgress?: boolean
    /**
     * Icon Component.
     */
    iconComponent?: IconComponentType
}
