import React, { useEffect } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { motion } from 'framer-motion'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useMediaQuery } from '@mui/material'
import { useIntl } from 'react-intl'
import { FirstStepNrLinkConnection, MeterFormStepNrLinkConnection } from 'src/modules/nrLinkConnection'
import { ButtonLoader } from 'src/common/ui-kit'

/**
 * Component representing the action buttons in the Stepper (Previous, Next), Next Button will be of type Submit.
 *
 * @param props N/A.
 * @param props.activeStep Represent the current step in the stepper.
 * @param props.handleBack Callback when clicking on Previous button.
 * @param props.handleNext Callback when clicking on Next button.
 * @param props.inProgress Boolean indicating the loading of the ButtonLoading when submitting forms before next.
 * @returns ActionsNrLinkConnectionSTEPS.
 */
export const ActionsNrLinkConnectionSteps = ({
    activeStep,
    handleBack,
    handleNext,
    inProgress,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    activeStep: number
    // eslint-disable-next-line jsdoc/require-jsdoc
    handleBack: () => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    handleNext: () => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    inProgress?: boolean
}) => {
    const { formatMessage } = useIntl()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    return (
        <Box className={isMobile ? 'landscape:flex landscape:justify-between' : ''}>
            <div className="my-16 w-full flex justify-center align-center">
                {activeStep > 0 && (
                    <Button variant="contained" onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                        {formatMessage({
                            id: 'Précédent',
                            defaultMessage: 'Précédent',
                        })}
                    </Button>
                )}
                <ButtonLoader
                    variant="contained"
                    type="submit"
                    onClick={activeStep === stepsLabels.length - 1 ? () => {} : handleNext}
                    inProgress={Boolean(inProgress)}
                    sx={{ mt: 1, mr: 1 }}
                >
                    {activeStep === stepsLabels.length - 1
                        ? formatMessage({
                              id: 'Terminer',
                              defaultMessage: 'Terminer',
                          })
                        : formatMessage({
                              id: 'Suivant',
                              defaultMessage: 'Suivant',
                          })}
                </ButtonLoader>
            </div>
            <div className="w-full"></div>
        </Box>
    )
}

const stepsLabels = ['Je branche mon capteur', 'Je configure mon compteur Linky', 'Je configure mon capteur']

/**
 * NrLinkConnectionStep Component.
 *
 * @returns NrLinkConnectionSteps Component.
 */
const NrLinkConnectionSteps = () => {
    const { formatMessage } = useIntl()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [activeStep, setActiveStep] = React.useState(0)
    const [screenOrientation, setScreenOrientation] = React.useState(
        window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape',
    )

    /**
     * Handle screen state orientation.
     */
    const handleScreenOrientation = () => {
        if (window.matchMedia('(orientation: landscape)').matches) setScreenOrientation('landscape')
        else setScreenOrientation('portrait')
    }

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

    useEffect(() => {
        window.addEventListener('resize', handleScreenOrientation)
    }, [])

    const stepsContent = [
        <FirstStepNrLinkConnection handleBack={handleBack} handleNext={handleNext} />,
        <MeterFormStepNrLinkConnection handleBack={handleBack} handleNext={handleNext} />,
        <div className="flex justify-between items-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                className="min-w-96 flex justify-center w-full mr-8"
            >
                <p>IMAGE</p>
            </motion.div>
            <Typography variant="body2" className="w-full">
                {formatMessage({
                    id: 'Allumez votre afficheur déporté et suivez les instructions pour connecter votre capteur à votre compteur Linky et suivre votre consommation.',
                    defaultMessage:
                        'Allumez votre afficheur déporté et suivez les instructions pour connecter votre capteur à votre compteur Linky et suivre votre consommation.',
                })}
            </Typography>
        </div>,
    ]

    return (
        <div className="p-24 h-full relative">
            <Stepper
                activeStep={activeStep}
                orientation={isMobile && screenOrientation === 'portrait' ? 'vertical' : 'horizontal'}
            >
                {stepsLabels.map((label, index) => (
                    <Step key={label}>
                        <StepLabel optional={index === 2 ? <Typography variant="caption">Last step</Typography> : null}>
                            {label}
                        </StepLabel>
                        {isMobile && screenOrientation === 'portrait' && (
                            // Vertical stepper content
                            <StepContent sx={{ paddingRight: '0' }}>{stepsContent[index]}</StepContent>
                        )}
                    </Step>
                ))}
            </Stepper>
            {(!isMobile || screenOrientation === 'landscape') && (
                // Horizontal stepper content
                <>{stepsContent[activeStep]}</>
            )}
        </div>
    )
}

export default NrLinkConnectionSteps
