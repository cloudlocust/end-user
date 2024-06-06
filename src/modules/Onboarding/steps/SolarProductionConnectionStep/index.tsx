import { Typography, Button } from '@mui/material'
import { ButtonLoader } from 'src/common/ui-kit'
import { useIntl } from 'src/common/react-platform-translation'
import { Step } from 'src/modules/Onboarding/components/Step'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { EnphaseConsentPopup } from 'src/modules/MyHouse/components/MeterStatus/EnphaseConsentPopup'
import ConnectedPlugProductionConsentPopup from 'src/modules/MyHouse/components/MeterStatus/ConnectedPlugProductionConsentPopup'
import { SolarProductionConnectionStepProps } from 'src/modules/Onboarding/steps/SolarProductionConnectionStep/SolarProductionConnectionStep.types'
import { useModal } from 'src/hooks/useModal'
import { primaryLightColor, primaryMainColor } from 'src/modules/Onboarding/OnboardingVariables'

/**
 * SolarProductionConnectionStep step to link the solar panels installation using shelly plugs & enphase.
 *
 * @param root0 Props.
 * @param root0.onNext Callback on next step.
 * @param root0.housingId Housing id.
 * @param root0.isHideOnboardingInProgress Boolean indicate be true when we send request to hide the onboarding.
 * @returns JSX Element.
 */
export const SolarProductionConnectionStep = ({
    onNext,
    housingId,
    isHideOnboardingInProgress,
}: SolarProductionConnectionStepProps) => {
    const { enphaseLink, getEnphaseLink, isEnphaseConsentLoading } = useConsents()

    const {
        isOpen: isOpeningEnphaseConsentPopup,
        openModal: openEnphaseConsentPopup,
        closeModal: closeEnphaseConsentPopup,
    } = useModal()

    const {
        isOpen: isOpeningConnectedPlugProductionConsentPopup,
        openModal: openConnectedPlugProductionConsentPopup,
        closeModal: closeConnectedPlugProductionConsentPopup,
    } = useModal()

    const { formatMessage } = useIntl()

    return (
        <Step
            title={formatMessage({
                id: 'Bonus: Soleil soleil !',
                defaultMessage: 'Bonus: Soleil soleil !',
            })}
            content={
                <>
                    <Typography variant="subtitle1" className="self-start mt-24" sx={{ color: primaryMainColor }}>
                        {formatMessage({
                            id: 'Avez-vous une installation solaire avec des identifiants Enphase ou une prise connectée Shelly plug S ?',
                            defaultMessage:
                                'Avez-vous une installation solaire avec des identifiants Enphase ou une prise connectée Shelly plug S ?',
                        })}
                    </Typography>
                    <Button
                        variant="contained"
                        className="self-start text-left mt-16 rounded-4"
                        sx={{
                            backgroundColor: primaryLightColor,
                            '&:hover': { backgroundColor: primaryLightColor, opacity: 0.7 },
                        }}
                        disableElevation={true}
                        disableRipple={true}
                        onClick={() => {
                            getEnphaseLink(housingId)
                            openEnphaseConsentPopup()
                        }}
                    >
                        {formatMessage({
                            id: 'Lier mon installation avec Enphase',
                            defaultMessage: 'Lier mon installation avec Enphase',
                        })}
                    </Button>
                    <Button
                        variant="contained"
                        className="self-start text-left mt-5 rounded-4"
                        sx={{
                            backgroundColor: primaryLightColor,
                            '&:hover': { backgroundColor: primaryLightColor, opacity: 0.7 },
                        }}
                        disableElevation={true}
                        disableRipple={true}
                        onClick={openConnectedPlugProductionConsentPopup}
                    >
                        {formatMessage({
                            id: 'Lier mon installation avec Shelly',
                            defaultMessage: 'Lier mon installation avec Shelly',
                        })}
                    </Button>
                    {/* <Button
                        variant="contained"
                        className="self-start text-left mt-12 mb-72 rounded-4"
                        sx={{ backgroundColor: greyTitleColor, '&:hover': { backgroundColor: greyTitleColor, opacity: 0.7 } }}
                        disableElevation={true}
                        disableRipple={true}
                    >
                        {formatMessage({
                            id: "Mon installation solaire n'est pas compatible",
                            defaultMessage: "Mon installation solaire n'est pas compatible",
                        })}
                    </Button> */}
                    <ButtonLoader
                        onClick={onNext}
                        variant="contained"
                        className="self-end w-128 mt-72 mb-36, rounded-8"
                        disableElevation={true}
                        disableRipple={true}
                        inProgress={isEnphaseConsentLoading || isHideOnboardingInProgress}
                        data-testid="next-button"
                    >
                        {formatMessage({ id: 'Suivant', defaultMessage: 'Suivant' })}
                    </ButtonLoader>

                    {isOpeningEnphaseConsentPopup && (
                        <EnphaseConsentPopup onClose={closeEnphaseConsentPopup} url={enphaseLink} />
                    )}
                    {isOpeningConnectedPlugProductionConsentPopup && (
                        <ConnectedPlugProductionConsentPopup onClose={closeConnectedPlugProductionConsentPopup} />
                    )}
                </>
            }
        />
    )
}
