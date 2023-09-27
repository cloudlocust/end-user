/**
 * Types of the returned values of the useModal hook.
 */
export interface ModalState {
    /**
     * The state of the modal.
     */
    isOpen: boolean
    /**
     * Modal opening handler.
     */
    openModal: () => void
    /**
     * Modal closing handler.
     */
    closeModal: () => void
}
