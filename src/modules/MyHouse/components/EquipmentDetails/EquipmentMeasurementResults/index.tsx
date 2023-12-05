import { useIntl } from 'src/common/react-platform-translation'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import useMediaQuery from '@mui/material/useMediaQuery'
import { EquipmentMeasurementResultsProps } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResults/EquipmentMeasurementResults'
import { useEquipmentMeasurementResults } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResults/EquipmentMeasurementResultsHook'
import { MeasurementResult } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResults/MeasurementResult'

/**
 * EquipmentMeasurementResults compoonent that show the test results for a specific equipment.
 *
 * @param root0 N/A.
 * @param root0.measurementModes The list of measurement modes for the equipment.
 * @param root0.housingEquipmentId The global equipment id.
 * @param root0.equipmentNumber The equipment number.
 * @returns EquipmentMeasurementResults JSX.
 */
export const EquipmentMeasurementResults = ({
    measurementModes,
    housingEquipmentId,
    equipmentNumber,
}: EquipmentMeasurementResultsProps) => {
    const { formatMessage } = useIntl()
    const MAX_WIDTH_600 = useMediaQuery('(max-width:600px)')
    const { measurementResults } = useEquipmentMeasurementResults(equipmentNumber, housingEquipmentId, measurementModes)

    return measurementModes && measurementModes.length > 0 ? (
        <>
            <Typography variant="h5" fontSize={MAX_WIDTH_600 ? 17 : 20} marginBottom="20px">
                {formatMessage({
                    id: 'Résultats des mesures',
                    defaultMessage: 'Résultats des mesures',
                })}
                &nbsp;:
            </Typography>

            <TableContainer component={Paper} elevation={3} data-testid="table-container">
                <Table size={MAX_WIDTH_600 ? 'small' : 'medium'} sx={{ minWidth: 385 }}>
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
                                    <Typography fontSize={MAX_WIDTH_600 ? 14 : 16}>
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
                                    height={MAX_WIDTH_600 ? 60 : 73}
                                >
                                    <MeasurementResult
                                        result={measurementResults[measurementMode]}
                                        isMobileView={MAX_WIDTH_600}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    ) : null
}
