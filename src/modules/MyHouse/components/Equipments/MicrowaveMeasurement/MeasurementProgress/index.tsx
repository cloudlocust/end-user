/* eslint-disable react-hooks/exhaustive-deps */
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import {
    MeasurementProgressProps,
    measurementStatusEnum,
} from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgress.d'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useMeasurementProgress } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgressHook'
import { formatDuration } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgressFunctions'

/**
 * MeasurementProgress component.
 *
 * @param root0 N/A.
 * @param root0.status Current status of the measurement process.
 * @param root0.maxDuration Estimated value for the maximum duration of the measurement process (in seconds).
 * @returns The MeasurementProgress component.
 */
export const MeasurementProgress = ({ status, maxDuration }: MeasurementProgressProps) => {
    const { remainingTime, circularProgressValue } = useMeasurementProgress(status, maxDuration)
    const theme = useTheme()
    const isSuccessOrFailedMeasurementStatus =
        status === measurementStatusEnum.success || status === measurementStatusEnum.failed

    const borderCircleStyle: React.CSSProperties = {
        content: '""',
        display: isSuccessOrFailedMeasurementStatus ? 'none' : 'block',
        borderRadius: '50%',
        border: `solid 1px ${theme.palette.primary.main}`,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
    }

    /**
     * Get the content to render depending on the status value.
     *
     * @returns The content to render.
     */
    const renderContent = () => {
        switch (status) {
            case measurementStatusEnum.inProgress:
                return <Typography>{formatDuration(remainingTime)}</Typography>
            case measurementStatusEnum.success:
                return <CheckCircleIcon color="success" sx={{ transform: 'scale(2.5)' }} />
            case measurementStatusEnum.failed:
                return <CancelIcon color="error" sx={{ transform: 'scale(2.5)' }} />
            default:
                return <TypographyFormatMessage>En attente</TypographyFormatMessage>
        }
    }

    return (
        <div
            className={`flex justify-center items-center ${
                isSuccessOrFailedMeasurementStatus ? 'h-128 w-128' : 'h-192 w-192'
            }`}
        >
            <CircularProgress
                value={status === measurementStatusEnum.inProgress ? circularProgressValue : 100}
                variant={!status || status === measurementStatusEnum.pending ? 'indeterminate' : 'determinate'}
                color={
                    status === measurementStatusEnum.success
                        ? 'success'
                        : status === measurementStatusEnum.failed
                        ? 'error'
                        : 'primary'
                }
                size={isSuccessOrFailedMeasurementStatus ? 128 : 180}
                thickness={3}
                sx={{
                    position: 'absolute',
                    '&::before': {
                        ...borderCircleStyle,
                        height: '180px',
                        width: '180px',
                    },
                    '&::after': {
                        ...borderCircleStyle,
                        height: '156px',
                        width: '156px',
                    },
                }}
            />
            {renderContent()}
        </div>
    )
}
