import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'
import { useIntl } from 'react-intl'
import {
    FirstStepNrLinkConnection,
    MeterFormStepNrLinkConnection,
    LastStepNrLinkConnection,
    LoadingNrLinkConnectionSteps,
} from 'src/modules/nrLinkConnection'
import 'src/modules/nrLinkConnection/NrLinkConnectionSteps.scss'
import { ButtonLoader } from 'src/common/ui-kit'
import { IMeter } from 'src/modules/Meters/Meters'
import MuiLink from '@mui/material/Link'
import { Link } from 'react-router-dom'
import { URL_CONSUMPTION } from 'src/modules/MyConsumption'

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

    return (
        <Box className="landscape:flex landscape:justify-between">
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
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [activeStep, setActiveStep] = React.useState(0)
    const [meter, setMeter] = useState<IMeter | null>(null)
    const [screenOrientation, setScreenOrientation] = React.useState(
        window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape',
    )
    const { formatMessage } = useIntl()
    const skipStepperLink = (
        <MuiLink
            component={Link}
            sx={{
                color:
                    // eslint-disable-next-line jsdoc/require-jsdoc
                    (theme) => theme.palette.primary.light,
            }}
            className="md:text-14"
            to={URL_CONSUMPTION}
            underline="none"
        >
            {formatMessage({ id: "Aller vers l'acceuil", defaultMessage: "Aller vers l'acceuil" })}
        </MuiLink>
    )

    const [isNrLinkAuthorizeInProgress, setIsNrLinkAuthorizeInProgress] = useState(false)

    /**
     * Handle screen state orientation.
     */
    const handleScreenOrientation = () => {
        if (window.matchMedia('(orientation: portrait)').matches) setScreenOrientation('portrait')
        else setScreenOrientation('landscape')
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
        // Reset the selected meter when going to any previous step
        setMeter(null)
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    useEffect(() => {
        window.addEventListener('resize', handleScreenOrientation)
    }, [])

    const stepsContent = [
        <FirstStepNrLinkConnection handleBack={handleBack} handleNext={handleNext} />,
        <MeterFormStepNrLinkConnection
            handleBack={handleBack}
            handleNext={handleNext}
            setMeter={setMeter}
            meter={meter}
        />,
        <LastStepNrLinkConnection
            handleBack={handleBack}
            meter={meter}
            setIsNrLinkAuthorizeInProgress={setIsNrLinkAuthorizeInProgress}
        />,
    ]

    return (
        <div className="p-24 h-full relative md:mx-auto NrLinkConnectionSteps">
            {!isNrLinkAuthorizeInProgress ? (
                <div className="h-full flex flex-col items-center justify-between">
                    <Stepper
                        className="NrLinkConnectionStepsStepper w-full"
                        activeStep={activeStep}
                        orientation={isMobile && screenOrientation === 'portrait' ? 'vertical' : 'horizontal'}
                    >
                        {stepsLabels.map((label, index) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                                {isMobile && screenOrientation === 'portrait' && (
                                    // Vertical stepper content
                                    <StepContent className="px-48" sx={{ paddingRight: '0' }}>
                                        {stepsContent[index]}
                                    </StepContent>
                                )}
                            </Step>
                        ))}
                    </Stepper>
                    {isMobile && screenOrientation === 'portrait' ? (
                        <div className="w-full text-right">{skipStepperLink}</div>
                    ) : (
                        // Horizontal stepper content
                        <div className="h-full flex mt-32 md:mt-0 items-center">
                            <div className="w-full px-48 StepperContent">
                                {stepsContent[activeStep]}
                                <div className="flex justify-between items-center mt-24 text-center">
                                    <div className="w-full">{skipStepperLink}</div>
                                    <div className="w-full"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <LoadingNrLinkConnectionSteps {...meter!} />
            )}
        </div>
    )
}

export default NrLinkConnectionSteps
