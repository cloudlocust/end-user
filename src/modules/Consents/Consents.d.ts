/**
 * Nrlink Consent Status.
 */
export type nrlinkConsentStatus = 'NONEXISTENT' | 'CONNECTED' | 'DISCONNECTED' | 'EXPIRED'

/**
 * Enedis Consent Status.
 */
export type enedisConsentStatus = 'NONEXISTENT' | 'CONNECTED' | 'EXPIRED'

/**
 * Enedis Sge Consent Status.
 */
export type enedisSgeConsentStatus = 'NONEXISTENT' | 'CONNECTED' | 'EXPIRED' | 'REVOKED'

/**
 * Enphhase consent status.
 */
export type enphaseConsentStatus = 'NONEXISTENT' | 'ACTIVE' | 'PENDING' | 'EXPIRED'

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
    VERIFIED = 'VERIFIED',
    /**
     *
     */
    NOT_VERIFIED = 'NOT_VERIFIED',
}

/**
 * Inerface for Enedis Sge consent.
 */
export interface IEnedisSgeConsent {
    /**
     * Enedis Sge consent state.
     */
    enedisSgeConsentState: enedisSgeConsentStatus
    /**
     * Meter guid.
     */
    meterGuid: string
    /**
     * Created at date.
     */
    createdAt?: string
    /**
     * Revoked at date.
     */
    revokedAt?: string
    /**
     * Expired at date.
     */
    expiredAt: string
}

/**
 * Interface for Enphase consent.
 */
export interface IEnphaseConsent {
    /**
     * Meter guid.
     */
    meterGuid: string
    /**
     * Enphhase consent status.
     */
    enphaseConsentState: enphaseConsentStatus
    /**
     * When the enedis consent was created.
     */
    createdAt?: string
}

/**
 * Enphase link type.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type EnphaseLink = {
    /**
     * Enphase url.
     */
    url: string
}
