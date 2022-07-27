import { defaultValueType } from 'src/common/ui-kit/form-fields/GoogleMapsAddressAutoComplete/utils'

/**
 * The Type of a logement.
 */
export type IHousing =
    /**
     * Logement Type.
     */
    {
        /**
         * The Id of the Logement.
         */
        id: number
        /**
         * The Guid of the PDL.
         */
        guid: string | null
        /**
         * The address related to the PDL's GUID.
         */
        address: defaultValueType
    }
