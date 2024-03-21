import { useCallback, useEffect, useState } from 'react'
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
 * @param root0.housingEquipmentId The housing equipment id.
 * @param root0.equipmentsNumber The number of microwaves.
 * @param root0.measurementModes Measurement modes for the Equipment.
 * @param root0.isMeasurementModalOpen The state of the modal.
 * @param root0.showingOldResult Boolean indicating whether we want to display an old result.
 * @param root0.startMeasurementFromEquipmentsDetailsPage Boolean indicating whether we start the measurement from the EquipmentsDetails Page.
 * @param root0.updateEquipmentMeasurementResults Function that update the measurement results in the equipment details page.
 * @param root0.defaultMicrowaveNumber Default value for the microwave number.
 * @param root0.defaultMeasurementMode Default value for the measurement mode.
 * @param root0.defaultMeasurementResult Default value for the measurement result.
 * @param root0.onCloseMeasurementModal Modal closing handler.
 * @param root0.navigateToEquipmentDetailsPage Function for navigating to the equipment details page.
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
    showingOldResult,
    startMeasurementFromEquipmentsDetailsPage,
    updateEquipmentMeasurementResults,
    defaultMicrowaveNumber,
    defaultMeasurementMode,
    defaultMeasurementResult,
    onCloseMeasurementModal,
    navigateToEquipmentDetailsPage,
}: MicrowaveMeasurementProps) => {
    const [currentStep, setCurrentStep] = useState(
        showingOldResult ? 4 : startMeasurementFromEquipmentsDetailsPage ? 1 : 0,
    )
    const [microwaveNumber, setMicrowaveNumber] = useState(equipmentsNumber === 1 ? 1 : defaultMicrowaveNumber || 0)
    const [measurementMode, setMeasurementMode] = useState(defaultMeasurementMode || '')

    useEffect(() => {
        if (showingOldResult || startMeasurementFromEquipmentsDetailsPage) {
            setMicrowaveNumber(equipmentsNumber === 1 ? 1 : defaultMicrowaveNumber || 0)
            setMeasurementMode(defaultMeasurementMode || '')
        }
    }, [
        defaultMeasurementMode,
        defaultMicrowaveNumber,
        equipmentsNumber,
        showingOldResult,
        startMeasurementFromEquipmentsDetailsPage,
    ])

    const theme = useTheme()

    const measurementMaxDuration = 50

    const {
        measurementStatus,
        measurementResult,
        setMeasurementStatus,
        getTimeFromStatusLastUpdate,
        startMeasurement,
    } = useMicrowaveMeasurement(
        housingEquipmentId,
        measurementMode,
        microwaveNumber,
        measurementMaxDuration,
        defaultMeasurementResult,
    )

    /**
     * Restart the measurement from the beginning.
     */
    const handleRestartingMeasurement = useCallback(
        async (microwaveNumber?: number, measurementMode?: string) => {
            await setMeasurementStatus(null)
            if (showingOldResult) {
                setCurrentStep(2)
            } else {
                setCurrentStep(1)
            }
            setMicrowaveNumber(microwaveNumber || (equipmentsNumber === 1 ? 1 : defaultMicrowaveNumber || 0))
            setMeasurementMode(measurementMode || defaultMeasurementMode || '')
        },
        [defaultMeasurementMode, defaultMicrowaveNumber, equipmentsNumber, setMeasurementStatus, showingOldResult],
    )

    /**
     * Handle closing the measurement Modal.
     */
    const handleCloseMeasurementModal = useCallback(async () => {
        await setMeasurementStatus(null)
        if (showingOldResult) {
            setCurrentStep(4)
        } else if (startMeasurementFromEquipmentsDetailsPage) {
            setCurrentStep(1)
        } else {
            setCurrentStep(0)
        }
        setMicrowaveNumber(equipmentsNumber === 1 ? 1 : defaultMicrowaveNumber || 0)
        setMeasurementMode(defaultMeasurementMode || '')
        if (updateEquipmentMeasurementResults) {
            updateEquipmentMeasurementResults()
        }
        onCloseMeasurementModal()
    }, [
        defaultMeasurementMode,
        defaultMicrowaveNumber,
        equipmentsNumber,
        onCloseMeasurementModal,
        setMeasurementStatus,
        showingOldResult,
        startMeasurementFromEquipmentsDetailsPage,
        updateEquipmentMeasurementResults,
    ])

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
    ]

    return (
        <Modal open={isMeasurementModalOpen} onClose={handleCloseMeasurementModal}>
            <div
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-auto flex flex-col px-20 py-20 rounded-12 bg-white"
                style={{
                    height: 'calc(100% - 20px)',
                    maxHeight: currentStep === 0 ? '540px' : '455px',
                    width: 'calc(100% - 20px)',
                    maxWidth: '400px',
                }}
            >
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
                ) : currentStep === 4 ? (
                    <MeasurementResultStep
                        microwaveNumber={microwaveNumber}
                        measurementMode={measurementMode}
                        measurementResult={measurementResult}
                        showingOldResult={showingOldResult}
                        closeMeasurementModal={handleCloseMeasurementModal}
                        navigateToEquipmentDetailsPage={navigateToEquipmentDetailsPage}
                        restartMeasurementFromBeginning={handleRestartingMeasurement}
                    />
                ) : (
                    <>
                        <div className="mt-0 mb-24 mx-auto w-3/5">
                            <Stepper activeStep={currentStep - 1}>
                                {stepsContent.map((_, index) => (
                                    <Step key={index}>
                                        <StepLabel />
                                    </Step>
                                ))}
                            </Stepper>
                        </div>
                        {currentStep >= 1 && currentStep <= 3 ? stepsContent[currentStep - 1] : null}
                    </>
                )}
            </div>
        </Modal>
    )
}
