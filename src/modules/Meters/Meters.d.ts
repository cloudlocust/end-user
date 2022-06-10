/**
 * Meter model.
 */
export interface IMeter {
    /**
     * Id of Meter.
     */
    id: number
    /**
     * Name of Meter.
     */
    name: string
    /**
     * GUID of Meter.
     */
    guid: string
}

/**
 * Information to be passed when adding a meter.
 */
//eslint-disable-next-line jsdoc/require-jsdoc
export type addMeterInputType = {
    //eslint-disable-next-line jsdoc/require-jsdoc
    name: string

    //eslint-disable-next-line jsdoc/require-jsdoc
    guid: string
}
