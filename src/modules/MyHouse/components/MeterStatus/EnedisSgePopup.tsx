import { Dialog, DialogContent, LinearProgress, Typography, Icon, Checkbox } from '@mui/material'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { MeterVerificationEnum } from 'src/modules/Consents/Consents.d'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { EnedisSgePopupProps } from 'src/modules/MyHouse/components/MeterStatus/enedisSgePopup'
import { RootState } from 'src/redux'

/**
 * Enedis Sge consent popup component.
 *
 * @param param0 N/A.
 * @param param0.TypographyProps Props relevant to Mui Typographu component.
 * @param param0.openEnedisSgeConsentText Text that opens the popup.
 * @param param0.houseId House's id. (logement's id). Can be undefined, if so we use the house id from currentHousing of redux store.
 * @returns Enedis Sge consent JSX.
 */
export const EnedisSgePopup = ({
    TypographyProps,
    openEnedisSgeConsentText,
    houseId,
}: EnedisSgePopupProps): JSX.Element => {
    const { formatMessage } = useIntl()
    const [sgeStep, setSgeStep] = useState(0)
    const [openSgePopup, setOpenSgePopup] = useState<boolean>(false)
    const { meterVerification, verifyMeter, isMeterVerifyLoading, setMeterVerification, createEnedisSgeConsent } =
        useConsents()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const [propsOrReduxHouseId] = useState(houseId ? houseId : currentHousing?.id)
    const [enedisConsentCheckbox, setEnedisConsentCheckbox] = useState(false)

    // UseEffect that set the second step when the meter is verified succesfully.
    useEffect(() => {
        if (meterVerification === MeterVerificationEnum.VERIFIED) {
            setSgeStep(1)
        }
    }, [meterVerification])

    // UseEffect starts when the verifyMeterPopup is true which verifies the meter.
    useEffect(() => {
        if (openSgePopup && propsOrReduxHouseId) {
            verifyMeter(propsOrReduxHouseId)
        }
    }, [openSgePopup, propsOrReduxHouseId, setOpenSgePopup, verifyMeter])

    // UseEffect starts when the checkbox is true that creates the enedis sge consent.
    // This also reset the sgeStep and the checkbox.
    useEffect(() => {
        if (enedisConsentCheckbox && propsOrReduxHouseId) {
            createEnedisSgeConsent(propsOrReduxHouseId)
            setOpenSgePopup(false)
            setMeterVerification(MeterVerificationEnum.NOT_YET_VERIFIED)
            setEnedisConsentCheckbox(false)
            setSgeStep(0)
        }
    }, [createEnedisSgeConsent, enedisConsentCheckbox, propsOrReduxHouseId, setMeterVerification])

    /**
     * Function that handles checkbox onChange event.
     *
     * @param event OnChangeEvent.
     */
    function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
        setEnedisConsentCheckbox(event.target.checked)
    }

    return (
        <>
            <Typography
                className="underline cursor-pointer"
                fontWeight={600}
                onClick={() => {
                    setOpenSgePopup(true)
                }}
                {...TypographyProps}
            >
                {openEnedisSgeConsentText}
            </Typography>
            {openSgePopup && (
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
                        {sgeStep === 1 && (
                            <div className="flex flex-row">
                                <Checkbox
                                    checked={enedisConsentCheckbox}
                                    onChange={handleCheckboxChange}
                                    color="primary"
                                    data-testid="sge-checkbox"
                                />

                                <TypographyFormatMessage
                                    className="underline cursor-pointer ml-12"
                                    fontWeight={500}
                                    data-testid="sge-message"
                                    onClick={() =>
                                        window.open('https://www.myem.fr/politique-de-confidentialite/', '_blank')
                                    }
                                >
                                    J'autorise My Energy Manager à la récolte de mon historique de données de
                                    consommation auprès d'Enedis.
                                </TypographyFormatMessage>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}
