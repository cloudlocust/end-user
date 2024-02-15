/**
 * Enum for Energy Provider Subscription connection steps.
 */
export enum AlpiqSubscriptionStepsEnum {
    /**
     * 1st step, Renseigner mon compteur linky.
     */
    firstStep = 0,
    /**
     * 2nd step, Donner mon consentement SGE.
     */
    secondStep = 1,
    /**
     * 3rd step, Get estimation for contract.
     */
    thridStep = 2,
}

/**
 * Response for Alpiq Meter Eligibility.
 */
export interface IAlpiqMeterEligibiltyResponse {
    /**
     * Is meter eligible for alpiq provider.
     */
    isMeterEligible: boolean
}

/**
 * Response for alpiq monthly subscription estimation response.
 */
export interface IApliqMonthlySubscriptionEstimationResponse {
    /**
     * Monthly subscription estimation.
     */
    monthlySubscriptionEstimation: number
}
