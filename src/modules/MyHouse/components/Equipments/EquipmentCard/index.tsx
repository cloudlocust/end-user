import { Card, CardContent } from '@mui/material'
import { EquipmentCardProps } from 'src/modules/MyHouse/components/Equipments/EquipmentCard/equipmentsCard'
import { getEquipmentIconPath } from 'src/modules/MyHouse/utils/MyHouseVariables'

/**
 * Equipment Card component.
 *
 * @param root0 N/A.
 * @param root0.name EquipmentCard name.
 * @param root0.type EquipmentCard type.
 * @param root0.number How many equipments are there of that type.
 * @returns EquipmentCard JSX.
 */
export const EquipmentCard = ({ name, type, number }: EquipmentCardProps) => {
    return (
        <Card className="rounded-16 border border-slate-600 w-full md:w-1/2 lg:w-1/3 h-96" data-testid="equipment-item">
            <CardContent className="flex justify-between flex-row">
                <img src={getEquipmentIconPath(name)} alt="equipment-icon" />
                <div>
                    <div>{type}</div>
                    <div>{number}</div>
                </div>
            </CardContent>
        </Card>
    )
}
