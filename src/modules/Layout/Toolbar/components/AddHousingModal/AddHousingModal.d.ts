/**
 * Props for AddHousingModal.
 */
export interface AddHousingModalProps {
    /**
     * Boolean to decide if the modal is open or closed..
     */
    modalOpen: boolean
    /**
     * Callback to close the Modal.
     */
    closeModal: () => void
    /**
     * Boolean to prevent closing modal from backdrop.
     */
    disableBackdropClick?: boolean
}
