import FusePageCarded from 'src/common/ui-kit/fuse/components/FusePageCarded/FusePageCarded'
import { styled } from '@mui/material'
import { EquipmentsHeader } from 'src/modules/MyHouse/components/Equipments/EquipmentsHeader/'
import { EquipmentsList } from 'src/modules/MyHouse/components/Equipments/EquipmentsList'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { useEquipmentList } from 'src/modules/MyHouse/components/Installation/installationHook'
import { EquipmentsQuickAddPopup } from 'src/modules/MyHouse/components/Equipments/EquipmentsQuickAddPopup'
import { useEffect, useMemo, useState } from 'react'
import { EmptyEquipmentsList } from 'src/modules/MyHouse/components/Equipments/EmptyEquipmentsList'
import { AddEquipmentPopup } from 'src/modules/MyHouse/components/Equipments/AddEquipmentPopup'
import { mappingEquipmentNameToType } from 'src/modules/MyHouse/utils/MyHouseVariables'
import { equipmentNameType } from 'src/modules/MyHouse/components/Installation/InstallationType'
import { orderBy } from 'lodash'
import { getAvailableEquipments } from 'src/modules/MyHouse/components/Equipments/utils'

const Root = styled(FusePageCarded)(() => ({
    '& .FusePageCarded-header': {
        minHeight: 90,
        height: 'fit-content',
        alignItems: 'center',
        margin: '24px 0',
    },
    '& .FusePageCarded-content': {
        overflowX: 'hidden',
        overflowY: 'auto',
        margin: 10,
    },
    '& .FusePageCarded-contentCard': {
        overflow: 'hidden',
    },
}))

/**
 * Housing Equipments.
 *
 * @returns Housing Equipments.
 */
export const Equipments = () => {
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const {
        equipmentsList,
        housingEquipmentsList,
        addHousingEquipment,
        loadingEquipmentInProgress,
        isEquipmentMeterListEmpty,
        loadEquipmentList,
        addEquipment,
        isaAdEquipmentLoading,
    } = useEquipmentList(currentHousing?.id)
    const [isEquipmentsQuickAddPopupOpen, setIsEquipmentsQuickAddPopupOpen] = useState(false)
    const [isAddEquipmentPopupOpen, setIsAddEquipmentPopupOpen] = useState(false)

    useEffect(() => {
        loadEquipmentList()
    }, [loadEquipmentList])

    const mappedHousingEquipmentsList = useMemo(
        () =>
            housingEquipmentsList
                ?.map((element) => {
                    return {
                        id: element.equipmentId,
                        housingEquipmentId: element.id,
                        name: element.equipment.name,
                        allowedType: element.equipment.allowedType,
                        number: element.equipmentNumber,
                        isNumber: mappingEquipmentNameToType[element.equipment.name as equipmentNameType] === 'number',
                        measurementModes: element.equipment.measurementModes,
                        customerId: element.equipment.customerId,
                    }
                })
                .filter((eq) => eq.number && (eq.isNumber || eq.customerId)),
        [housingEquipmentsList],
    )

    const orderedHousingEquipmentsList = useMemo(
        () => orderBy(mappedHousingEquipmentsList, (el) => el.measurementModes?.length, 'asc'),
        [mappedHousingEquipmentsList],
    )

    const availableEquipments = getAvailableEquipments(mappedHousingEquipmentsList, equipmentsList)

    return (
        <Root
            header={
                <EquipmentsHeader
                    isEquipmentMeterListEmpty={isEquipmentMeterListEmpty}
                    onOpenAddEquipmentPopup={() => setIsAddEquipmentPopupOpen(true)}
                />
            }
            content={
                <>
                    {isEquipmentsQuickAddPopupOpen && (
                        <EquipmentsQuickAddPopup
                            open={isEquipmentsQuickAddPopupOpen}
                            handleClosePopup={() => setIsEquipmentsQuickAddPopupOpen(false)}
                            addHousingEquipment={addHousingEquipment}
                            housingEquipmentsList={housingEquipmentsList}
                            loadingEquipmentInProgress={loadingEquipmentInProgress}
                        />
                    )}
                    {isEquipmentMeterListEmpty ? (
                        <EmptyEquipmentsList handleOpenPopup={() => setIsEquipmentsQuickAddPopupOpen(true)} />
                    ) : (
                        <EquipmentsList
                            housingEquipmentsList={orderedHousingEquipmentsList}
                            loadingEquipmentInProgress={loadingEquipmentInProgress}
                            addHousingEquipment={addHousingEquipment}
                        />
                    )}
                    {isAddEquipmentPopupOpen && (
                        <AddEquipmentPopup
                            isOpen={isAddEquipmentPopupOpen}
                            onClosePopup={() => setIsAddEquipmentPopupOpen(false)}
                            equipmentsList={availableEquipments}
                            addEquipment={addEquipment}
                            addHousingEquipment={addHousingEquipment}
                            isaAdEquipmentLoading={isaAdEquipmentLoading}
                        />
                    )}
                </>
            }
        />
    )
}
