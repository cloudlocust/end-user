import { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'src/common/react-platform-translation'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import LoadingButton from '@mui/lab/LoadingButton'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import useMediaQuery from '@mui/material/useMediaQuery'
import { getEquipmentMeasurementResult } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResultsList/utils'
import {
    EquipmentMeasurementResultsListProps,
    measurementResultsStateType,
} from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResultsList/EquipmentMeasurementResultsList'

/**
 * EquipmentMeasurementResultsList compoonent.
 *
 * @param root0 N/A.
 * @param root0.measurementModes The list of measurement modes for the equipment.
 * @param root0.housingEquipmentId The global equipment id.
 * @param root0.equipmentNumber The equipment number.
 * @returns EquipmentMeasurementResultsList JSX.
 */
export const EquipmentMeasurementResultsList = ({
    measurementModes,
    housingEquipmentId,
    equipmentNumber,
}: EquipmentMeasurementResultsListProps) => {
    const { formatMessage } = useIntl()
    const max_width_600 = useMediaQuery('(max-width:600px)')
    const [measurementResults, setMeasurementResults] = useState<measurementResultsStateType>({})

    /**
     * Function to update the measurement results value for the equipment.
     */
    const updateEquipmentMeasurementResults = useCallback(async () => {
        await setMeasurementResults({})
        measurementModes?.forEach(async (measurementMode) => {
            const resultValue = await getEquipmentMeasurementResult(
                measurementMode,
                housingEquipmentId!,
                equipmentNumber,
            )
            setMeasurementResults((currentResults) => ({
                ...currentResults,
                [measurementMode]: resultValue,
            }))
        })
    }, [equipmentNumber, housingEquipmentId, measurementModes])

    useEffect(() => {
        updateEquipmentMeasurementResults()
    }, [updateEquipmentMeasurementResults])

    return measurementModes && measurementModes.length > 0 ? (
        <>
            <Typography variant="h6" fontSize={max_width_600 ? 17 : 20} marginBottom="20px">
                {formatMessage({
                    id: 'Résultats des mesures',
                    defaultMessage: 'Résultats des mesures',
                })}
                &nbsp;:
            </Typography>

            <TableContainer component={Paper} elevation={3}>
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
                                <TableCell align="left">
                                    <LoadingButton
                                        sx={{ fontSize: max_width_600 ? 14 : 16 }}
                                        variant="text"
                                        loading={measurementResults[measurementMode] === undefined}
                                    >
                                        {measurementResults[measurementMode]
                                            ? `${measurementResults[measurementMode]} W`
                                            : '?'}
                                    </LoadingButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    ) : null
}
