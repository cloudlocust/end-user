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
import { useEquipmentMeasurementResults } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResultsList/EquipmentMeasurementResultsHook'

/**
 * MeasurementResult compoonent (used only in this component).
 *
 * @param root0 N/A.
 * @param root0.result The measurement result.
 * @param root0.isMobileView We are in the mobile view.
 * @returns MeasurementResult JSX.
 */
const MeasurementResult = ({ result, isMobileView }: MeasurementResultProps) =>
    result?.isLoading ? (
        <CircularProgress size={isMobileView ? 14 : 16} />
    ) : result?.value ? (
        <Button variant="text" sx={{ fontSize: isMobileView ? 14 : 16 }}>
            {result.value} W
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
    const { measurementResults } = useEquipmentMeasurementResults(equipmentNumber, housingEquipmentId, measurementModes)

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
                                >
                                    <MeasurementResult
                                        result={measurementResults[measurementMode]}
                                        isMobileView={max_width_600}
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
// 2h 30m
