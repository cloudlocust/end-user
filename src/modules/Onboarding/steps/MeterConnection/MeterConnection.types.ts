import { IMeter } from 'src/modules/Meters/Meters'
import { IEnedisSgeConsent } from 'src/modules/Consents/Consents.d'

/**
 * MeterConnection Step Props.
 *
 */
export type MeterConnectionProps =
    /**
     * MeterConnection Props.
     */
    {
        /**
         * Callback on next step.
         */
        onNext: () => void
        /**
         * Housing Id.
         */
        housingId: number
        /**
         * The meter of current housing.
         */
        meter: IMeter
        /**
         * Enedis SGE Consent of current housing.
         */
        enedisSgeConsent?: IEnedisSgeConsent
        /**
         * Function to load housings and their scopes.
         */
        loadHousingsAndScopes: () => Promise<void>
    }
/**
 * The data submit by the form.
 */
export type MeterFormSubmitParams =
    /**
     * MeterFormSubmitParams.
     */
    {
        /**
         * The meter serial number.
         */
        guid: string
    }
