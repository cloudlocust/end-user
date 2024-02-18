import { Stepper, Step, StepLabel } from '@mui/material'
import React from 'react'
import { AlpiqSubscriptionStepsEnum } from 'src/modules/User/AlpiqSubscription/index.d'
import { alpha, useTheme } from '@mui/material/styles'
import { primaryMainColor } from 'src/modules/utils/muiThemeVariables'
import PdlVerificationForm from 'src/modules/User/AlpiqSubscription/PdlVerificationForm'
import { useIntl } from 'react-intl'
import { FuseCard } from 'src/modules/shared/FuseCard'
import SgeConsentStep from 'src/modules/User/AlpiqSubscription/SgeConsentStep'
import ContractEstimation from '../ContractEstimation'

/**
 * Steps labels.
 */
export const stepsLabels = ['Mon Compteur Linky', 'Mon historique', 'Mon Contrat']

/**
 * Energy Provider Subscription Stepper for Alpic.
 *
 * @returns JSX Element.
 */
const AlpiqSubscriptionStepper = () => {
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const [activeStep, setActiveStep] = React.useState(AlpiqSubscriptionStepsEnum.firstStep)

    /**
     * Next Step callback.
     */
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    /**
     * Previous Step callback.
     */
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const stepsContent = [
        <PdlVerificationForm handleNext={handleNext} />,
        <SgeConsentStep handleBack={handleBack} />,
        <ContractEstimation handleNext={handleNext} />,
    ]
    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <Stepper
                className="w-5/6 mb-16"
                activeStep={activeStep}
                alternativeLabel
                sx={{
                    '& .MuiStepConnector-root.Mui-active': {
                        '& .MuiStepConnector-line': {
                            borderColor: primaryMainColor, // Step Connector (ACTIVE)
                        },
                    },
                    '& .MuiStepConnector-root.Mui-completed': {
                        '& .MuiStepConnector-line': {
                            borderColor: primaryMainColor, // Step Connector (COMPLETED)
                        },
                    },
                }}
            >
                {stepsLabels.map((label) => (
                    <Step
                        key={label}
                        sx={{
                            '& .MuiStepContent-root': {
                                borderLeftColor: primaryMainColor, // Step Content Indicator Line (ACTIVE)
                            },
                            '& .MuiStepLabel-root .Mui-completed': {
                                color: primaryMainColor, // circle color (COMPLETED)
                            },
                            '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel': {
                                color: primaryMainColor, // Just text label (COMPLETED)
                            },
                            '& .MuiStepLabel-root .Mui-active': {
                                color: primaryMainColor, // circle color (ACTIVE)
                            },
                            '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
                                color: primaryMainColor, // Just text label (ACTIVE)
                            },
                            '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                                fill: primaryMainColor, // circle's number (ACTIVE)
                            },
                        }}
                    >
                        <StepLabel>
                            {formatMessage({
                                id: label,
                                defaultMessage: label,
                            })}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
            <FuseCard
                className="rounded flex p-16 w-5/6 md:w-1/2"
                sx={{
                    border: alpha(theme.palette.primary.light, 0.1),
                    minHeight: '450px',
                }}
            >
                {stepsContent[activeStep]}
            </FuseCard>
        </div>
    )
}

export default AlpiqSubscriptionStepper
