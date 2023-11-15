import { useLocation } from 'react-router-dom'
// import { RootState } from 'src/redux'
// import { useSelector } from 'react-redux'
import { styled } from '@mui/material'
import FusePageCarded from 'src/common/ui-kit/fuse/components/FusePageCarded'
import { EquipmentDetailsPageLocationState } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentDetails'
import { EquipmentDetailsHeader } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentDetailsHeader'

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
    // const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const location = useLocation<EquipmentDetailsPageLocationState>()
    const { equipment } = location.state

    return <Root header={<EquipmentDetailsHeader equipmentName={equipment.name} />} />
}
