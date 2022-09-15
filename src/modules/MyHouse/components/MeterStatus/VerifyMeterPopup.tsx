import { Dialog, DialogContent, LinearProgress } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * Verify meter popup.
 *
 * @param root0 N/A.
 * @param root0.openVerifyMeterPopup State for openVerifyMeterPopup.
 * @param root0.setOpenVerifyMeterPopup Setter for openVerifyMeterPopup state.
 * @returns JSX for verify meter popup.
 */
export const VerifyMeterPopup = ({
    openVerifyMeterPopup,
    setOpenVerifyMeterPopup,
}: /**
 * VerifyMeterPopup props types.
 */
{
    /**
     * State for openVerifyMeterPopup.
     */
    openVerifyMeterPopup: boolean
    /**
     * Setter for openVerifyMeterPopup state.
     */
    setOpenVerifyMeterPopup: (openVerifyMeterPopup: boolean) => void
}): JSX.Element => {
    return (
        <Dialog
            onClose={(event, reason) => {
                // Not allow the user to close the popup when the meter is being checked. (TOBE confirmed with PO)
                if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                    setOpenVerifyMeterPopup(false)
                }
            }}
            open={openVerifyMeterPopup}
            maxWidth={'sm'}
            classes={{
                paper: 'rounded-8',
            }}
        >
            <DialogContent>
                <div className="flex flex-row items-center justify-center">
                    <TypographyFormatMessage fontWeight={500} className="text-center">
                        Vérification de l'existence de votre compteur
                    </TypographyFormatMessage>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center p-24">
                    <LinearProgress
                        className="w-192 sm:w-320 max-w-full rounded-2"
                        color="primary"
                        data-testid="linear-progess"
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
