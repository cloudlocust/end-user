import { Typography, Button } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { useIntl } from 'src/common/react-platform-translation'
import { Step } from 'src/modules/Onboarding/components/Step'
import { WelcomeIcon } from 'src/modules/Onboarding/components/WelcomeIcon'
import { IntroductionStepProps } from 'src/modules/Onboarding/steps/IntroductionStep/IntroductionStep.types'
import { primaryMainColor } from 'src/modules/Onboarding/OnboardingVariables'
/**
 * Introduction step used to greeting the user.
 *
 * @param root0 Props.
 * @param root0.onNext Next step callback.
 * @returns JSX.Element.
 */
export const IntroductionStep = ({ onNext }: IntroductionStepProps) => {
    const { user } = useSelector(({ userModel }: RootState) => userModel)
    const { formatMessage } = useIntl()

    return (
        <Step
            content={
                <>
                    <WelcomeIcon width={150} style={{ marginTop: 60 }} />
                    <Typography
                        variant="h6"
                        className="font-semibold text-center text-18 sm:text-26 mt-10"
                        sx={{ color: primaryMainColor }}
                    >
                        {formatMessage(
                            { id: 'Bienvenue {name}', defaultMessage: 'Bienvenue {name}' },
                            { name: user!.firstName },
                        )}
                    </Typography>
                    <Typography variant="subtitle1" className="text-center mt-20" sx={{ color: primaryMainColor }}>
                        {formatMessage({
                            id: 'Nous sommes ravis de vous compter parmi les utitisateurs du nrLINK!',
                            defaultMessage: 'Nous sommes ravis de vous compter parmi les utitisateurs du nrLINK!',
                        })}
                    </Typography>
                    <Typography variant="subtitle1" className="text-center mt-76" sx={{ color: 'grey.600' }}>
                        {formatMessage({
                            id: "C'est le début d'une grande aventure pour comprendre & maîtriser votre consommation d'électricité chez vous !",
                            defaultMessage:
                                "C'est le début d'une grande aventure pour comprendre & maîtriser votre consommation d'électricité chez vous !",
                        })}
                    </Typography>
                    <Button
                        variant="contained"
                        className="w-136 mt-12 mb-52 rounded-6"
                        disableElevation={true}
                        disableRipple={true}
                        onClick={() => onNext()}
                    >
                        {formatMessage({ id: 'Je me lance!', defaultMessage: 'Je me lance!' })}
                    </Button>
                </>
            }
        />
    )
}
