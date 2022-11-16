import { Dialog, DialogContent, LinearProgress, Typography, Icon, Checkbox } from '@mui/material'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { MeterVerificationEnum } from 'src/modules/Consents/Consents.d'
import { useConsents } from 'src/modules/Consents/consentsHook'
import {
    EnedisSgePopupProps,
    EnedisSgePopupStepsEnum,
} from 'src/modules/MyHouse/components/MeterStatus/enedisSgePopup.d'
import { sgeConsentFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import { warningMainHashColor } from 'src/modules/utils/muiThemeVariables'
import { RootState } from 'src/redux'

/**
 * Enedis Sge consent popup component.
 *
 * @param param0 N/A.
 * @param param0.TypographyProps Props relevant to Mui Typographu component.
 * @param param0.openEnedisSgeConsentText Text that opens the popup.
 * @param param0.houseId House's id. (logement's id). Can be undefined, if so we use the house id from currentHousing of redux store.
 * @param param0.createEnedisSgeConsent Setter function that handles Enedis consent request.
 * @param param0.isCreateEnedisSgeConsentLoading Loading state when creating enedis sge consent.
 * @param param0.createEnedisSgeConsentError Error when create enedis sge consent.
 * @returns Enedis Sge consent JSX.
 */
export const EnedisSgePopup = ({
    TypographyProps,
    openEnedisSgeConsentText,
    houseId,
    createEnedisSgeConsent,
    isCreateEnedisSgeConsentLoading,
    createEnedisSgeConsentError,
}: EnedisSgePopupProps): JSX.Element => {
    const { formatMessage } = useIntl()
    const [sgeStep, setSgeStep] = useState<EnedisSgePopupStepsEnum>(EnedisSgePopupStepsEnum.METER_VERIFICATION)
    const [openSgePopup, setOpenSgePopup] = useState<boolean>(false)
    const { meterVerification, verifyMeter, isMeterVerifyLoading, setMeterVerification } = useConsents()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const [propsOrReduxHouseId] = useState(houseId ? houseId : currentHousing?.id)
    const [enedisConsentCheckbox, setEnedisConsentCheckbox] = useState(false)

    // UseEffect that set the second step when the meter is verified succesfully.
    useEffect(() => {
        if (meterVerification === MeterVerificationEnum.VERIFIED) {
            setSgeStep(EnedisSgePopupStepsEnum.ENEDIS_CONSENT_CREATION)
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
            setEnedisConsentCheckbox(false)
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

    /**
     * Function that resets to the intial step of givinbg SGE consent when user closes the popup.
     */
    function resetToInitialStep() {
        setOpenSgePopup(false)
        setMeterVerification(MeterVerificationEnum.NOT_VERIFIED)
        setSgeStep(EnedisSgePopupStepsEnum.METER_VERIFICATION)
    }

    return (
        <>
            <Typography
                className={`underline cursor-pointer ${!sgeConsentFeatureState && 'cursor-not-allowed text-grey-600'}`}
                fontWeight={600}
                onClick={() => {
                    if (!sgeConsentFeatureState) return
                    else setOpenSgePopup(true)
                }}
                {...TypographyProps}
            >
                {openEnedisSgeConsentText}
            </Typography>

            {openSgePopup && (
                <Dialog
                    onClose={(event, reason) => {
                        resetToInitialStep()
                    }}
                    open={openSgePopup}
                    maxWidth={'sm'}
                    classes={{
                        paper: 'rounded-8',
                    }}
                >
                    <DialogContent>
                        {sgeStep === EnedisSgePopupStepsEnum.METER_VERIFICATION && (
                            <>
                                <div className="flex flex-1 flex-col items-center justify-center p-12 md:p-24">
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
                                        meterVerification === MeterVerificationEnum.NOT_VERIFIED && (
                                            <div className="flex flex-col items-center">
                                                <Icon className="mb-10">
                                                    <img
                                                        src="/assets/images/content/housing/consent-status/meter-error.svg"
                                                        alt="error-icon"
                                                    />
                                                </Icon>
                                                <Typography
                                                    sx={(theme) => ({
                                                        color: warningMainHashColor,
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
                        {sgeStep === EnedisSgePopupStepsEnum.ENEDIS_CONSENT_CREATION && (
                            <div className="flex flex-1 flex-row items-center justify-center">
                                {isCreateEnedisSgeConsentLoading ? (
                                    <div className="p-24">
                                        <div className="flex flex-row items-center justify-center mb-24">
                                            <TypographyFormatMessage fontWeight={500} className="text-center">
                                                Demande d'authorisation SGE en cours
                                            </TypographyFormatMessage>
                                        </div>
                                        <LinearProgress
                                            className="w-192 sm:w-320 max-w-full rounded-2"
                                            color="primary"
                                            data-testid="linear-progess"
                                        />
                                    </div>
                                ) : createEnedisSgeConsentError ? (
                                    <div className="flex flex-col items-center">
                                        <Icon className="mb-10">
                                            <img
                                                src="/assets/images/content/housing/consent-status/meter-error.svg"
                                                alt="error-icon"
                                            />
                                        </Icon>
                                        <Typography
                                            sx={(theme) => ({
                                                color: warningMainHashColor,
                                            })}
                                            className="text-center"
                                            fontWeight={500}
                                        >
                                            {formatMessage({
                                                id: "Le numéro de compteur n'a pas été reconnu ou ne correspond pas au nom renseigné",
                                                defaultMessage:
                                                    "Le numéro de compteur n'a pas été reconnu ou ne correspond pas au nom renseigné",
                                            })}
                                            <br />
                                            <NavLink to={`/my-houses`} className="underline">
                                                {formatMessage({
                                                    id: 'Veuillez vérifiez votre compteur ou votre logement',
                                                    defaultMessage:
                                                        'Veuillez vérifiez votre compteur ou votre logement',
                                                })}
                                            </NavLink>
                                        </Typography>
                                    </div>
                                ) : (
                                    <>
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
                                                window.open(
                                                    'https://drive.google.com/uc?export=download&id=15QHX14AWoKepWuEJBxscijK5IIHPnCbl',
                                                    '_blank',
                                                )
                                            }
                                        >
                                            J'autorise My Energy Manager à la récolte de mon historique de données de
                                            consommation auprès d'Enedis.
                                        </TypographyFormatMessage>
                                    </>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}
