import { CircularProgress } from '@mui/material'
import { orderBy } from 'lodash'
import { EquipmentCard } from 'src/modules/MyHouse/components/Equipments/EquipmentCard'
import { EquipmentsListProps } from 'src/modules/MyHouse/components/Equipments/EquipmentsList/equipmentsList'
import { equipmentNameType } from 'src/modules/MyHouse/components/Installation/InstallationType'
import { mappingEquipmentNameToType, myEquipmentOptions } from 'src/modules/MyHouse/utils/MyHouseVariables'

/**
 * EquipmentsList component.
 *
 * @param root0 N/A.
 * @param root0.housingEquipmentsList Equipments list containing all the equipments.
 * @param root0.loadingEquipmentInProgress Boolean for CircularProgress.
 * @param root0.saveEquipment Saving the equipment.
 * @returns EquipmentsList JSX.
 */
export const EquipmentsList = ({
    housingEquipmentsList,
    loadingEquipmentInProgress,
    saveEquipment,
}: EquipmentsListProps) => {
    // Map equipmentsList into a better readable list.
    const equipments = housingEquipmentsList
        ?.map((element) => {
            return {
                id: element.equipmentId,
                housingEquipmentId: element.id,
                name: element.equipment.name,
                allowedType: element.equipment.allowedType,
                number: element.equipmentNumber,
                isNumber: mappingEquipmentNameToType[element.equipment.name as equipmentNameType] === 'number',
                measurementModes: element.equipment.measurementModes,
            }
        })
        .filter((el) => el.number! > 0)

    // Order the equipments list from the largest to the smallest.
    const orderedEquipmentsList = orderBy(equipments, (el) => el.number, 'desc')

    if (loadingEquipmentInProgress)
        return (
            <div className="flex flex-col justify-center items-center w-full" style={{ minHeight: '60vh' }}>
                <CircularProgress />
            </div>
        )

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {orderedEquipmentsList &&
                orderedEquipmentsList.map((equipment) => {
                    const equipmentLabel = myEquipmentOptions.find(
                        (element) => element.name === equipment.name,
                    )?.labelTitle

                    return (
                        <EquipmentCard
                            key={equipment.id}
                            id={equipment.id}
                            label={equipmentLabel || equipment.name}
                            name={equipment.name}
                            housingEquipmentId={equipment.housingEquipmentId}
                            measurementModes={equipment.measurementModes}
                            number={equipment.number ? equipment.number : 0}
                            onEquipmentChange={saveEquipment}
                        />
                    )
                })}
        </div>
    )
}
