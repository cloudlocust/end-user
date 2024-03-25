import { EquipmentDetailsContent } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentDetailsContent'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'

/**
 * Equipment details.
 *
 * @returns Equipment details component.
 */
export default function EquipmentDetails() {
    return <PageSimple content={<EquipmentDetailsContent />} />
}
