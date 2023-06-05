/**
 * Props for IReplaceNRLinkFormProps.
 */
export interface IReplaceNRLinkFormProps {
    /**
     * Id of the Meter used to make a new consent on a nrLINK.
     */
    meterGuid: string

    /**
     * Id of the current nrLINK used in house.
     */
    oldNRLinkGuid: string

    /**
     * Callback when nrLink is successfully replaced.
     */
    onAfterReplaceNRLink: () => void

    /**
     * Callback to close Modal when we click on "Cancel".
     */
    closeModal: () => void
}

/**
 * Props for <ReplaceNRLinkModule>.
 */
export interface IReplaceNRLinkModuleProps {
    /**
     * NRLink consent with all informations needed for BackEnd.
     */
    nrLinkConsent: INrlinkConsent | undefined
    /**
     * Callback when nrLink is successfully replaced.
     */
    onAfterReplaceNRLink: () => void
}

/**
 * AxiosPayload to send to ask a replacement of a nrLINK.
 */
export interface IReplaceNRLinkPayload {
    /**
     * Id of the current nrLINK used in house.
     */
    old_nrlink_guid: string

    /**
     * Id of the new nrLINK to use instead of nrLINK currently used in House.
     */
    new_nrlink_guid: string

    /**
     * Id of the Meter used to make a new consent on a nrLINK.
     */
    meter_guid: string

    /**
     * Partial, if present we should revoke old consent of old nrLINK and clear all data related to this nrLINK.
     */
    clear_data?: boolean
}
