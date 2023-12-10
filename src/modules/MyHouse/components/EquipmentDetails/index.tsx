import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { useHistory, useLocation } from 'react-router-dom'
import { styled } from '@mui/material'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import FusePageCarded from 'src/common/ui-kit/fuse/components/FusePageCarded'
import { EquipmentDetailsPageLocationState } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentDetails'
import { EquipmentDetailsHeader } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentDetailsHeader'
import { EquipmentDetailsContent } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentDetailsContent'

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
 * Equipment details.
 *
 * @returns Equipment details component.
 */
export const EquipmentDetails = () => {
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const location = useLocation<EquipmentDetailsPageLocationState>()
    const { equipment } = location.state
    const history = useHistory()
    const isInitialRender = useRef(true)

    /**
     * Return to the equipment list page when the currentHousing is changed.
     */
    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false
        } else if (history.location.pathname.endsWith('/equipments/details') && currentHousing?.id) {
            history.push(`${URL_MY_HOUSE}/${currentHousing?.id}/equipments`)
        }
    }, [currentHousing?.id, history])

    return (
        <Root
            header={<EquipmentDetailsHeader equipmentName={equipment.name} />}
            content={<EquipmentDetailsContent equipmentDetails={equipment} />}
        />
    )
}
