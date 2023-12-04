import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { MeasurementResultProps } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResults/MeasurementResult/MeasurementResult'

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
