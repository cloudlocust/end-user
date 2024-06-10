import { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'src/common/react-platform-translation'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import useMediaQuery from '@mui/material/useMediaQuery'
import { SelectChangeEvent } from '@mui/material'
import { equipmentsOptions } from 'src/modules/MyHouse/components/Equipments/EquipmentsVariables'
import { EquipmentMeasurementsResults } from 'src/modules/MyHouse/components/EquipmentMeasurements/EquipmentMeasurementResults'
import { MicrowaveMeasurement } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement'
import { useModal } from 'src/hooks/useModal'
import { useEquipmentMeasurementResults } from 'src/modules/MyHouse/components/EquipmentMeasurements/EquipmentMeasurementResults/EquipmentMeasurementResultsHook'
import { EquipmentMeasurementsContentProps } from 'src/modules/MyHouse/components/EquipmentMeasurements/EquipmentMeasurementsContent/EquipmentMeasurementsContent.types'

/**
 * EquipmentDetailsContent compoonent.
 *
 * @param root0 N/A.
 * @param root0.equipmentDetails The equipment details object.
 * @returns EquipmentDetailsContent JSX.
 */
export const EquipmentMeasurementsContent = ({ equipmentDetails }: EquipmentMeasurementsContentProps) => {
    const { formatMessage } = useIntl()
    const MAX_WIDTH_600 = useMediaQuery('(max-width:600px)')
    const [selectedEquipmentNumber, setSelectedEquipmentNumber] = useState(1)
    const { measurementResults, isLoadingMeasurements, updateEquipmentMeasurementResults } =
        useEquipmentMeasurementResults()
    const {
        isOpen: isMeasurementModalOpen,
        openModal: onOpenMeasurementModal,
        closeModal: onCloseMeasurementModal,
    } = useModal()
    const MY_EQUIPEMENT = 'Mon équipement'
    const { labelTitle: equipmentLabel } =
        equipmentsOptions.find((element) => element.name === equipmentDetails.name) || {}

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
    const handleSelectEquipmentChange = (event: SelectChangeEvent<number | null>) => {
        setSelectedEquipmentNumber(event.target.value as number)
    }

    const isMeasurementButtonShown =
        equipmentDetails.number && equipmentDetails.number > 0 && equipmentDetails.name === 'microwave'

    return (
        <>
            <div className="flex flex-col h-full p-16 max-w-640 mx-auto">
                {/* The equipment select input */}
                {equipmentDetails.number && equipmentDetails.number > 1 && (
                    <div className="w-full max-w-400 mx-auto mb-20 sm:my-20">
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
                        <EquipmentMeasurementsResults
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
                <div className="flex justify-end mt-28">
                    <Button
                        variant="contained"
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
                />
            )}
        </>
    )
}
