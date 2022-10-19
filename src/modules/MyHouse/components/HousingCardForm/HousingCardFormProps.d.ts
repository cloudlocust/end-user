import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing.d'

/**
 * HousingCardForm Props.
 */
export type HousingCardFormProps =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Housing information object.
         */
        housing: IHousing
        /**
         * Callback after delete or update success housing.
         */
        onAfterDeleteUpdateSuccess?: () => void
    }

/**
 * Housing Card Form Values type.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type housingCardFormValuesType = {
    /**
     * Addrcontractess of the housing with additionalAddress.
     */
    address: IHousing['address']
}
