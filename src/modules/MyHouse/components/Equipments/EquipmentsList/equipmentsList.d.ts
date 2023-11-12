import {
    equipmentAllowedTypeT,
    postEquipmentInputType,
} from 'src/modules/MyHouse/components/Installation/InstallationType'

/**
 * Housing equipment list type.
 */
type HousingEquipmentListType =
    /**
     *
     */
    {
        // eslint-disable-next-line jsdoc/require-jsdoc
        id: number
        // eslint-disable-next-line jsdoc/require-jsdoc
        housingEquipmentId: number | undefined
        // eslint-disable-next-line jsdoc/require-jsdoc
        name: string
        // eslint-disable-next-line jsdoc/require-jsdoc
        allowedType: equipmentAllowedTypeT[]
        // eslint-disable-next-line jsdoc/require-jsdoc
        number: number | undefined
        // eslint-disable-next-line jsdoc/require-jsdoc
        isNumber: boolean
        // eslint-disable-next-line jsdoc/require-jsdoc
        measurementModes: string[] | undefined
        // eslint-disable-next-line jsdoc/require-jsdoc
        customerId: number | null | undefined
    }[]

/**
 * EquipmentsList Props.
 */
export interface EquipmentsListProps {
    // eslint-disable-next-line jsdoc/require-jsdoc
    housingEquipmentsList?: HousingEquipmentListType
    // eslint-disable-next-line jsdoc/require-jsdoc
    loadingEquipmentInProgress: boolean
    // eslint-disable-next-line jsdoc/require-jsdoc
    addHousingEquipment: (body: postEquipmentInputType) => Promise<postEquipmentInputType | undefined>
}
