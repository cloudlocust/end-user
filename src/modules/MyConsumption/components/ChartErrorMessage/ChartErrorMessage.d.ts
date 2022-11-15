/**
 * ConsumptionErrorMessage component props.
 */
export interface ChartErrorMessageProps {
    /**
     * If nrLink and Enedis are off.
     */
    nrLinkEnedisOff?: boolean
    /**
     *
     */
    nrlinkEnedisOffMessage?: string
    /**
     * If enphase is off.
     */
    enphaseOff?: boolean
    /**
     */
    enphaseOffMessage?: string
    /**
     * Link to redirect.
     */
    linkTo?: string
}
