import FusePageCarded from 'src/common/ui-kit/fuse/components/FusePageCarded/FusePageCarded'
import { styled } from '@mui/material'
import { EquipmentsHeader } from 'src/modules/MyHouse/components/Equipments/EquipmentsHeader/'
import { EquipmentsList } from 'src/modules/MyHouse/components/Equipments/EquipmentsList'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { useEquipmentList } from 'src/modules/MyHouse/components/Installation/installationHook'
import { EquipmentsQuickAddPopup } from 'src/modules/MyHouse/components/Equipments/EquipmentsQuickAddPopup'
import { useEffect, useState } from 'react'
import { EmptyEquipmentsList } from 'src/modules/MyHouse/components/Equipments/EmptyEquipmentsList'

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
    const { equipmentList, saveEquipment, loadingEquipmentInProgress, isEquipmentMeterListEmpty, loadEquipmentList } =
        useEquipmentList(currentHousing?.id)
    const [isEquipmentsQuickAddPopupOpen, setIsEquipmentsQuickAddPopupOpen] = useState(false)

    useEffect(() => {
        loadEquipmentList()
    }, [loadEquipmentList])

    return (
        <Root
            header={<EquipmentsHeader isEquipmentMeterListEmpty={isEquipmentMeterListEmpty} />}
            content={
                <>
                    {isEquipmentsQuickAddPopupOpen && (
                        <EquipmentsQuickAddPopup
                            open={isEquipmentsQuickAddPopupOpen}
                            handleClosePopup={() => setIsEquipmentsQuickAddPopupOpen(false)}
                            saveEquipment={saveEquipment}
                            equipmentsList={equipmentList}
                            loadingEquipmentInProgress={loadingEquipmentInProgress}
                        />
                    )}
                    {isEquipmentMeterListEmpty || !equipmentList ? (
                        <EmptyEquipmentsList handleOpenPopup={() => setIsEquipmentsQuickAddPopupOpen(true)} />
                    ) : (
                        <EquipmentsList
                            equipmentsList={equipmentList}
                            loadingEquipmentInProgress={loadingEquipmentInProgress}
                        />
                    )}
                </>
            }
        />
    )
}
