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
    MeterStepNrLinkConnectionForm,
    LastStepNrLinkConnection,
    LoadingNrLinkConnectionSteps,
} from 'src/modules/nrLinkConnection'
import 'src/modules/nrLinkConnection/NrLinkConnectionSteps.scss'
import { ButtonLoader } from 'src/common/ui-kit'
import { IMeter } from 'src/modules/Meters/Meters'
import MuiLink from '@mui/material/Link'
import { Link, useLocation, useParams } from 'react-router-dom'
import { URL_CONSUMPTION } from 'src/modules/MyConsumption'
import { NrlinkConnectionStepsEnum } from 'src/modules/nrLinkConnection/nrlinkConnectionSteps.d'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'

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

    // this ones are for handling the housing id's and their speceif meters
    const { currentHousing, housingList } = useSelector(({ housingModel }: RootState) => housingModel)
    const { houseId } = useParams</**
     *
     */
    {
        // eslint-disable-next-line jsdoc/require-jsdoc
        houseId: string
    }>()
    const parsedHouseId = parseInt(houseId)
    const [housingId, setHousingId] = useState<number | undefined>(parsedHouseId)

    // to keep the housing and meter updated depending on which house we are updating.
    // by default this page is for the current housing, if
    useEffect(() => {
        // if no house id in the url, we set it to the current housing
        !parsedHouseId && setHousingId(currentHousing?.id)

        // once we have wich house we are using, we search for it in the housing list to get the meter
        const handledHousing = housingList?.find((housing) => housing.id === housingId)
        handledHousing && setMeter(handledHousing.meter)
    }, [currentHousing, parsedHouseId, housingList, housingId])

    const [meter, setMeter] = useState<IMeter | null>(null)

    /**
     * ActiveStep state is received from MeterStatus.tsx component.
     * When the user doesn't have either a meter nor nrlink, we redirect them to the second step.
     * When the user does have a meter but doesn't have nrlink assigned in the app. We redirect them to the third step.
     */
    const {
        state: locationState,
    }: // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Route state.
         */
        // eslint-disable-next-line jsdoc/require-jsdoc
        state: {
            /**
             * Activate step that we want the stepper to be in.
             */
            activeStep: NrlinkConnectionStepsEnum.secondStep | NrlinkConnectionStepsEnum.thirdStep
        }
    } = useLocation()

    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [activeStep, setActiveStep] = React.useState(NrlinkConnectionStepsEnum.firstStep)
    const [screenOrientation, setScreenOrientation] = React.useState(
        window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape',
    )
    const { formatMessage } = useIntl()

    /**
     * If we receive activateStep from useLocation we set ActiveStep to 1 or 2 depending on the value that was passed.
     */
    useEffect(() => {
        if (locationState) {
            setActiveStep(locationState.activeStep)
        }
    }, [locationState])

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
            {formatMessage({ id: "Aller vers l'accueil", defaultMessage: "Aller vers l'accueil" })}
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
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    useEffect(() => {
        window.addEventListener('resize', handleScreenOrientation)
    }, [])

    const stepsContent = [
        <FirstStepNrLinkConnection handleBack={handleBack} handleNext={handleNext} />,
        <MeterStepNrLinkConnectionForm
            handleBack={handleBack}
            handleNext={handleNext}
            setMeter={setMeter}
            meter={meter}
            housingId={housingId}
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
                                    <StepContent className="px-20" sx={{ paddingRight: '0' }}>
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
