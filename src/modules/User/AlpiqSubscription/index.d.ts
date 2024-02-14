/**
 * Enum for Energy Provider Subscription connection steps.
 */
export enum AlpiqSubscriptionStepsEnum {
    /**
     * 1st step.
     */
    firstStep = 0,
    /**
     * 2nd step.
     */
    secondStep = 1,
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
