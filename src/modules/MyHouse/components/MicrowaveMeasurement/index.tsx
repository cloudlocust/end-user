import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import IconButton from '@mui/material/IconButton'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import InfosPage from 'src/modules/MyHouse/components/MicrowaveMeasurement/InfosPage'
import {
    MicrowaveMeasurementProps,
    TestStepPageProps,
} from 'src/modules/MyHouse/components/MicrowaveMeasurement/MicrowaveMeasurement.d'
import ConfigurationStep from 'src/modules/MyHouse/components/MicrowaveMeasurement/ConfigurationStep'
import EquipmentStartupStep from 'src/modules/MyHouse/components/MicrowaveMeasurement/EquipmentStartupStep'

/**
 * TestStepPage component.
 *
 * @param root0 N/A.
 * @param root0.step The state responsible for storing the current step.
 * @param root0.stepSetter The setter linked to the state step.
 * @returns The TestStepPage component.
 */
const TestStepPage = ({ step, stepSetter }: TestStepPageProps) => (
    <Box minHeight="300px" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap="60px">
        <Typography variant="h4">Step {step}</Typography>
        {step !== 4 ? (
            <Button variant="contained" onClick={() => stepSetter(step + 1)}>
                Next
            </Button>
        ) : null}
    </Box>
)

/**
 * MicrowaveMeasurement component.
 *
 * @param root0 N/A.
 * @param root0.modalIsOpen The state of the modal.
 * @param root0.closeModal Modal closing handler.
 * @returns MicrowaveMeasurement component.
 */
const MicrowaveMeasurement = ({ modalIsOpen, closeModal }: MicrowaveMeasurementProps) => {
    const [currentStep, setCurrentStep] = useState(0)
    const [selectedMicrowave, setSelectedMicrowave] = useState('')
    const [measuringMode, setMeasuringMode] = useState('')

    useEffect(() => {
        if (!modalIsOpen) {
            setCurrentStep(0)
            setSelectedMicrowave('')
            setMeasuringMode('')
        }
    }, [modalIsOpen])

    return (
        <Modal
            open={modalIsOpen}
            onClose={closeModal}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Box
                width="100%"
                maxWidth="450px"
                margin="10px"
                padding="30px 20px"
                borderRadius="20px"
                position="relative"
                bgcolor="white"
            >
                {/* The closing button */}
                <IconButton
                    aria-label="close"
                    onClick={closeModal}
                    sx={{
                        position: 'absolute',
                        right: 6,
                        top: 6,
                        /**
                         * Access predefined palette color.
                         *
                         * @param theme The MUI theme object.
                         * @returns A grey color.
                         */
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {/* The content of the modal */}
                {currentStep === 0 ? (
                    <InfosPage stepSetter={setCurrentStep} />
                ) : (
                    <>
                        <Box width="70%" margin="0 auto 20px">
                            <Stepper activeStep={currentStep - 1}>
                                <Step>
                                    <StepLabel />
                                </Step>
                                <Step>
                                    <StepLabel />
                                </Step>
                                <Step>
                                    <StepLabel />
                                </Step>
                                <Step>
                                    <StepLabel />
                                </Step>
                            </Stepper>
                        </Box>
                        {currentStep === 1 ? (
                            // Step 1
                            <ConfigurationStep
                                selectedMicrowave={selectedMicrowave}
                                setSelectedMicrowave={setSelectedMicrowave}
                                measuringMode={measuringMode}
                                setMeasuringMode={setMeasuringMode}
                                stepSetter={setCurrentStep}
                            />
                        ) : currentStep === 2 ? (
                            // Step 2
                            <EquipmentStartupStep testMode={measuringMode} stepSetter={setCurrentStep} />
                        ) : currentStep === 3 ? (
                            // Step 3
                            <TestStepPage step={currentStep} stepSetter={setCurrentStep} />
                        ) : currentStep === 4 ? (
                            // Step 4
                            <TestStepPage step={currentStep} stepSetter={setCurrentStep} />
                        ) : null}
                    </>
                )}
            </Box>
        </Modal>
    )
}

export default MicrowaveMeasurement
