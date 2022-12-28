/**
 * ConsumptionErrorMessage component props.
 */
export interface ChartErrorMessageProps {
    /**
     * If nrLINK and Enedis are off.
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
