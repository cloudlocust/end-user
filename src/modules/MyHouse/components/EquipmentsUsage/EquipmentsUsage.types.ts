import { IEquipmentMeter, postEquipmentInputType } from 'src/modules/MyHouse/components/Installation/InstallationType'

/**
 * Interface for EquipmentDetails Form Submit.
 */
export type EquipmentsUsageFormSubmitType =
    /**
     *
     */
    {
        /**
         * Equipment brand.
         */
        equipmentLabel?: string | null
        /**
         * Equipment model.
         */
        frequencyOfUsagePerWeek?: string | number | null
        /**
         * Year of purchase.
         */
        averageUsagePerMinute?: string | number | null
        /**
         * Usage of the equipnent.
         */
        usage?: string[] | null
    }

/**
 * Equipments Usage form props.
 */
export type EquipmentsUsageFormProps =
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
        /**
         * Title of the equipment.
         */
        title: string
    }

/**
 * Usage options.
 */
export type usageOptions = 'specific' | 'all_year'
