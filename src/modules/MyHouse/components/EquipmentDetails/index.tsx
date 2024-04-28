import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { useCurrentHousing } from 'src/hooks/CurrentHousing'
import Container from '@mui/material/Container'
import { useEquipmentList } from 'src/modules/MyHouse/components/Installation/installationHook'
import isNull from 'lodash/isNull'
import FuseLoading from 'src/common/ui-kit/fuse/components/FuseLoading'
import EquipmentDetailsForm from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentDetailsForm'

/**
 * Equipment details.
 *
 * @returns Equipment details component.
 */
export default function EquipmentDetails() {
    const currentHousing = useCurrentHousing()
    const {
        addHousingEquipment,
        getHousingEquipmentDetailsByHousingIdAndEquipmentId,
        housingEquipmentsDetailsByHousingIdAndEquipmentId,
    } = useEquipmentList(currentHousing?.id)

    // eslint-disable-next-line jsdoc/require-jsdoc
    const params = useParams() as { housingEquipmentId: string; equipmentId: string }

    useEffect(() => {
        if (params.equipmentId) {
            getHousingEquipmentDetailsByHousingIdAndEquipmentId(params.equipmentId)
        }
    }, [params.equipmentId, getHousingEquipmentDetailsByHousingIdAndEquipmentId])

    if (isNull(housingEquipmentsDetailsByHousingIdAndEquipmentId)) {
        return <FuseLoading />
    }

    return (
        <PageSimple
            content={
                <Container>
                    <EquipmentDetailsForm
                        housingEquipmentsDetails={housingEquipmentsDetailsByHousingIdAndEquipmentId}
                        addHousingEquipment={addHousingEquipment}
                    />
                </Container>
            }
        />
    )
}
