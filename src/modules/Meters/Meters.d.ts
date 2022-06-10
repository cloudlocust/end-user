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

/**
 * Nrlink consent type.
 */
export type nrlinkConsentType = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'NONEXISTENT'

/**
 * Enedis consent type.
 */
export type enedisConsentType = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'NONEXISTENT' | null

/**
 * Nrlink Consent Status.
 */
export type nrlinkConsentStatus = 'NONEXISTENT' | 'CONNECTED' | 'DISCONNECTED' | 'EXPIRED'

/**
 * Enedis Consent Status.
 */
export type enedisConsentStatus = 'NONEXISTENT' | 'CONNECTED' | 'EXPIRED'

/**
 * Nrlink consent model.
 */
export interface INrlinkConsent {
    /**
     * Meter Guid.
     */
    meterGuid: string
    /**
     * Nrlink consent status.
     */
    nrlinkConsentState: nrlinkConsentStatus
    /**
     * Nrlink guid.
     */
    nrlinkGuid?: string
}

/**
 * Enedis consent model.
 */
export interface IEnedisConsent {
    /**
     * Meter Guid.
     */
    meterGuid: string
    /**
     * Enedis consent status.
     */
    enedisConsentState: enedisConsentStatus
    /**
     * Created At.
     */
    createdAt?: string
}

/**
 * Consents type.
 */
//eslint-disable-next-line jsdoc/require-jsdoc
export type consentsType = {
    //eslint-disable-next-line jsdoc/require-jsdoc
    nrlinkConsent: INrlinkConsent
    //eslint-disable-next-line jsdoc/require-jsdoc
    enedisConsent: IEnedisConsent
}
