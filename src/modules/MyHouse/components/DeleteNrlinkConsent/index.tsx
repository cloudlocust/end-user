import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { DeleteNrlinkConsentProps } from 'src/modules/MyHouse/components/DeleteNrlinkConsent/DeleteNrlinkConsent'
import { useDeleteNRLinkConsentHook } from 'src/modules/MyHouse/components/DeleteNrlinkConsent/deleteNrlinkConsentHook'
import { useModal } from 'src/hooks/useModal'
import { useIntl } from 'src/common/react-platform-translation'
import { ButtonLoader } from 'src/common/ui-kit'

/**
 * Delete NRLink Consent Module.
 *
 * @param root0 N/A.
 * @param root0.onAfterDeleteNrlinkConsent Callback when nrLink consent is successfully deleted.
 * @returns NRLink Delete Consent Component.
 */
export const DeleteNrlinkConsent = ({ onAfterDeleteNrlinkConsent }: DeleteNrlinkConsentProps) => {
    const { formatMessage } = useIntl()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { loadingInProgress, deleteNRLinkConsent } = useDeleteNRLinkConsentHook(currentHousing?.id)
    const { isOpen, openModal: openDialog, closeModal: closeDialog } = useModal()

    /**
     * Function for deleting NRLink consent.
     */
    const handleDeleteNRLinkConsent = async () => {
        try {
            await deleteNRLinkConsent()
            onAfterDeleteNrlinkConsent()
        } catch {}
        closeDialog()
    }

    return (
        <>
            <IconButton color="error" size="small" onClick={openDialog}>
                <DeleteOutlinedIcon />
            </IconButton>
            <Dialog
                open={isOpen}
                onClose={closeDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {formatMessage({
                        id: 'Révocation du consentement nrLINK',
                        defaultMessage: 'Révocation du consentement nrLINK',
                    })}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {formatMessage({
                            id: 'Êtes-vous sûr de vouloir révoquer votre consentement nrLINK ?',
                            defaultMessage: 'Êtes-vous sûr de vouloir révoquer votre consentement nrLINK ?',
                        })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Non</Button>
                    <ButtonLoader onClick={handleDeleteNRLinkConsent} inProgress={loadingInProgress} autoFocus>
                        Oui
                    </ButtonLoader>
                </DialogActions>
            </Dialog>
        </>
    )
}
