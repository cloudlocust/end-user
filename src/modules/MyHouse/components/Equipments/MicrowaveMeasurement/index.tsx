import { useCallback, useState } from 'react'
import Modal from '@mui/material/Modal'
import IconButton from '@mui/material/IconButton'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { useTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import { InfosPage } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/InfosPage'
import { ConfigurationStep } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/ConfigurationStep'
import { MeasurementStartupStep } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementStartupStep'
import { MeasurementProcessStep } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProcessStep'
import { MeasurementResultStep } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementResultStep'
import { MicrowaveMeasurementProps } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MicrowaveMeasurement'
import { useMicrowaveMeasurement } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MicrowaveMeasurementHook'

/**
 * MicrowaveMeasurement component.
 *
 * @param root0 N/A.
 * @param root0.housingEquipmentId The global equipment id.
 * @param root0.equipmentsNumber The number of microwaves.
 * @param root0.measurementModes Measurement modes for the Equipment.
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
 *          <MicrowaveMeasurement isMeasurementModalOpen={isOpen} onCloseMeasurementModal={closeModal} housingEquipmentId={25} equipmentsNumber={3} measurementModes={["Mode A", "Mode B"]} />
 *      </div>
 *  )
 * @returns MicrowaveMeasurement component.
 */
export const MicrowaveMeasurement = ({
    housingEquipmentId,
    equipmentsNumber,
    measurementModes,
    isMeasurementModalOpen,
    onCloseMeasurementModal,
}: MicrowaveMeasurementProps) => {
    const [currentStep, setCurrentStep] = useState(0)
    const [microwaveNumber, setMicrowaveNumber] = useState(0)
    const [measurementMode, setMeasurementMode] = useState('')
    const theme = useTheme()

    const measurementMaxDuration = 50

    const {
        measurementStatus,
        measurementResult,
        setMeasurementStatus,
        getTimeFromStatusLastUpdate,
        startMeasurement,
    } = useMicrowaveMeasurement(housingEquipmentId, measurementMode, microwaveNumber, measurementMaxDuration)

    /**
     * Restart the measurement from the beginning.
     */
    const handleRestartingMeasurement = useCallback(async () => {
        await setMeasurementStatus(null)
        setCurrentStep(1)
        setMicrowaveNumber(0)
        setMeasurementMode('')
    }, [setMeasurementStatus])

    /**
     * Handle closing the measurement Modal.
     */
    const handleCloseMeasurementModal = useCallback(async () => {
        await setMeasurementStatus(null)
        setCurrentStep(0)
        setMicrowaveNumber(0)
        setMeasurementMode('')
        onCloseMeasurementModal()
    }, [onCloseMeasurementModal, setMeasurementStatus])

    const stepsContent = [
        <ConfigurationStep
            equipmentsNumber={equipmentsNumber}
            selectedMicrowave={microwaveNumber}
            setSelectedMicrowave={setMicrowaveNumber}
            measurementModes={measurementModes}
            selectedMeasurementMode={measurementMode}
            setSelectedMeasurementMode={setMeasurementMode}
            stepSetter={setCurrentStep}
        />,
        <MeasurementStartupStep measurementMode={measurementMode} stepSetter={setCurrentStep} />,
        <MeasurementProcessStep
            measurementStatus={measurementStatus}
            measurementMaxDuration={measurementMaxDuration}
            getTimeFromStatusLastUpdate={getTimeFromStatusLastUpdate}
            startMeasurement={startMeasurement}
            restartMeasurementFromBeginning={handleRestartingMeasurement}
            stepSetter={setCurrentStep}
        />,
        <MeasurementResultStep
            measurementMode={measurementMode}
            measurementResult={measurementResult}
            closeMeasurementModal={handleCloseMeasurementModal}
        />,
    ]

    return (
        <Modal
            open={isMeasurementModalOpen}
            onClose={handleCloseMeasurementModal}
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
                    onClick={handleCloseMeasurementModal}
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
