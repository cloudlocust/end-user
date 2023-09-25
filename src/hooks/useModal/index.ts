import { useState } from 'react'
import { ModalState } from 'src/hooks/useModal/useModal.d'

/**
 * Hook to manage modal state.
 *
 * @example
 *  // Using it with MUI Modal Component
 *
 *  const { isOpen, openModal, closeModal } = useModal()
 *
 *  return(
 *      <div>
 *          <Button onClick={openModal}>
 *              Show modal
 *          </Button>
 *          <Modal open={isOpen} onClose={closeModal}>
 *              modal content
 *          </Modal>
 *      </div>
 *  )
 * @returns Modal state.
 */
export const useModal: () => ModalState = () => {
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
