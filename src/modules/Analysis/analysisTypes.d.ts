/**
 * Return Type of computation Functions (mean, min, max).
 */
export type computationFunctionType =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Computed value.
         */
        value: number
        /**
         * Unit of computed value.
         */
        unit: totalConsumptionUnits
        /**
         * Timestamp of computed value.
         */
        timestamp?: number
    }
