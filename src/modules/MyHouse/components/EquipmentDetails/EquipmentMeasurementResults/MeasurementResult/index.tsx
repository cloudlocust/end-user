import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { MeasurementResultProps } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResults/MeasurementResult/MeasurementResult'

/**
 * MeasurementResult compoonent (used only in this component).
 *
 * @param root0 N/A.
 * @param root0.result The measurement result.
 * @param root0.isMobileView We are in the mobile view.
 * @returns MeasurementResult JSX.
 */
export const MeasurementResult = ({ result, isMobileView }: MeasurementResultProps) =>
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
