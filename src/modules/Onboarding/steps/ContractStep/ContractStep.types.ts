/**
 * Contract Step Props.
 *
 */
export type ContractStepProps =
    /**
     * Contract Props.
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
