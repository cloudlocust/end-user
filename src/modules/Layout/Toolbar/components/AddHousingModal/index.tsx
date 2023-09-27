import { Modal, Box } from '@mui/material'
import { AddHousingModalProps } from 'src/modules/Layout/Toolbar/components/AddHousingModal/AddHousingModal'
import HousingForm from 'src/modules/MyHouse/components/HousingForm'
import { useHousingRedux } from 'src/modules/MyHouse/utils/MyHouseHooks'

/**
 * Modal to Add housing.
 *
 * @param root0 N/A.
 * @param root0.modalOpen Boolean to decide if the modal is open or closed.
 * @param root0.closeModal Callback to close Modal when we click on "Cancel".
 * @param root0.disableBackdropClick Boolean to prevent closing modal from backdrop.
 * @returns JSX.Element - Modal.
 */
function AddHousingModal({ modalOpen, closeModal, disableBackdropClick = false }: AddHousingModalProps) {
    const { loadHousingsAndScopes } = useHousingRedux()

    /**
     * Callback to handle when the user clicks on the backdrop of the modal.
     */
    const handleBackdropClick = () => {
        // Prevent closing the modal when disableBackdropClick is true
        if (!disableBackdropClick) {
            closeModal()
        }
    }

    return (
        <Modal open={modalOpen} BackdropProps={{ onClick: handleBackdropClick }}>
            <Box
                sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 300,
                }}
            >
                <HousingForm
                    onSuccess={() => {
                        closeModal()
                        loadHousingsAndScopes()
                    }}
                />
            </Box>
        </Modal>
    )
}

export default AddHousingModal
