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
    APPROVED = 'APPROVED',
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

/**
 * Format of Connected Plug from Api.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type IConnectedPlugApiResponse = {
    /**
     * Meter Guid.
     */
    meterGuid: string
    /**
     * Connected Plugs.
     */
    devices: IConnectedPlug[]
}

/**
 * Format of Connected Connected Plugs Header Props.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type ConnectedPlugsHeaderPropsType = {
    /**
     * Callback when clicking the add button.
     */
    onAddClick: () => void
    /**
     * Loading of connected plugs list.
     */
    isConnectedPlugListLoading?: boolean
}

/**
 * Format of Connected Plug from Api.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type IShellyConnectedPlugLink = {
    /**
     * Shelly Url.
     */
    url: string
}

/**
 * Connected Plug Associate Body Type.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type connectedPlugAssociateBodyType = {
    /**
     * Housing Id.
     */
    housingId: number
    /**
     * Connected Plug Id.
     */
    deviceId
    /**
     * Mode of the connected plug.
     */
    state: 'production' | null
}
