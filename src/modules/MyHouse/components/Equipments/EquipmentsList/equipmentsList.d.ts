import { IEquipmentMeter, postEquipmentInputType } from 'src/modules/MyHouse/components/Installation/InstallationType'

/**
 * EquipmentsList Props.
 */
export interface EquipmentsListProps {
    // eslint-disable-next-line jsdoc/require-jsdoc
    housingEquipmentsList: IEquipmentMeter[] | null
    // eslint-disable-next-line jsdoc/require-jsdoc
    loadingEquipmentInProgress: boolean
    // eslint-disable-next-line jsdoc/require-jsdoc
    saveEquipment: (body: postEquipmentInputType) => Promise<postEquipmentInputType | undefined>
}
