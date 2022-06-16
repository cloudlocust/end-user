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
