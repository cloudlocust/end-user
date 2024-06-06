import { Typography, Button } from '@mui/material'
import { motion } from 'framer-motion'
import { useIntl } from 'src/common/react-platform-translation'
import { Step } from 'src/modules/Onboarding/components/Step'
import { NrLinkInstallationInstructionsStepProps } from 'src/modules/Onboarding/steps/NrLinkInstallationInstructionsStep/NrLinkInstallationInstructionsStep.types'
import meterNrlinkInstallation from 'src/assets/images/content/onboarding/meterNrlinkInstallation.png'
import { primaryMainColor } from 'src/modules/Onboarding/OnboardingVariables'

/**
 * NrLinkInstallationInstructionsStep step used to help users to setup their nrlink device on the meter.
 *
 * @param root0 Props.
 * @param root0.onNext Callback on next step.
 * @returns JSX Element.
 */
export const NrLinkInstallationInstructionsStep = ({ onNext }: NrLinkInstallationInstructionsStepProps) => {
    const { formatMessage } = useIntl()

    return (
        <Step
            title={formatMessage(
                {
                    id: '{step}/{totalStep}: Le commencement...',
                    defaultMessage: '{step}/{totalStep}: Le commencement...',
                },
                { step: 1, totalStep: 4 },
            )}
            content={
                <>
                    <Typography variant="subtitle1" className="text-center mt-76" sx={{ color: primaryMainColor }}>
                        {formatMessage({
                            id: 'Prêt à rendre visible votre consommation d’électricité ?',
                            defaultMessage: 'Prêt à rendre visible votre consommation d’électricité ?',
                        })}
                    </Typography>
                    <Typography variant="subtitle1" className="text-center mt-20" sx={{ color: primaryMainColor }}>
                        {formatMessage({
                            id: 'Allumez votre nrLINK il va vous guider pour son installation ;)',
                            defaultMessage: 'Allumez votre nrLINK il va vous guider pour son installation ;)',
                        })}
                    </Typography>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex w-320 rounded-16 mt-10"
                    >
                        <img src={meterNrlinkInstallation} alt="nrlink connection method" />
                    </motion.div>
                    <div className="self-end text-right mt-40">
                        <Typography variant="subtitle1" sx={{ color: primaryMainColor }}>
                            {formatMessage({
                                id: 'Terminé ?',
                                defaultMessage: 'Terminé ?',
                            })}
                        </Typography>
                        <Button
                            onClick={onNext}
                            variant="contained"
                            className="w-128 mt-3 mb-72 rounded-8"
                            disableElevation={true}
                            disableRipple={true}
                        >
                            {formatMessage({ id: "C'est fait !", defaultMessage: "C'est fait !" })}
                        </Button>
                    </div>
                </>
            }
        />
    )
}
