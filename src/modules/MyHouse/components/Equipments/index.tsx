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
import { mappingEquipmentNameToType, myEquipmentOptions } from 'src/modules/MyHouse/utils/MyHouseVariables'
import { equipmentNameType } from 'src/modules/MyHouse/components/Installation/InstallationType'
import { getAvailableEquipments } from 'src/modules/MyHouse/components/Equipments/utils'
import { orderListBy } from 'src/modules/utils'
import FuseLoading from 'src/common/ui-kit/fuse/components/FuseLoading'

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
        addingInProgressEquipmentsIds,
        addHousingEquipment,
        loadingEquipmentInProgress,
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
                ?.filter(
                    (housingEquipment) =>
                        housingEquipment.equipment.allowedType.includes('existant') ||
                        housingEquipment.equipment.allowedType.includes('electricity'),
                )
                ?.map((housingEquipment) => {
                    const equipmentOption = myEquipmentOptions.find(
                        (option) => option.name === housingEquipment.equipment.name,
                    )
                    return {
                        id: housingEquipment.equipmentId,
                        housingEquipmentId: housingEquipment.id,
                        name: housingEquipment.equipment.name,
                        equipmentLabel: equipmentOption?.labelTitle || housingEquipment.equipment.name,
                        iconComponent: equipmentOption?.iconComponent,
                        allowedType: housingEquipment.equipment.allowedType,
                        number: housingEquipment.equipmentNumber,
                        isNumber:
                            mappingEquipmentNameToType[housingEquipment.equipment.name as equipmentNameType] ===
                            'number',
                        measurementModes: housingEquipment.equipment.measurementModes,
                        customerId: housingEquipment.equipment.customerId,
                        ...housingEquipment,
                    }
                })
                .filter((eq) => eq.number && (eq.isNumber || eq.customerId)),
        [housingEquipmentsList],
    )

    const orderedHousingEquipmentsList = useMemo(
        () =>
            mappedHousingEquipmentsList
                ? orderListBy(mappedHousingEquipmentsList, (item) => item.equipmentLabel || item.name)
                : mappedHousingEquipmentsList,
        [mappedHousingEquipmentsList],
    )

    const availableEquipments = getAvailableEquipments(mappedHousingEquipmentsList, equipmentsList)

    return (
        <Root
            header={
                <EquipmentsHeader
                    isEquipmentMeterListEmpty={!mappedHousingEquipmentsList?.length}
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
                    {loadingEquipmentInProgress ? (
                        <div className="h-full items-center flex">
                            <FuseLoading />
                        </div>
                    ) : !mappedHousingEquipmentsList?.length ? (
                        <EmptyEquipmentsList handleOpenPopup={() => setIsEquipmentsQuickAddPopupOpen(true)} />
                    ) : (
                        <EquipmentsList
                            housingEquipmentsList={orderedHousingEquipmentsList}
                            addingInProgressEquipmentsIds={addingInProgressEquipmentsIds}
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
