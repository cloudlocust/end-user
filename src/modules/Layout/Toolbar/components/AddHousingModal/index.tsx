import { Modal, Box } from '@mui/material'
import { Dispatch } from 'src/redux'
import { useDispatch } from 'react-redux'
import { AddHousingModalProps } from 'src/modules/Layout/Toolbar/components/AddHousingModal/AddHousingModal'
import HousingForm from 'src/modules/MyHouse/components/HousingForm'

/**
 * Modal to Add housing.
 *
 * @param root0 N/A.
 * @param root0.modalOpen Boolean to decide if the modal is open or closed.
 * @param root0.closeModal Callback to close Modal when we click on "Cancel".
 * @returns JSX.Element - Modal.
 */
function AddHousingModal({ modalOpen, closeModal }: AddHousingModalProps) {
    const dispatch = useDispatch<Dispatch>()

    return (
        <Modal open={modalOpen} onClose={closeModal}>
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
                        dispatch.housingModel.loadHousingsList()
                    }}
                />
            </Box>
        </Modal>
    )
}

export default AddHousingModal
