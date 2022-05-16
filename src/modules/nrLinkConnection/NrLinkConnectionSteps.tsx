import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { motion } from 'framer-motion'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import { Form, max, min, requiredBuilder } from 'src/common/react-platform-components'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useMediaQuery } from '@mui/material'
import { useIntl } from 'react-intl'
import { FirstStepNrLinkConnection, MeterFormStepNrLinkConnection } from 'src/modules/nrLinkConnection'
import { ButtonLoader } from 'src/common/ui-kit'
import { TextField } from 'src/common/ui-kit'
import { IMeter } from 'src/modules/Meters/Meters'

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
    const [meter, setMeter] = useState<IMeter | null>(null)
    const [screenOrientation, setScreenOrientation] = React.useState(
        window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape',
    )
    const [meter, setMeter] = useState<IMeter | null>(null)

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

    /**
     * On Submit function which calls addMeter and handleNext on success.
     *
     * @param formData FormData which consists of guid only.
     * @param formData.guid Guid Field value.
     * @returns If meterName exit function.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    const onSubmit = async (formData: any) => {
        try {
            // const data = { guid, name: meterName }
            console.log('formData')
            console.log(formData)

            // await addMeter(data)
            // handleNext()
            // Catch error so that don't crash the application when response error.
        } catch (error) {}
    }

    const stepsContent = [
        <FirstStepNrLinkConnection handleBack={handleBack} handleNext={handleNext} />,
        <MeterFormStepNrLinkConnection
            handleBack={handleBack}
            handleNext={handleNext}
            setMeter={setMeter}
            meter={meter}
        />,
        <Form
            onSubmit={onSubmit}
            defaultValues={meter ? { meter_guid: meter.guid, meter_name: meter.name, nrlink_guid: '' } : {}}
        >
            <div className="flex justify-between items-center landscape:mt-10">
                <div className="portrait:flex-col landscape:flex-row h-full flex justify-center items-center w-full">
                    <div className="w-full mr-10  max-w-640">
                        <div className="hidden">
                            <TextField name="meter_guid" disabled label="Nom de mon compteur" />
                        </div>
                        <TextField name="meter_name" disabled label="Nom de mon compteur" />
                        <TextField
                            name="nrlink_guid"
                            label="Numéro de mon nrLink"
                            validateFunctions={[requiredBuilder(), min(14), max(14)]}
                        />
                        <Typography
                            variant="caption"
                            className="w-full text-center mb-7"
                            sx={{ transform: 'translateY(-10px)' }}
                        >
                            {formatMessage({
                                id: 'N° GUID de votre capteur, consultable dans les paramètres de votre afficheur',
                                defaultMessage:
                                    'N° GUID de votre capteur, consultable dans les paramètres de votre afficheur',
                            })}
                        </Typography>
                    </div>
                    <div className="w-full max-w-640"></div>
                </div>
            </div>
            <ActionsNrLinkConnectionSteps
                activeStep={stepsLabels.length - 1}
                handleBack={handleBack}
                handleNext={() => {}}
            />
        </Form>,
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
