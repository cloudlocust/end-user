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
        /**
         * Does the user charge their electric car at home.
         */
        isChargesAtHome?: boolean
        /**
         * Method of charging the electric car.
         */
        chargingMethod?: 'chargingStation' | 'socket'
        /**
         * Power of the Equipment.
         */
        power?: number
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
