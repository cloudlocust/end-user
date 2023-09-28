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
     * Callback when nrLink consent is successfully revoked.
     */
    onAfterRevokeNRLink: () => void
}
