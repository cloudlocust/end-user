import FuseLoading from 'src/common/ui-kit/fuse/components/FuseLoading/FuseLoading'
import { EquipmentCard } from 'src/modules/MyHouse/components/Equipments/EquipmentCard'
import { EquipmentsListProps } from 'src/modules/MyHouse/components/Equipments/EquipmentsList/equipmentsList'
import { myEquipmentOptions } from 'src/modules/MyHouse/utils/MyHouseVariables'

/**
 * EquipmentsList component.
 *
 * @param root0 N/A.
 * @param root0.housingEquipmentsList Equipments list containing all the equipments.
 * @param root0.loadingEquipmentInProgress Boolean for CircularProgress.
 * @param root0.addHousingEquipment Saving the equipment.
 * @returns EquipmentsList JSX.
 */
export const EquipmentsList = ({
    housingEquipmentsList,
    loadingEquipmentInProgress,
    addHousingEquipment,
}: EquipmentsListProps) => {
    if (loadingEquipmentInProgress)
        return (
            <div className="h-full items-center flex">
                <FuseLoading />
            </div>
        )

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {housingEquipmentsList &&
                housingEquipmentsList.map((equipment) => {
                    const equipmentLabel = myEquipmentOptions.find(
                        (element) => element.name === equipment.name,
                    )?.labelTitle

                    const iconComponent = myEquipmentOptions.find(
                        (element) => element.name === equipment.name,
                    )?.iconComponent

                    return (
                        <EquipmentCard
                            key={equipment.id}
                            id={equipment.id}
                            label={equipmentLabel || equipment.name}
                            name={equipment.name}
                            housingEquipmentId={equipment.housingEquipmentId}
                            measurementModes={equipment.measurementModes}
                            number={equipment.number ? equipment.number : 0}
                            onEquipmentChange={addHousingEquipment}
                            iconComponent={iconComponent}
                        />
                    )
                })}
        </div>
    )
}
