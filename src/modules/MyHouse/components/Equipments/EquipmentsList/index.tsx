import { CircularProgress } from '@mui/material'
import { orderBy } from 'lodash'
import { EquipmentCard } from 'src/modules/MyHouse/components/Equipments/EquipmentCard'
import { EquipmentsListProps } from 'src/modules/MyHouse/components/Equipments/EquipmentsList/equipmentsList'
import { mappingEquipmentNameToType, myEquipmentOptions } from 'src/modules/MyHouse/utils/MyHouseVariables'

/**
 * EquipmentsList component.
 *
 * @param root0 N/A.
 * @param root0.housingEquipmentsList Equipments list containing all the equipments.
 * @param root0.loadingEquipmentInProgress Boolean for CircularProgress.
 * @returns EquipmentsList JSX.
 */
export const EquipmentsList = ({ housingEquipmentsList, loadingEquipmentInProgress }: EquipmentsListProps) => {
    if (loadingEquipmentInProgress)
        return (
            <div className="flex flex-col justify-center items-center w-full" style={{ minHeight: '60vh' }}>
                <CircularProgress />
            </div>
        )

    // Map equipmentsList into a better readable list.
    const equipments = housingEquipmentsList
        ?.map((element) => {
            return {
                id: element.equipmentId,
                name: element.equipment.name,
                allowedType: element.equipment.allowedType,
                number: element.equipmentNumber,
                isNumber: mappingEquipmentNameToType[element.equipment.name] === 'number',
            }
        })
        .filter((el) => el.isNumber && el.number! > 0)
    // Order the equipments list from the largest to the smallest.
    const orderedEquipmentsList = orderBy(equipments, (el) => el.number, 'desc')

    // eslint-disable-next-line jsdoc/require-jsdoc
    const onIncreasmentEquipmentNumber = async () => {}
    // eslint-disable-next-line jsdoc/require-jsdoc
    const onDecrementEquipmentNumber = async () => {}

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {orderedEquipmentsList?.map((equipment) => {
                const equipmentLabel = myEquipmentOptions.find((element) => element.name === equipment.name)?.labelTitle

                return (
                    <EquipmentCard
                        key={equipment.id}
                        label={equipmentLabel}
                        name={equipment.name}
                        number={equipment.number ? equipment.number : 0}
                        onIncreasmentEquipmentNumber={onIncreasmentEquipmentNumber}
                        onDecrementEquipmentNumber={onDecrementEquipmentNumber}
                    />
                )
            })}
        </div>
    )
}
