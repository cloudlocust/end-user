import EditIcon from '@mui/icons-material/Edit'
import { IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import { ReplaceNRLinkForm } from 'src/modules/MyHouse/components/ReplaceNRLinkFormPopup/ReplaceNRLinkForm'
import { IReplaceNRLinkModuleProps } from 'src/modules/MyHouse/components/ReplaceNRLinkFormPopup/replaceNrLinkFormPopup'

const ModalContent = styled(Box)({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
})

/**
 * Replace NRLink Module.
 *
 * @param root0 N/A.
 * @param root0.nrLinkConsent NRLink consent with all informations needed for BackEnd.
 * @param root0.onAfterReplaceNRLink Callback when nrLink is successfully replaced.
 * @returns NRLink Replace Component.
 */
export const ReplaceNRLinkModule = ({ nrLinkConsent, onAfterReplaceNRLink }: IReplaceNRLinkModuleProps) => {
    const [modalIsDisplayed, setModalDisplayState] = useState<boolean>(false)

    /**
     * No NRLink ? Don't show the Edit Icon.
     */

    if (!nrLinkConsent || !nrLinkConsent.nrlinkGuid || !nrLinkConsent?.meterGuid) {
        return null
    }

    return (
        <>
            <div className="flex flex-1 justify-end">
                <IconButton color="primary" size="large" onClick={() => setModalDisplayState(true)}>
                    <EditIcon />
                </IconButton>
            </div>
            <Modal
                aria-label="ReplaceNRLinkFormPopup"
                open={modalIsDisplayed}
                onClose={() => setModalDisplayState(false)}
            >
                <ModalContent>
                    <ReplaceNRLinkForm
                        meterGuid={nrLinkConsent.meterGuid}
                        oldNRLinkGuid={nrLinkConsent.nrlinkGuid}
                        closeModal={() => setModalDisplayState(false)}
                        onAfterReplaceNRLink={() => {
                            onAfterReplaceNRLink()
                            setModalDisplayState(false)
                        }}
                    />
                </ModalContent>
            </Modal>
        </>
    )
}
