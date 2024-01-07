/**
 * Consumption label data type.
 */
export type ConsumptionLabelDataType =
    /**
     *
     */
    {
        /**
         * Id of the label.
         */
        id: number
        /**
         * Label name.
         */
        name: string
        /**
         * Start time.
         */
        startTime: string
        /**
         * End time.
         */
        endTime: string
        /**
         * Consumption value.
         */
        consumption: number
        /**
         * Price value.
         */
        price: number
        /**
         * Date of the label.
         */
        date: string
    }
