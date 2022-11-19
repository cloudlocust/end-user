/**
 * Inteface for installation request create popup props.
 */
export interface EquipmentRequestCreatePopupProps {
    /**
     * Open state of the popup.
     */
    open: boolean
    /**
     * Function that closes the popup.
     */
    handleClosePopup: () => void
    /**
     * Function that reloading installation requests.
     */
    onAfterCreateUpdateDeleteSuccess: () => void
}
