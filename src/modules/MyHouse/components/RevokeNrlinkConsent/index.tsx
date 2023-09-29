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
import { useModal } from 'src/hooks/useModal'
import { useIntl } from 'src/common/react-platform-translation'
import { ButtonLoader } from 'src/common/ui-kit'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { RevokeNrlinkConsentProps } from 'src/modules/MyHouse/components/RevokeNrlinkConsent/RevokeNrlinkConsent'
import Paper from '@mui/material/Paper'

/**
 * Revoke NRLink Consent Module.
 *
 * @param root0 N/A.
 * @param root0.nrLinkConsent NRLink consent with all informations needed for BackEnd.
 * @param root0.onAfterRevokeNRLink Callback when nrLink consent is successfully revoked.
 * @returns NRLink Revoke Consent Component.
 */
export const RevokeNrlinkConsent = ({ nrLinkConsent, onAfterRevokeNRLink }: RevokeNrlinkConsentProps) => {
    const { formatMessage } = useIntl()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { revokeNrlinkConsent, isNrlinkConsentLoading } = useConsents()
    const { isOpen, openModal: openDialog, closeModal: closeDialog } = useModal()

    /**
     * Function for revoking NRLink consent.
     */
    const handleRevokeNRLinkConsent = async () => {
        try {
            await revokeNrlinkConsent(currentHousing?.id, nrLinkConsent?.nrlinkGuid)
            onAfterRevokeNRLink()
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
                <Paper sx={{ backgroundColor: 'red' }}>
                    <DialogTitle id="alert-dialog-title" className="text-white text-center">
                        {formatMessage({
                            id: 'Révocation du consentement nrLINK !',
                            defaultMessage: 'Révocation du consentement nrLINK !',
                        })}
                    </DialogTitle>
                    <DialogContent sx={{ paddingY: 0, marginTop: '20px', marginBottom: '10px' }}>
                        <DialogContentText
                            id="alert-dialog-description"
                            className="text-white text-center text-sm font-medium"
                        >
                            {formatMessage({
                                id: 'Vous êtes sur le point de révoquer votre consentement nrLINK. Êtes-vous sûr de vouloir continuer ?',
                                defaultMessage:
                                    'Vous êtes sur le point de révoquer votre consentement nrLINK. Êtes-vous sûr de vouloir continuer ?',
                            })}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions className="flex items-center justify-center">
                        <Button
                            variant="outlined"
                            className="text-white m-12 border-white"
                            onClick={closeDialog}
                            autoFocus
                        >
                            {formatMessage({
                                id: 'Annuler',
                                defaultMessage: 'Annuler',
                            })}
                        </Button>
                        <ButtonLoader
                            variant="outlined"
                            className="text-white m-12 border-white"
                            onClick={handleRevokeNRLinkConsent}
                            inProgress={isNrlinkConsentLoading}
                        >
                            {formatMessage({
                                id: 'Continuer',
                                defaultMessage: 'Continuer',
                            })}
                        </ButtonLoader>
                    </DialogActions>
                </Paper>
            </Dialog>
        </>
    )
}
