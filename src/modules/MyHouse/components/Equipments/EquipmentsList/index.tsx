import { Icon } from '@mui/material'
import { useIntl } from 'react-intl'
import { ButtonLoader } from 'src/common/ui-kit'
import { EquipmentCard } from 'src/modules/MyHouse/components/Equipments/EquipmentCard'
import { EquipmentsListProps } from 'src/modules/MyHouse/components/Equipments/EquipmentsList/equipmentsList'

/**
 * EquipmentsList component.
 *
 * @param root0 N/A.
 * @param root0.housingEquipmentsList Equipments list containing all the equipments.
 * @param root0.addingInProgressEquipmentsIds List of equipments ids with adding in progress.
 * @param root0.addHousingEquipment Saving the equipment.
 * @param root0.onOpenAddEquipmentPopup Callback function to open addEquipmentPopup component..
 * @returns EquipmentsList JSX.
 */
export const EquipmentsList = ({
    housingEquipmentsList,
    addingInProgressEquipmentsIds,
    addHousingEquipment,
    onOpenAddEquipmentPopup,
}: EquipmentsListProps) => {
    return (
        <>
            <AddNewEquipmentButton onOpenAddEquipmentPopup={onOpenAddEquipmentPopup} />
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {housingEquipmentsList &&
                    housingEquipmentsList.map((housingEq) => {
                        return (
                            <EquipmentCard
                                key={housingEq.id}
                                equipment={housingEq}
                                title={housingEq.equipmentTitle}
                                label={housingEq.equipmentLabel}
                                onEquipmentChange={addHousingEquipment}
                                addingEquipmentInProgress={addingInProgressEquipmentsIds.includes(housingEq.id)}
                                iconComponent={housingEq.iconComponent}
                            />
                        )
                    })}
            </div>
        </>
    )
}

/**
 * Add New Equipment Button.
 *
 * @param root0 N/A.
 * @param root0.onOpenAddEquipmentPopup Callback function to open addEquipmentPopup component.
 * @returns AddNewEquipmentButton JSX.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
const AddNewEquipmentButton = ({ onOpenAddEquipmentPopup }: { onOpenAddEquipmentPopup: () => void }) => {
    const { formatMessage } = useIntl()
    return (
        <ButtonLoader
            className="whitespace-nowrap"
            variant="contained"
            color="primary"
            onClick={onOpenAddEquipmentPopup}
            sx={{
                '&:hover': {
                    backgroundColor: 'primary.main',
                    opacity: '.7',
                },
            }}
        >
            <span className="hidden sm:flex">
                {formatMessage({
                    id: 'Ajouter un équipement',
                    defaultMessage: 'Ajouter un équipement',
                })}
            </span>
            <span className="flex sm:hidden">
                <Icon>add</Icon>
            </span>
        </ButtonLoader>
    )
}
