import { EquipmentCard } from 'src/modules/MyHouse/components/Equipments/EquipmentCard'
import { EquipmentsListProps } from 'src/modules/MyHouse/components/Equipments/EquipmentsList/equipmentsList'

/**
 * EquipmentsList component.
 *
 * @param root0 N/A.
 * @param root0.housingEquipmentsList Equipments list containing all the equipments.
 * @param root0.addingInProgressEquipmentsIds List of equipments ids with adding in progress.
 * @param root0.addHousingEquipment Saving the equipment.
 * @returns EquipmentsList JSX.
 */
export const EquipmentsList = ({
    housingEquipmentsList,
    addingInProgressEquipmentsIds,
    addHousingEquipment,
}: EquipmentsListProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {housingEquipmentsList &&
                housingEquipmentsList.map((equipment) => {
                    return (
                        <EquipmentCard
                            key={equipment.id}
                            equipment={equipment}
                            label={equipment.equipmentLabel || equipment.name}
                            onEquipmentChange={addHousingEquipment}
                            addingEquipmentInProgress={addingInProgressEquipmentsIds.includes(equipment.id)}
                            iconComponent={equipment.iconComponent}
                        />
                    )
                })}
        </div>
    )
}
