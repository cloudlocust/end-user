import { useState } from 'react'
import { ModalState } from 'src/hooks/useModal/useModal.d'

/**
 * Hook to manage modal state.
 *
 * @returns Modal state.
 */
const useModal: () => ModalState = () => {
    const [isOpen, setIsOpen] = useState(false)

    /**
     * Opening the modal.
     */
    const openModal = () => {
        setIsOpen(true)
    }

    /**
     * Closing the modal.
     */
    const closeModal = () => {
        setIsOpen(false)
    }

    return {
        isOpen,
        openModal,
        closeModal,
    }
}

export default useModal
