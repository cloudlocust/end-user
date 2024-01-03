import { EquipmentIconProps } from 'src/modules/MyHouse/components/Equipments/EquipmentIcon/equipmentIcon'
import { getIconComponent } from 'src/modules/MyHouse/components/Equipments/utils'

/**
 * EquipmentIcon component.
 *
 * Renders an icon based on the provided equipment name.
 *
 * @param root0 N/A.
 * @param root0.equipmentName Equipment name.
 * @param root0.theme Mui Theme.
 * @param root0.isDisabled Is disabled state.
 * @param root0.fill Fill.
 * @returns EquipmentIcon component.
 */
export const EquipmentIcon = ({ equipmentName, theme, isDisabled, fill }: EquipmentIconProps) => {
    const IconComponent = getIconComponent(equipmentName)
    return (
        <IconComponent
            fill={isDisabled ? theme.palette.grey[300] : fill || theme.palette.primary.main}
            width={'35'}
            height={'35'}
        />
    )
}
