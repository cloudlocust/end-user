import { useCallback, useState } from 'react'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useIntl } from 'src/common/react-platform-translation'
import { EquipmentMeasurementResultsProps } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResults/EquipmentMeasurementResults'
import { MicrowaveMeasurement } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement'
import { useModal } from 'src/hooks/useModal'
import { MeasurementResult } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResults/MeasurementResult'

/**
 * EquipmentMeasurementResults compoonent.
 *
 * @param root0 N/A.
 * @param root0.measurementModes The list of measurement modes for the equipment.
 * @param root0.housingEquipmentId The housing equipment id.
 * @param root0.equipmentsNumber The number of equipments.
 * @param root0.equipmentNumber The equipment number.
 * @param root0.measurementResults The measurement result values.
 * @param root0.isLoadingMeasurements The measurement result values is loading.
 * @param root0.updateEquipmentMeasurementResults Function to update the measurement result values.
 * @returns EquipmentMeasurementResults JSX.
 */
export const EquipmentMeasurementResults = ({
    measurementModes,
    housingEquipmentId,
    equipmentsNumber,
    equipmentNumber,
    measurementResults,
    isLoadingMeasurements,
    updateEquipmentMeasurementResults,
}: EquipmentMeasurementResultsProps) => {
    const { formatMessage } = useIntl()
    const MAX_WIDTH_600 = useMediaQuery('(max-width:600px)')
    const {
        isOpen: isMeasurementModalOpen,
        openModal: onOpenMeasurementModal,
        closeModal: onCloseMeasurementModal,
    } = useModal()
    const [measurementMode, setMeasurementMode] = useState('')
    const [measurementResult, setMeasurementResult] = useState<number | null>(null)

    const handleClickingOnMeasurementResult = useCallback(
        (measurementMode: string, result: number | null) => {
            setMeasurementMode(measurementMode)
            setMeasurementResult(result)
            onOpenMeasurementModal()
        },
        [onOpenMeasurementModal],
    )

    /**
     * Function to update the measurement results for the current equipment.
     */
    const updateCurrentEquipmentMeasurementResults = useCallback(() => {
        updateEquipmentMeasurementResults(equipmentNumber, housingEquipmentId, measurementModes!)
    }, [equipmentNumber, housingEquipmentId, measurementModes, updateEquipmentMeasurementResults])

    return measurementModes && measurementModes.length > 0 ? (
        <>
            <Typography variant="h5" className="text-18 sm:text-20 mb-20">
                {formatMessage({
                    id: 'Résultats des mesures',
                    defaultMessage: 'Résultats des mesures',
                })}
                &nbsp;:
            </Typography>

            <TableContainer component={Paper} elevation={3} data-testid="table-container">
                <Table size={MAX_WIDTH_600 ? 'small' : 'medium'}>
                    <TableBody>
                        {measurementModes.map((measurementMode) => (
                            <TableRow
                                hover
                                key={measurementMode}
                                sx={{
                                    '&:last-child td': { border: 0 },
                                }}
                            >
                                <TableCell align="left">
                                    <Typography className="text-15 sm:text-16 pl-0 sm:pl-52">
                                        {formatMessage({
                                            id: 'Mode',
                                            defaultMessage: 'Mode',
                                        })}{' '}
                                        {measurementMode}
                                    </Typography>
                                </TableCell>
                                <TableCell
                                    align="center"
                                    data-testid="measurement-result"
                                    className="h-60 sm:h-72"
                                    width="26%"
                                >
                                    <div className="min-w-64 sm:min-w-72 text-center">
                                        <MeasurementResult
                                            handleClickingOnMeasurementResult={() => {
                                                handleClickingOnMeasurementResult(
                                                    measurementMode,
                                                    measurementResults[measurementMode] || null,
                                                )
                                            }}
                                            result={measurementResults[measurementMode] || null}
                                            isLoading={isLoadingMeasurements}
                                            isMobileView={MAX_WIDTH_600}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {equipmentsNumber && (
                <MicrowaveMeasurement
                    housingEquipmentId={housingEquipmentId!}
                    equipmentsNumber={equipmentsNumber!}
                    measurementModes={measurementModes}
                    isMeasurementModalOpen={isMeasurementModalOpen}
                    onCloseMeasurementModal={onCloseMeasurementModal}
                    defaultMicrowaveNumber={equipmentNumber}
                    defaultMeasurementMode={measurementMode}
                    defaultMeasurementResult={measurementResult}
                    updateEquipmentMeasurementResults={updateCurrentEquipmentMeasurementResults}
                    showingOldResult
                />
            )}
        </>
    ) : null
}
