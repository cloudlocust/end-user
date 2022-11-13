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
export type editMeterInputType = addMeterInputType
