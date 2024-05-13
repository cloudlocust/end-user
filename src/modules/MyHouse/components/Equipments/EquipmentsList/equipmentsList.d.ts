import { IconComponentType } from 'src/modules/MyHouse/components/Equipments/EquipmentCard/equipmentsCard'
import {
    equipmentAllowedTypeT,
    postEquipmentInputType,
} from 'src/modules/MyHouse/components/Installation/InstallationType'

/**
 * Housing equipment list type.
 */
export type HousingEquipmentType =
    /**
     *
     */
    {
        // eslint-disable-next-line jsdoc/require-jsdoc
        id: number
        // eslint-disable-next-line jsdoc/require-jsdoc
        housingEquipmentId?: number
        // eslint-disable-next-line jsdoc/require-jsdoc
        name: string
        // eslint-disable-next-line jsdoc/require-jsdoc
        equipmentLabel?: string
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent?: IconComponentType
        // eslint-disable-next-line jsdoc/require-jsdoc
        allowedType: equipmentAllowedTypeT[]
        // eslint-disable-next-line jsdoc/require-jsdoc
        number?: number
        // eslint-disable-next-line jsdoc/require-jsdoc
        isNumber: boolean
        // eslint-disable-next-line jsdoc/require-jsdoc
        measurementModes?: string[] | null
        // eslint-disable-next-line jsdoc/require-jsdoc
        customerId?: number | null
        // eslint-disable-next-line jsdoc/require-jsdoc
        equipmentBrand?: string | null
        // eslint-disable-next-line jsdoc/require-jsdoc
        equipmentModel?: string | null
        // eslint-disable-next-line jsdoc/require-jsdoc
        yearOfPurchase?: number | null
        // eslint-disable-next-line jsdoc/require-jsdoc
        equipmentLabel?: string | null
        // eslint-disable-next-line jsdoc/require-jsdoc
        equipmentTitle?: string | null
        // eslint-disable-next-line jsdoc/require-jsdoc
        equipmentId?: number
    }

/**
 * Housing equipment list type.
 */
export type HousingEquipmentListType = HousingEquipmentType[]

/**
 * EquipmentsList Props.
 */
export interface EquipmentsListProps {
    /**
     * Equipments list containing all the equipments.
     */
    housingEquipmentsList?: HousingEquipmentListType
    /**
     * List of equipments ids with adding in progress.
     */
    addingInProgressEquipmentsIds: number[]
    /**
     * Saving the equipment.
     */
    addHousingEquipment: (body: postEquipmentInputType) => Promise<postEquipmentInputType | undefined>
}
