import { useLocation, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import Container from '@mui/material/Container'
import { useCurrentHousing } from 'src/hooks/CurrentHousing'
import { useEquipmentList } from 'src/modules/MyHouse/components/Installation/installationHook'
import isNull from 'lodash/isNull'
import FuseLoading from 'src/common/ui-kit/fuse/components/FuseLoading'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import EquipmentsUsageForm from 'src/modules/MyHouse/components/EquipmentsUsage/EquipmentsUsageForm'

/**
 * EquipmentUsage component.
 *
 * @returns Equipment usage JSX.
 */
export default function EquipmentsUsage() {
    // eslint-disable-next-line jsdoc/require-jsdoc
    const params = useParams() as { housingEquipmentId: string; equipmentId: string }
    const {
        state: {
            equipment: { title },
        },
    } = useLocation</**
     *
     */
    {
        /**
         *
         */
        equipment: /**
         *
         */
        {
            /**
             * Equipment title that the user has given if it's a custom equipment or the general name of the equipment.
             */
            title: string
        }
    }>()

    const currentHousing = useCurrentHousing()
    const {
        addHousingEquipment,
        getHousingEquipmentDetailsByHousingIdAndEquipmentId: getHousingEquipmentsDetails,
        housingEquipmentsDetailsByHousingIdAndEquipmentId: housingEquipmentsDetails,
    } = useEquipmentList(currentHousing?.id)

    useEffect(() => {
        if (params.equipmentId) {
            getHousingEquipmentsDetails(params.equipmentId)
        }
    }, [params.equipmentId, getHousingEquipmentsDetails])

    if (isNull(housingEquipmentsDetails)) {
        return <FuseLoading />
    }

    return (
        <PageSimple
            content={
                <Container>
                    <EquipmentsUsageForm
                        housingEquipmentsDetails={housingEquipmentsDetails}
                        addHousingEquipment={addHousingEquipment}
                        {...{ title }}
                    />
                </Container>
            }
        />
    )
}
