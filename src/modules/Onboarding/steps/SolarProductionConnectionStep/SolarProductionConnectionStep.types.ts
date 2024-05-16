/**
 * SolarProductionConnection Step Props.
 *
 */
export type SolarProductionConnectionStepProps =
    /**
     * SolarProductionConnection Props.
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
         * Boolean indicate be true when we send request to hide the onboarding.
         */
        isHideOnboardingInProgress: boolean
    }
