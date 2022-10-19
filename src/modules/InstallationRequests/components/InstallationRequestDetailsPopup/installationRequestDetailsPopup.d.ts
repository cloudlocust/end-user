import { IInstallationRequest } from 'src/modules/InstallationRequests/installationRequests.d'

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
    installationRequestDetails: IInstallationRequest
    /**
     * Function that reloading installation requests.
     */
    onAfterCreateUpdateDeleteSuccess: () => void
}
