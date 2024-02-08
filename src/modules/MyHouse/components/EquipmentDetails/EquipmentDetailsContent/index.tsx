import { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'src/common/react-platform-translation'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import useMediaQuery from '@mui/material/useMediaQuery'
import {
    EquipmentDetailsContentProps,
    SelectOnChangeHandler,
} from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentDetailsContent/EquipmentDetailsContent'
import { myEquipmentOptions } from 'src/modules/MyHouse/utils/MyHouseVariables'
import { EquipmentMeasurementResults } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResults'
import { MicrowaveMeasurement } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement'
import { useModal } from 'src/hooks/useModal'
import { useEquipmentMeasurementResults } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResults/EquipmentMeasurementResultsHook'

/**
 * EquipmentDetailsContent compoonent.
 *
 * @param root0 N/A.
 * @param root0.equipmentDetails The equipment details object.
 * @returns EquipmentDetailsContent JSX.
 */
export const EquipmentDetailsContent = ({ equipmentDetails }: EquipmentDetailsContentProps) => {
    const { formatMessage } = useIntl()
    const MAX_WIDTH_600 = useMediaQuery('(max-width:600px)')
    const [selectedEquipmentNumber, setSelectedEquipmentNumber] = useState(equipmentDetails.number === 1 ? 1 : null)
    const { measurementResults, isLoadingMeasurements, updateEquipmentMeasurementResults } =
        useEquipmentMeasurementResults()
    const {
        isOpen: isMeasurementModalOpen,
        openModal: onOpenMeasurementModal,
        closeModal: onCloseMeasurementModal,
    } = useModal()
    const MY_EQUIPEMENT = 'Mon équipement'
    const { labelTitle: equipmentLabel } =
        myEquipmentOptions.find((element) => element.name === equipmentDetails.name) || {}

    /**
     * Function to update the measurement results for the current equipment.
     */
    const updateCurrentEquipmentMeasurementResults = useCallback(() => {
        if (equipmentDetails.measurementModes)
            updateEquipmentMeasurementResults(
                selectedEquipmentNumber,
                equipmentDetails.housingEquipmentId!,
                equipmentDetails.measurementModes,
            )
    }, [
        equipmentDetails.housingEquipmentId,
        equipmentDetails.measurementModes,
        selectedEquipmentNumber,
        updateEquipmentMeasurementResults,
    ])

    useEffect(() => {
        updateCurrentEquipmentMeasurementResults()
    }, [updateCurrentEquipmentMeasurementResults])

    /**
     * The select onChange handler function.
     *
     * @param event The onChange event.
     */
    const handleSelectEquipmentChange: SelectOnChangeHandler = (event) => {
        setSelectedEquipmentNumber(event.target.value)
    }

    const isMeasurementButtonShown =
        equipmentDetails.number && equipmentDetails.number > 0 && equipmentDetails.name === 'microwave'

    return (
        <>
            <div className="flex flex-col h-full p-16">
                {/* The equipment select input */}
                {equipmentDetails.number && equipmentDetails.number > 1 && (
                    <div className="w-full max-w-640 mx-auto mb-36">
                        <FormControl fullWidth>
                            <InputLabel
                                id="equipment-select-label"
                                sx={{
                                    fontSize: MAX_WIDTH_600 ? 14 : 16,
                                }}
                            >
                                {formatMessage({
                                    id: MY_EQUIPEMENT,
                                    defaultMessage: MY_EQUIPEMENT,
                                })}
                            </InputLabel>
                            <Select
                                labelId="equipment-select-label"
                                id="equipment-select"
                                value={selectedEquipmentNumber}
                                label={formatMessage({
                                    id: MY_EQUIPEMENT,
                                    defaultMessage: MY_EQUIPEMENT,
                                })}
                                onChange={handleSelectEquipmentChange}
                                sx={{
                                    fontSize: MAX_WIDTH_600 ? 14 : 16,
                                }}
                                data-testid="equipment-select"
                            >
                                {Array(equipmentDetails.number)
                                    .fill(null)
                                    .map((_, index) => (
                                        <MenuItem
                                            value={index + 1}
                                            sx={{
                                                fontSize: MAX_WIDTH_600 ? 14 : 16,
                                            }}
                                        >{`${equipmentLabel} ${index + 1}`}</MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </div>
                )}

                {/* Measurement result list */}
                <div className="flex-1">
                    {equipmentDetails.number && (
                        <EquipmentMeasurementResults
                            measurementModes={equipmentDetails.measurementModes}
                            housingEquipmentId={equipmentDetails.housingEquipmentId!}
                            equipmentsNumber={equipmentDetails.number}
                            equipmentNumber={selectedEquipmentNumber}
                            measurementResults={measurementResults}
                            isLoadingMeasurements={isLoadingMeasurements}
                            updateEquipmentMeasurementResults={updateEquipmentMeasurementResults}
                        />
                    )}
                </div>

                {/* Buttons */}
                <div className={`flex justify-end`}>
                    <Button
                        variant="contained"
                        size="large"
                        className={'flex-1 sm:flex-none'}
                        onClick={onOpenMeasurementModal}
                        disabled={!isMeasurementButtonShown}
                    >
                        {formatMessage({
                            id: "Mesurer l'appareil",
                            defaultMessage: "Mesurer l'appareil",
                        })}
                    </Button>
                </div>
            </div>

            {equipmentDetails.number && equipmentDetails.measurementModes && (
                <MicrowaveMeasurement
                    housingEquipmentId={equipmentDetails.housingEquipmentId!}
                    equipmentsNumber={equipmentDetails.number}
                    measurementModes={equipmentDetails.measurementModes}
                    isMeasurementModalOpen={isMeasurementModalOpen}
                    onCloseMeasurementModal={onCloseMeasurementModal}
                    defaultMicrowaveNumber={selectedEquipmentNumber}
                    updateEquipmentMeasurementResults={updateCurrentEquipmentMeasurementResults}
                    startMeasurementFromEquipmentsDetailsPage
                />
            )}
        </>
    )
}
