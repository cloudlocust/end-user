import { equipmentNameType } from 'src/modules/MyHouse/components/Installation/InstallationType'
import { Theme } from '@mui/material'

/**
 * Equipment icon props.
 */
export interface EquipmentIconProps {
    /**
     * Equipment name.
     */
    equipmentName: equipmentNameType
    /**
     * MUI Theme.
     */
    theme: Theme
    /**
     *  Is disabled state.
     */
    isDisabled?: boolean
    /**
     * Fill.
     */
    fill?: string
}
