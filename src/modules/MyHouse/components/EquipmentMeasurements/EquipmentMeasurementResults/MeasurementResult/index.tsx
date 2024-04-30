import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { MeasurementResultProps } from 'src/modules/MyHouse/components/EquipmentMeasurements/EquipmentMeasurementResults/MeasurementResult/MeasurementResult'

/**
 * MeasurementResult compoonent (used only in this component).
 *
 * @param root0 N/A.
 * @param root0.handleClickingOnMeasurementResult Function that open the measurement modal on the result.
 * @param root0.handleClickingOnMeasurementButton Function that open the measurement modal to perform a new test.
 * @param root0.result The measurement result.
 * @param root0.isLoading The measurement result is loading.
 * @param root0.isMobileView We are in the mobile view.
 * @returns MeasurementResult JSX.
 */
export const MeasurementResult = ({
    handleClickingOnMeasurementResult,
    handleClickingOnMeasurementButton,
    result,
    isLoading,
    isMobileView,
}: MeasurementResultProps) =>
    isLoading ? (
        <CircularProgress size={isMobileView ? 15 : 16} />
    ) : result || result === 0 ? (
        <Button onClick={handleClickingOnMeasurementResult} variant="text" sx={{ fontSize: isMobileView ? 15 : 16 }}>
            {result}&nbsp;W
        </Button>
    ) : (
        <Button onClick={handleClickingOnMeasurementButton} variant="contained">
            Mesurer
        </Button>
    )
