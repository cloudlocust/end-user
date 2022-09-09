import { Dialog, DialogContent, LinearProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * Verify meter popup.
 *
 * @param root0 N/A.
 * @param root0.openSgePopup State for openVerifyMeterPopup.
 * @param root0.setOpenSgePopup Setter for openVerifyMeterPopup state.
 * @param root0.isMeterVerifyLoading State when meter is being verified.
 * @param root0.isMeterVerified State that shows if the meterr has been verified successfully or not.
 * @param root0.setIsMeterVerified Setterr for setIsMeterVerified.
 * @returns JSX for verify meter popup.
 */
export const SgePopup = ({
    openSgePopup,
    setOpenSgePopup,
    isMeterVerifyLoading,
    isMeterVerified,
    setIsMeterVerified,
}: /**
 * SgePopup props types.
 */
{
    /**
     * State for openVerifyMeterPopup.
     */
    openSgePopup: boolean
    /**
     * Setter for openVerifyMeterPopup state.
     */
    setOpenSgePopup: (openVerifyMeterPopup: boolean) => void
    /**
     * Verifying meter state.
     */
    isMeterVerifyLoading: boolean
    /**
     * State that shows if the meterr has been verified successfully or not.
     */
    isMeterVerified: boolean
    /**
     * Setterr for setIsMeterVerified.
     */
    setIsMeterVerified: (isMeterVerified: boolean) => void
}): JSX.Element => {
    const { formatMessage } = useIntl()
    const [sgeStep, setSgeStep] = useState(0)

    useEffect(() => {
        if (isMeterVerified) {
            setSgeStep(1)
        }
    }, [isMeterVerified])

    return (
        <Dialog
            onClose={(event, reason) => {
                // Not allow the user to close the popup when the meter is being checked.
                if ((reason !== 'backdropClick' && reason !== 'escapeKeyDown') || sgeStep === 1) {
                    setOpenSgePopup(false)
                    setIsMeterVerified(false)
                    setSgeStep(0)
                }
            }}
            open={openSgePopup}
            maxWidth={'sm'}
            classes={{
                paper: 'rounded-8',
            }}
        >
            <DialogContent>
                {sgeStep === 0 && (
                    <>
                        <div className="flex flex-row items-center justify-center">
                            <TypographyFormatMessage fontWeight={500} className="text-center">
                                Vérification de l'existence de votre compteur
                            </TypographyFormatMessage>
                        </div>
                        <div className="flex flex-1 flex-col items-center justify-center p-24">
                            {isMeterVerifyLoading ? (
                                <LinearProgress
                                    className="w-192 sm:w-320 max-w-full rounded-2"
                                    color="primary"
                                    data-testid="linear-progess"
                                />
                            ) : (
                                !isMeterVerified && (
                                    <Typography
                                        sx={(theme) => ({
                                            color: theme.palette.warning.main,
                                        })}
                                    >
                                        {formatMessage({
                                            id: "Votre compteur n'a pas été reconnu",
                                            defaultMessage: "Votre compteur n'a pas été reconnu",
                                        })}
                                        <br />
                                        {formatMessage({
                                            id: 'Veuillez renseigner un numéro de compteur',
                                            defaultMessage: 'Veuillez renseigner un numéro de compteur',
                                        })}
                                    </Typography>
                                )
                            )}
                        </div>
                    </>
                )}
                {/* TODO: MYEM-2628 */}
                {sgeStep === 1 && <>Second Step Here</>}
            </DialogContent>
        </Dialog>
    )
}
