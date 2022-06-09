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
export type nrlinkConsent = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'NONEXISTENT'

/**
 * Enedis consent type.
 */
export type enedisConsent = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'NONEXISTENT' | null

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
    meter_guid: string
    /**
     * Nrlink consent status.
     */
    nrlink_consent_state: nrlinkConsentStatus
    /**
     * Nrlink guid.
     */
    nrlink_guid?: string
}

/**
 * Enedis consent model.
 */
export interface IEnedisConsent {
    /**
     * Meter Guid.
     */
    meter_guid: string
    /**
     * Enedis consent status.
     */
    enedis_consent_state: enedisConsentStatus
    /**
     * Created At.
     */
    created_a?: string
}
