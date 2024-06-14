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
     * If production consent is off.
     */
    productionConsentOff?: boolean
    /**
     */
    productionConsentOffMessage?: string
    /**
     * Link to redirect.
     */
    linkTo?: string
    /**
     * Style of the component.
     */
    style?: React.CSSProperties
}
