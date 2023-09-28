import { IEquipmentMeter } from 'src/modules/MyHouse/components/Installation/InstallationType'

/**
 * EquipmentsList Props.
 */
export interface EquipmentsListProps {
    // eslint-disable-next-line jsdoc/require-jsdoc
    equipmentsList: IEquipmentMeter[] | null
    // eslint-disable-next-line jsdoc/require-jsdoc
    loadingEquipmentInProgress: boolean
}
