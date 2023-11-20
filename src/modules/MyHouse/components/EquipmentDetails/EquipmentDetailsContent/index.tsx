import { useEffect, useState } from 'react'
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
import { EquipmentMeasurementResultsList } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResultsList'
import { MicrowaveMeasurement } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement'
import { useModal } from 'src/hooks/useModal'
import { useEquipmentMeasurementResults } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResultsList/EquipmentMeasurementResultsHook'

/**
 * EquipmentDetailsContent compoonent.
 *
 * @param root0 N/A.
 * @param root0.equipmentDetails The equipment details object.
 * @returns EquipmentDetailsContent JSX.
 */
export const EquipmentDetailsContent = ({ equipmentDetails }: EquipmentDetailsContentProps) => {
    const { formatMessage } = useIntl()
    const max_width_600 = useMediaQuery('(max-width:600px)')
    const max_width_470 = useMediaQuery('(max-width:470px)')
    const [selectedEquipmentNumber, setSelectedEquipmentNumber] = useState(equipmentDetails.number === 1 ? 1 : 0)
    const { measurementResults, isLoadingMeasurements, updateEquipmentMeasurementResults } =
        useEquipmentMeasurementResults()
    const {
        isOpen: isMeasurementModalOpen,
        openModal: onOpenMeasurementModal,
        closeModal: onCloseMeasurementModal,
    } = useModal()
    const myEquipmentStr = 'Mon équipement'
    const { labelTitle: equipmentLabel } =
        myEquipmentOptions.find((element) => element.name === equipmentDetails.name) || {}

    useEffect(() => {
        if (!isMeasurementModalOpen) updateEquipmentMeasurementResults()
    }, [isMeasurementModalOpen, updateEquipmentMeasurementResults])

    /**
     * The select onChange handler function.
     *
     * @param event The onChange event.
     */
    const handleSelectEquipmentChange: SelectOnChangeHandler = (event) => {
        setSelectedEquipmentNumber(event.target.value)
    }

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
                                    fontSize: max_width_600 ? 14 : 16,
                                }}
                            >
                                {formatMessage({
                                    id: myEquipmentStr,
                                    defaultMessage: myEquipmentStr,
                                })}
                            </InputLabel>
                            <Select
                                labelId="equipment-select-label"
                                id="equipment-select"
                                value={selectedEquipmentNumber}
                                label={formatMessage({
                                    id: myEquipmentStr,
                                    defaultMessage: myEquipmentStr,
                                })}
                                onChange={handleSelectEquipmentChange}
                                sx={{
                                    fontSize: max_width_600 ? 14 : 16,
                                }}
                                data-testid="equipment-select"
                            >
                                {Array(equipmentDetails.number)
                                    .fill(null)
                                    .map((_, index) => (
                                        <MenuItem
                                            value={index + 1}
                                            sx={{
                                                fontSize: max_width_600 ? 14 : 16,
                                            }}
                                        >{`${equipmentLabel} ${index + 1}`}</MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </div>
                )}

                {/* Measurement result list */}
                <div className="flex-1">
                    <EquipmentMeasurementResultsList
                        measurementModes={equipmentDetails.measurementModes}
                        housingEquipmentId={equipmentDetails.housingEquipmentId!}
                        equipmentsNumber={equipmentDetails.number}
                        equipmentNumber={selectedEquipmentNumber}
                        measurementResults={measurementResults}
                        isLoadingMeasurements={isLoadingMeasurements}
                        updateEquipmentMeasurementResults={updateEquipmentMeasurementResults}
                    />
                </div>

                {/* Buttons */}
                <div className={`flex ${max_width_470 ? 'flex-col' : 'flex-row'} justify-end gap-10 flex-wrap`}>
                    <Button variant="outlined" size="large" className={max_width_600 ? 'flex-1' : ''} disabled>
                        {formatMessage({
                            id: "Supprimer l'appareil",
                            defaultMessage: "Supprimer l'appareil",
                        })}
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        className={max_width_600 ? 'flex-1' : ''}
                        onClick={onOpenMeasurementModal}
                    >
                        {formatMessage({
                            id: "Mesurer l'appareil",
                            defaultMessage: "Mesurer l'appareil",
                        })}
                    </Button>
                </div>
            </div>

            <MicrowaveMeasurement
                housingEquipmentId={equipmentDetails.housingEquipmentId!}
                equipmentsNumber={equipmentDetails.number!}
                measurementModes={equipmentDetails.measurementModes!}
                isMeasurementModalOpen={isMeasurementModalOpen}
                onCloseMeasurementModal={onCloseMeasurementModal}
                defaultMicrowaveNumber={selectedEquipmentNumber}
                startMeasurementFromEquipmentsDetailsPage
            />
        </>
    )
}
