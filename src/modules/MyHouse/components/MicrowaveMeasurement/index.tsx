import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import IconButton from '@mui/material/IconButton'
import { MicrowaveMeasurementProps } from 'src/modules/MyHouse/components/MicrowaveMeasurement/MicrowaveMeasurement.d'
import CloseIcon from '@mui/icons-material/Close'

/**
 * MicrowaveMeasurement component.
 *
 * @param root0 N/A.
 * @param root0.modalIsOpen The state of the modal.
 * @param root0.closeModal Modal closing handler.
 * @returns MicrowaveMeasurement component.
 */
const index = ({ modalIsOpen, closeModal }: MicrowaveMeasurementProps) => {
    return (
        <Modal
            open={modalIsOpen}
            onClose={closeModal}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Box
                width="100%"
                maxWidth="600px"
                margin="10px"
                padding="30px 20px"
                borderRadius="20px"
                position="relative"
                bgcolor="white"
            >
                {/* The closing button */}
                <IconButton
                    aria-label="close"
                    onClick={closeModal}
                    sx={{
                        position: 'absolute',
                        right: 6,
                        top: 6,
                        /**
                         * Access predefined palette color.
                         *
                         * @param theme The MUI theme object.
                         * @returns A grey color.
                         */
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {/* The content of the modal */}
            </Box>
        </Modal>
    )
}

export default index
