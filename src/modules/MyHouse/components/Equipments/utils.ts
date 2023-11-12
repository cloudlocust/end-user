import { isNil } from 'lodash'
import { HousingEquipmentListType } from 'src/modules/MyHouse/components/Equipments/EquipmentsList/equipmentsList'
import { equipmentType } from 'src/modules/MyHouse/components/Installation/InstallationType'

/**
 * Function that compares housingEquipments & equipments.
 *
 * @param housingEquipments Housing equipments list.
 * @param equipments Equipments list.
 * @returns Available equipments that were not chosen.
 */
export function getAvailableEquipments(
    housingEquipments?: HousingEquipmentListType,
    equipments?: equipmentType[] | null,
) {
    if (isNil(housingEquipments) || isNil(equipments)) return
    // Filter out the equipments that are already chosen
    return equipments?.filter((equipment) => {
        // Check if the equipment is in the housing equipment list
        const isChosen = housingEquipments?.some((housingEquipment) => housingEquipment.id === equipment.id)
        // Only include equipment if it's not already chosen
        return !isChosen
    })
}
