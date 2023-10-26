import { postEquipmentInputType } from 'src/modules/MyHouse/components/Installation/InstallationType'
import { Theme } from '@mui/material'
import { ReactElement } from 'react'
/**
 * EquipmentCardProps.
 */
export interface EquipmentCardProps {
    /**
     * Equipment id.
     */
    id: number
    /**
     * Equipment name.
     */
    name: string
    /**
     * Equipment type.
     */
    label?: string
    /**
     * Equipment number: represents how many of the same equipment the user has.
     */
    number: number
    /**
     * Equipment icon.
     */
    iconPath?: string
    /**
     * Function that handle the equipment number.
     */
    onEquipmentChange: (body: postEquipmentInputType) => void

    /**
     * Equipment icon.
     *
     * It can be a function with theme param or a react element.
     *
     * @param theme Client theme.
     * @returns Icon component.
     */
    iconComponent?: (theme: Theme) => ReactElement | ReactElement
}
