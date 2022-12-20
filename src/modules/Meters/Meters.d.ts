/**
 * Meter model.
 */
export interface IMeter {
    /**
     * Id of Meter.
     */
    id: number
    /**
     * GUID of Meter.
     */
    guid: string
    /**
     * Meter features information.
     */
    features?: IMeterFeatures
}

/**
 * Features information (offpeakHours ...etc).
 */
//eslint-disable-next-line jsdoc/require-jsdoc
export type IMeterFeatures = {
    /**
     * Offpeak information.
     */
    //eslint-disable-next-line jsdoc/require-jsdoc
    offpeak: {
        /**
         * Boolean readOnly, if true offpeakHours can not be changed else offpeakHours can be edited.
         */
        readOnly: boolean
        /**
         * Meter offpeak hours.
         */
        offpeakHours: IOffPeakHoursIntevals
    }
}

/**
 * Meter features OffpeakHours Intervals.
 */
//eslint-disable-next-line jsdoc/require-jsdoc
export type IOffPeakHoursIntevals = IOffPeakHour[]

/**
 * OffpeakHour format type.
 */
//eslint-disable-next-line jsdoc/require-jsdoc
export type IOffPeakHour = {
    /**
     * Start hour.
     */
    start: string
    /**
     * End hour.
     */
    end: string
}

/**
 * Information to be passed when adding a meter.
 */
//eslint-disable-next-line jsdoc/require-jsdoc
export type addMeterInputType = {
    //eslint-disable-next-line jsdoc/require-jsdoc
    guid: string
}

/**
 * Information to be passed when editing a meter.
 */
export type editMeterInputType = Partial<Omit<IMeter, 'id'>>
