import { Container, CircularProgress } from '@mui/material'
import { orderBy } from 'lodash'
import { EquipmentCard } from 'src/modules/MyHouse/components/Equipments/EquipmentCard'
import { EquipmentsListProps } from 'src/modules/MyHouse/components/Equipments/EquipmentsList/equipmentsList'

/**
 * EquipmentsList component.
 *
 * @param root0 N/A.
 * @param root0.equipmentsList Equipments list containing all the equipments.
 * @param root0.loadingEquipmentInProgress Boolean for CircularProgress.
 * @returns EquipmentsList JSX.
 */
export const EquipmentsList = ({ equipmentsList, loadingEquipmentInProgress }: EquipmentsListProps) => {
    if (loadingEquipmentInProgress)
        return (
            <div className="flex flex-col justify-center items-center w-full" style={{ minHeight: '60vh' }}>
                <CircularProgress />
            </div>
        )

    // Map equipmentsList into a better readable list.
    // TODO: filter list to have only those who has value
    const equipments = equipmentsList?.map((element) => {
        return {
            id: element.equipmentId,
            name: element.equipment.name,
            allowedType: element.equipment.allowedType,
            number: element.equipmentNumber,
            type: element.equipmentType!,
        }
    })
    // .filter((element) => (element.number ? element.number > 0 : null))
    // Order the equipments list from the largest to the smallest.
    const orderedEquipmentsList = orderBy(equipments, (el) => el.number, 'desc')

    return (
        <Container>
            {orderedEquipmentsList?.map((equipment) => {
                return (
                    <EquipmentCard
                        key={equipment.id}
                        type={equipment.type}
                        name={equipment.name}
                        number={equipment.number ? equipment.number : 0}
                    />
                )
            })}
        </Container>
    )
}
