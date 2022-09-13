import { Dialog, DialogContent, LinearProgress, Typography, Icon } from '@mui/material'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { NavLink } from 'react-router-dom'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { MeterVerificationEnum } from 'src/modules/Consents/Consents.d'
import { SgePopupProps } from 'src/modules/MyHouse/components/MeterStatus/sgePopup'

/**
 * Verify meter popup.
 *
 * @param root0 N/A.
 * @param root0.openSgePopup State for openVerifyMeterPopup.
 * @param root0.setOpenSgePopup Setter for openVerifyMeterPopup state.
 * @param root0.isMeterVerifyLoading State when meter is being verified.
 * @param root0.meterVerification State that shows if the meterr has been verified successfully or not.
 * @param root0.setMeterVerification Setterr for setIsMeterVerified.
 * @returns JSX for verify meter popup.
 */
export const SgePopup = ({
    openSgePopup,
    setOpenSgePopup,
    isMeterVerifyLoading,
    meterVerification,
    setMeterVerification,
}: SgePopupProps): JSX.Element => {
    const { formatMessage } = useIntl()
    const [sgeStep, setSgeStep] = useState(0)

    useEffect(() => {
        if (meterVerification === MeterVerificationEnum.VERIFIED) {
            setSgeStep(1)
        }
    }, [meterVerification])

    return (
        <Dialog
            onClose={(event, reason) => {
                // Not allow the user to close the popup when the meter is being checked.
                if ((reason !== 'backdropClick' && reason !== 'escapeKeyDown') || sgeStep === 1) {
                    setOpenSgePopup(false)
                    setMeterVerification(MeterVerificationEnum.NOT_YET_VERIFIED)
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
                        <div className="flex flex-1 flex-col items-center justify-center p-24">
                            {isMeterVerifyLoading ? (
                                <>
                                    <div className="flex flex-row items-center justify-center mb-24">
                                        <TypographyFormatMessage fontWeight={500} className="text-center">
                                            Vérification de l'existence de votre compteur
                                        </TypographyFormatMessage>
                                    </div>
                                    <LinearProgress
                                        className="w-192 sm:w-320 max-w-full rounded-2"
                                        color="primary"
                                        data-testid="linear-progess"
                                    />
                                </>
                            ) : (
                                (meterVerification === MeterVerificationEnum.NOT_VERIFIED ||
                                    meterVerification === MeterVerificationEnum.NOT_YET_VERIFIED) && (
                                    <div className="flex flex-col items-center">
                                        <Icon className="mb-10">
                                            <img
                                                src="/assets/images/content/housing/consent-status/meter-error.svg"
                                                alt="error-icon"
                                            />
                                        </Icon>
                                        <Typography
                                            sx={(theme) => ({
                                                color: theme.palette.warning.main,
                                            })}
                                            className="text-center"
                                            fontWeight={500}
                                        >
                                            {formatMessage({
                                                id: "Votre compteur n'a pas été reconnu",
                                                defaultMessage: "Votre compteur n'a pas été reconnu",
                                            })}
                                            <br />
                                            <NavLink to={`/my-houses`} className="underline">
                                                {formatMessage({
                                                    id: 'Veuillez renseigner un numéro de compteur',
                                                    defaultMessage: 'Veuillez renseigner un numéro de compteur',
                                                })}
                                            </NavLink>
                                        </Typography>
                                    </div>
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
