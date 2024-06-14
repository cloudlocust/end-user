import { defaultValueType } from 'src/common/ui-kit/form-fields/GoogleMapsAddressAutoComplete/utils'
import { IMeter } from 'src/modules/Meters/Meters'
import { ScopesTypesEnum } from 'src/modules/MyHouse/utils/MyHouseCommonTypes'
import { ISolarSizing } from 'src/modules/SolarSizing/solarSizeing.types'
import { IAlpiqSubscriptionSpecs } from 'src/modules/User/AlpiqSubscription'

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
         * The meter of the housing.
         */
        meter: IMeter | null
        /**
         * The address related to the PDL's GUID.
         */
        address: defaultValueType
    }

/**
 * Housing state.
 */
export interface IHousingState {
    /**
     * Current Housing selected.
     */
    currentHousing: IHousing | null
    /**
     * List of available housings.
     */
    housingList: IHousing[]
    /**
     * Current Housing Scope.
     */
    currentHousingScopes: ScopesTypesEnum[]
    /**
     * Alpiq contract subscription specs.
     */
    alpiqSubscriptionSpecs: IAlpiqSubscriptionSpecs | null
    /**
     * Solar sizing.
     */
    solarSizing: ISolarSizing | null
}
