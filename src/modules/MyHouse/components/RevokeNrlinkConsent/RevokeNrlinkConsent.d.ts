import { INrlinkConsent } from 'src/modules/Consents/Consents.d'

/**
 * Props for RevokeNrlinkConsent Component.
 */
export interface RevokeNrlinkConsentProps {
    /**
     * NRLink consent with all informations needed for BackEnd.
     */
    nrLinkConsent: INrlinkConsent | undefined
    /**
     * Revoke nrLink consent function handler.
     */
    revokeNrlinkConsent: (houseId?: number, nrlinkGuid?: string) => void
}
