import { IInstallationRequest } from 'src/modules/InstallatinRequests/installationRequests.d'

/**
 * Inteface for installation request details popup.
 */
export interface InstallationRequestDetailsPopupProps {
    /**
     * Open state of the popup.
     */
    open: boolean
    /**
     * Function that closes the popup.
     */
    handleClosePopup: () => void
    /**
     * Full details of one installation request.
     */
    installationRequestDetails: IInstallationRequest | null
}
