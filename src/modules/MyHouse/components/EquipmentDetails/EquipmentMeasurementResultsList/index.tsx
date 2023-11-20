import { useIntl } from 'src/common/react-platform-translation'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import useMediaQuery from '@mui/material/useMediaQuery'
import {
    EquipmentMeasurementResultsListProps,
    MeasurementResultProps,
} from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResultsList/EquipmentMeasurementResultsList'
import { MicrowaveMeasurement } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement'
import { useModal } from 'src/hooks/useModal'
import { useCallback, useEffect, useState } from 'react'

/**
 * MeasurementResult compoonent (used only in this component).
 *
 * @param root0 N/A.
 * @param root0.handleClickingOnMeasurementResult Function that open the measurement modal.
 * @param root0.result The measurement result.
 * @param root0.isLoading The measurement result is loading.
 * @param root0.isMobileView We are in the mobile view.
 * @returns MeasurementResult JSX.
 */
export const MeasurementResult = ({
    handleClickingOnMeasurementResult,
    result,
    isLoading,
    isMobileView,
}: MeasurementResultProps) =>
    isLoading ? (
        <CircularProgress size={isMobileView ? 14 : 16} />
    ) : result || result === 0 ? (
        <Button onClick={handleClickingOnMeasurementResult} variant="text" sx={{ fontSize: isMobileView ? 14 : 16 }}>
            {result} W
        </Button>
    ) : (
        <Typography color="primary" fontWeight={500} fontSize={isMobileView ? 14 : 16}>
            ?
        </Typography>
    )

/**
 * EquipmentMeasurementResultsList compoonent.
 *
 * @param root0 N/A.
 * @param root0.measurementModes The list of measurement modes for the equipment.
 * @param root0.housingEquipmentId The global equipment id.
 * @param root0.equipmentsNumber The number of equipments.
 * @param root0.equipmentNumber The equipment number.
 * @param root0.measurementResults The measurement result values.
 * @param root0.isLoadingMeasurements The measurement result values is loading.
 * @param root0.updateEquipmentMeasurementResults Function to update the measurement result values.
 * @returns EquipmentMeasurementResultsList JSX.
 */
export const EquipmentMeasurementResultsList = ({
    measurementModes,
    housingEquipmentId,
    equipmentsNumber,
    equipmentNumber,
    measurementResults,
    isLoadingMeasurements,
    updateEquipmentMeasurementResults,
}: EquipmentMeasurementResultsListProps) => {
    const { formatMessage } = useIntl()
    const max_width_600 = useMediaQuery('(max-width:600px)')
    const {
        isOpen: isMeasurementModalOpen,
        openModal: onOpenMeasurementModal,
        closeModal: onCloseMeasurementModal,
    } = useModal()
    const [measurementMode, setMeasurementMode] = useState('')
    const [measurementResult, setMeasurementResult] = useState<number | null>(null)

    const handleClickingOnMeasurementResult = useCallback(
        async (measurementMode: string, result: number | null) => {
            await setMeasurementMode(measurementMode)
            await setMeasurementResult(result)
            onOpenMeasurementModal()
        },
        [onOpenMeasurementModal],
    )

    useEffect(() => {
        if (!isMeasurementModalOpen)
            updateEquipmentMeasurementResults(equipmentNumber, housingEquipmentId, measurementModes!)
    }, [
        equipmentNumber,
        housingEquipmentId,
        isMeasurementModalOpen,
        measurementModes,
        updateEquipmentMeasurementResults,
    ])

    return measurementModes && measurementModes.length > 0 ? (
        <>
            <Typography variant="h5" fontSize={max_width_600 ? 17 : 20} marginBottom="20px">
                {formatMessage({
                    id: 'Résultats des mesures',
                    defaultMessage: 'Résultats des mesures',
                })}
                &nbsp;:
            </Typography>

            <TableContainer component={Paper} elevation={3} data-testid="table-container">
                <Table size={max_width_600 ? 'small' : 'medium'} sx={{ minWidth: 385 }}>
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
                                    <Typography fontSize={max_width_600 ? 14 : 16}>
                                        {formatMessage({
                                            id: 'Conso active mode',
                                            defaultMessage: 'Conso active mode',
                                        })}{' '}
                                        {measurementMode}&nbsp;:
                                    </Typography>
                                </TableCell>
                                <TableCell
                                    align="center"
                                    data-testid="measurement-result"
                                    height={max_width_600 ? 60 : 73}
                                    width="26%"
                                >
                                    <MeasurementResult
                                        handleClickingOnMeasurementResult={() => {
                                            handleClickingOnMeasurementResult(
                                                measurementMode,
                                                measurementResults[measurementMode] || null,
                                            )
                                        }}
                                        result={measurementResults[measurementMode]}
                                        isLoading={isLoadingMeasurements}
                                        isMobileView={max_width_600}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <MicrowaveMeasurement
                housingEquipmentId={housingEquipmentId!}
                equipmentsNumber={equipmentsNumber!}
                measurementModes={measurementModes}
                isMeasurementModalOpen={isMeasurementModalOpen}
                onCloseMeasurementModal={onCloseMeasurementModal}
                defaultMicrowaveNumber={equipmentNumber}
                defaultMeasurementMode={measurementMode}
                defaultMeasurementResult={measurementResult}
                showingOldResult
            />
        </>
    ) : null
}
