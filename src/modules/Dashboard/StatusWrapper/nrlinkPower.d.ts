/**
 * Represents the data structure for NrlinkData.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
type NrlinkMetric = {
    /**
     * Represents the value.
     */
    value: number | null
    /**
     *
     */
    timestamp: string | null
}

/**
 * Represents the interface for NrlinkPowerData.
 */
export interface INrlinkMetrics {
    /**
     * Represents the last power value.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    lastPower: NrlinkMetric
    /**
     * Represents the last temperature value.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    lastTemperature: NrlinkMetric
}
