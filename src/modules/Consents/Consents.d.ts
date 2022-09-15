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
    /**
     * When the nrlink consent was created.
     */
    createdAt?: string
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
     * When the enedis consent was created.
     */
    createdAt?: string
}

/**
 * Enum representing different verification state for the meter.
 */
export enum MeterVerificationEnum {
    /**
     *
     */
    NOT_YET_VERIFIED = 'NOT_YET_VERIFIED',
    /**
     *
     */
    VERIFIED = 'VERIFIED',
    /**
     *
     */
    NOT_VERIFIED = 'NOT_VERIFIED',
}
