/**
 * Nrlink Consent Status.
 */
export type nrlinkConsentStatus = 'NONEXISTENT' | 'CONNECTED' | 'DISCONNECTED' | 'EXPIRED'

/**
 * Enedis Sge Consent Status.
 */
export type enedisSgeConsentStatus = 'NONEXISTENT' | 'CONNECTED' | 'EXPIRED' | 'REVOKED' | 'UNSYNCHRONIZED'

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
 * Enedis extra data.
 */
interface enedisExtraData {
    /**
     * Max Power kva.
     */
    maxPower: /**
     */ {
        /**
         * Unit KVA.
         */
        unit: string
        /**
         * Value of max power in meter.
         */
        value: number
    }
    /**
     * Contract type, Base, ...etc.
     */
    contractType: string
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
    /**
     * Extra Data.
     */
    extraData?: enedisExtraData
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
