import { useEffect, useMemo, useState } from 'react'
import { CircularProgress } from '@mui/material'
import { useEquipmentList } from 'src/modules/MyHouse/components/Installation/installationHook'
import { useCurrentHousing } from 'src/hooks/CurrentHousing'
import { EquipmentsList } from 'src/modules/MyHouse/components/Equipments/EquipmentsList'
import { EquipmentsQuickAddPopup } from 'src/modules/MyHouse/components/Equipments/EquipmentsQuickAddPopup'
import { EmptyEquipmentsList } from 'src/modules/MyHouse/components/Equipments/EmptyEquipmentsList'
import { AddEquipmentPopup } from 'src/modules/MyHouse/components/Equipments/AddEquipmentPopup'
import {
    filterAndFormathousingEquipments,
    getAvailableEquipments,
} from 'src/modules/MyHouse/components/Equipments/utils'

/**
 * Equipments component renders a list of housing equipments.
 *
 * @returns Housing Equipments.
 */
export const EquipmentsTab = () => {
    const currentHousing = useCurrentHousing()
    const {
        equipmentsList,
        housingEquipmentsList,
        addingInProgressEquipmentsIds,
        addHousingEquipment,
        loadingEquipmentInProgress,
        loadEquipmentList,
        addEquipment,
        isAddEquipmentLoading,
    } = useEquipmentList(currentHousing?.id)

    const [isEquipmentsQuickAddPopupOpen, setIsEquipmentsQuickAddPopupOpen] = useState(false)
    const [isAddEquipmentPopupOpen, setIsAddEquipmentPopupOpen] = useState(false)

    useEffect(() => {
        loadEquipmentList()
    }, [loadEquipmentList])

    const formatedHousingEquipmentsList = useMemo(
        () => filterAndFormathousingEquipments(housingEquipmentsList),
        [housingEquipmentsList],
    )

    if (loadingEquipmentInProgress) {
        return (
            <div className="flex flex-col justify-center items-center w-full h-256">
                <CircularProgress size={50} />
            </div>
        )
    }

    return (
        <>
            {Boolean(formatedHousingEquipmentsList?.length) ? (
                <EquipmentsList
                    housingEquipmentsList={formatedHousingEquipmentsList}
                    addingInProgressEquipmentsIds={addingInProgressEquipmentsIds}
                    addHousingEquipment={addHousingEquipment}
                    onOpenAddEquipmentPopup={() => setIsAddEquipmentPopupOpen(true)}
                />
            ) : (
                <EmptyEquipmentsList handleOpenPopup={() => setIsEquipmentsQuickAddPopupOpen(true)} />
            )}
            {isAddEquipmentPopupOpen && (
                <AddEquipmentPopup
                    isOpen={isAddEquipmentPopupOpen}
                    onClosePopup={() => setIsAddEquipmentPopupOpen(false)}
                    equipmentsList={getAvailableEquipments(formatedHousingEquipmentsList, equipmentsList)}
                    addEquipment={addEquipment}
                    addHousingEquipment={addHousingEquipment}
                    isAddEquipmentLoading={isAddEquipmentLoading}
                />
            )}
            {isEquipmentsQuickAddPopupOpen && (
                <EquipmentsQuickAddPopup
                    open={isEquipmentsQuickAddPopupOpen}
                    handleClosePopup={() => setIsEquipmentsQuickAddPopupOpen(false)}
                    addHousingEquipment={addHousingEquipment}
                    housingEquipmentsList={housingEquipmentsList}
                    loadingEquipmentInProgress={loadingEquipmentInProgress}
                />
            )}
        </>
    )
}
