import { INrlinkConsent } from 'src/modules/Consents/Consents.d'

/**
 * NRLinkConnection Step Props.
 *
 */
export type NRLinkConnectionStepProps =
    /**
     * NRLinkConnection Props.
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
         * NrLink Consent.
         */
        nrlinkConsent?: INrlinkConsent
    }

/**
 * The data submit by the form.
 */
export type NRLinkFormSubmitParams =
    /**
     * NRLinkFormSubmitParams.
     */
    {
        /**
         * The variant par of guid of the nrlink.
         */
        guidVariantPart: string
    }
