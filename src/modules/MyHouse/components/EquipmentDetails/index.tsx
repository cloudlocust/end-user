import { useParams, useLocation } from 'react-router-dom'
import { EquipmentDetailsPageLocationState } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentDetails'

/**
 * Equipment details.
 *
 * @returns Equipment details component.
 */
export const EquipmentDetails = () => {
    // eslint-disable-next-line jsdoc/require-jsdoc
    const { houseId } = useParams<{ houseId: string }>()
    const location = useLocation<EquipmentDetailsPageLocationState>()
    const { equipment } = location.state

    return (
        <div>
            <h2>Equipment Details Page</h2>
            <h4>houseId: {houseId}</h4>
            <h4>equipment: {JSON.stringify(equipment)}</h4>
        </div>
    )
}
