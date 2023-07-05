/**
 * Connected Plug Consent State Type.
 */
export type connectedPlugConsentStateType = 'APPROVED' | 'DENIED'

/**
 * Enum representing the connected plug consent state.
 */
export enum connectedPlugConsentStateEnum {
    /**
     * Enum value for APPROVED consent.
     */
    APPROVED = 'consumption_metrics',
    /**
     * Enum value for DENIED consent.
     */
    DENIED = 'DENIED',
}

/**
 * Connected Plug Consent model.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type IConnectedPlug = {
    /**
     * Connected Plug Id.
     */
    deviceId: string
    /**
     * Connected Plug Consent.
     */
    consentState: connectedPlugConsentStateEnum
    /**
     * Created At.
     */
    createdAt: string
}
