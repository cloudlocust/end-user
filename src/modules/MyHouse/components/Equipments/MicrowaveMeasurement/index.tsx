import { useState } from 'react'
import Modal from '@mui/material/Modal'
import IconButton from '@mui/material/IconButton'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import { InfosPage } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/InfosPage'
import { ConfigurationStep } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/ConfigurationStep'
import { EquipmentStartupStep } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/EquipmentStartupStep'
import {
    MicrowaveMeasurementProps,
    TestStepPageProps,
} from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MicrowaveMeasurement'

/**
 * TestStepPage component.
 *
 * @param root0 N/A.
 * @param root0.step The state responsible for storing the current step.
 * @param root0.stepSetter The setter linked to the state step.
 * @returns The TestStepPage component.
 */
const TestStepPage = ({ step, stepSetter }: TestStepPageProps) => (
    <div className="min-h-360 flex flex-col justify-center items-center gap-40">
        <Typography variant="h4">Step {step}</Typography>
        {step !== 4 ? (
            <Button variant="contained" onClick={() => stepSetter(step + 1)}>
                Next
            </Button>
        ) : null}
    </div>
)

/**
 * MicrowaveMeasurement component.
 *
 * @param root0 N/A.
 * @param root0.equipmentsNumber The number of microwaves.
 * @param root0.isMeasurementModalOpen The state of the modal.
 * @param root0.onCloseMeasurementModal Modal closing handler.
 * @example
 *  /// Use this MicrowaveMeasurement component with our useModal custom hook
 *
 *  const { isOpen, openModal, closeModal } = useModal()
 *
 *  return(
 *      <div>
 *          <Button onClick={openModal}>
 *              Mesurer
 *          </Button>
 *          <MicrowaveMeasurement equipmentsNumber={3} isMeasurementModalOpen={isOpen} onCloseMeasurementModal={closeModal} />
 *      </div>
 *  )
 * @returns MicrowaveMeasurement component.
 */
export const MicrowaveMeasurement = ({
    equipmentsNumber,
    isMeasurementModalOpen,
    onCloseMeasurementModal,
}: MicrowaveMeasurementProps) => {
    const [currentStep, setCurrentStep] = useState(0)
    const [selectedMicrowave, setSelectedMicrowave] = useState('')
    const [measurementMode, setMeasurementMode] = useState('')
    const theme = useTheme()

    const stepsContent = [
        <ConfigurationStep
            equipmentsNumber={equipmentsNumber}
            selectedMicrowave={selectedMicrowave}
            setSelectedMicrowave={setSelectedMicrowave}
            measurementMode={measurementMode}
            setMeasurementMode={setMeasurementMode}
            stepSetter={setCurrentStep}
        />,
        <EquipmentStartupStep measurementMode={measurementMode} stepSetter={setCurrentStep} />,
        <TestStepPage step={currentStep} stepSetter={setCurrentStep} />,
        <TestStepPage step={currentStep} stepSetter={setCurrentStep} />,
    ]

    /**
     * Handle closing the measurement Modal.
     */
    const handleCloseModal = () => {
        setCurrentStep(0)
        setSelectedMicrowave('')
        setMeasurementMode('')
        onCloseMeasurementModal()
    }

    return (
        <Modal
            open={isMeasurementModalOpen}
            onClose={handleCloseModal}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div className="w-full max-w-400 m-7 px-14 py-20 rounded-12 relative bg-white">
                {/* The closing button */}
                <IconButton
                    aria-label="close"
                    onClick={handleCloseModal}
                    sx={{
                        position: 'absolute',
                        right: 6,
                        top: 6,
                        color: theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {/* The content of the modal */}
                {currentStep === 0 ? (
                    <InfosPage stepSetter={setCurrentStep} />
                ) : (
                    <>
                        <div className="mt-0 mb-24 mx-auto w-3/4">
                            <Stepper activeStep={currentStep - 1}>
                                {stepsContent.map((_, index) => (
                                    <Step key={index}>
                                        <StepLabel />
                                    </Step>
                                ))}
                            </Stepper>
                        </div>
                        {currentStep < 5 ? stepsContent[currentStep - 1] : null}
                    </>
                )}
            </div>
        </Modal>
    )
}
