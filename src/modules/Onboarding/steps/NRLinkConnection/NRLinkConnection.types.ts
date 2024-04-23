/**
 * NRLinkConnection Step Props.
 *
 */
export type NRLinkConnectionProps =
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
