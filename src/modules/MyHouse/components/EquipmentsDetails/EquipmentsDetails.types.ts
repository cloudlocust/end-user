import { IEquipmentMeter, postEquipmentInputType } from 'src/modules/MyHouse/components/Installation/InstallationType'

/**
 * Interface for EquipmentDetails Form Submit.
 */
export type EquipmentDetailsFormSubmitType =
    /**
     *
     */
    {
        /**
         * Equipment brand.
         */
        equipmentBrand?: string | null
        /**
         * Equipment model.
         */
        equipmentModel?: string | null
        /**
         * Year of purchase.
         */
        yearOfPurchase?: Date | null
    }

/**
 * Equipment details props.
 */
export type EquipmentDetailsFormProps =
    /**
     *
     */
    {
        /**
         * Housing equipments details array.
         */
        housingEquipmentsDetails: IEquipmentMeter[]
        /**
         * Add housing equipment callback.
         */
        addHousingEquipment: (body: postEquipmentInputType) => Promise<postEquipmentInputType | undefined>
    }
