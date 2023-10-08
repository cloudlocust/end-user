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
const MeasurementProgress = ({ status, maxDuration }: MeasurementProgressProps) => {
    const { remainingTime, circularProgressValue } = useMeasurementProgress(status, maxDuration)
    const theme = useTheme()

    const borderCircleStyle = {
        content: '""',
        display: status === measurementStatusEnum.success || status === measurementStatusEnum.failed ? 'none' : 'block',
        borderRadius: '50%',
        border: `solid 1px ${
            status === measurementStatusEnum.success
                ? theme.palette.success.main
                : status === measurementStatusEnum.failed
                ? theme.palette.error.main
                : theme.palette.primary.main
        }`,
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
            case measurementStatusEnum.pending:
                return <TypographyFormatMessage>En attente</TypographyFormatMessage>
            case measurementStatusEnum.inProgress:
                return <Typography>{formatDuration(remainingTime)}</Typography>
            case measurementStatusEnum.success:
                return <CheckCircleIcon color="success" sx={{ transform: 'scale(2.5)' }} />
            case measurementStatusEnum.failed:
                return <CancelIcon color="error" sx={{ transform: 'scale(2.5)' }} />
            default:
                return null
        }
    }

    return (
        <div className="flex justify-center items-center h-192 w-192">
            <CircularProgress
                value={status === measurementStatusEnum.inProgress ? circularProgressValue : 100}
                variant={status === measurementStatusEnum.pending ? 'indeterminate' : 'determinate'}
                color={
                    status === measurementStatusEnum.success
                        ? 'success'
                        : status === measurementStatusEnum.failed
                        ? 'error'
                        : 'primary'
                }
                size={180}
                thickness={3}
                sx={{
                    position: 'absolute',
                    '& > *': {
                        transform:
                            status === measurementStatusEnum.success || status === measurementStatusEnum.failed
                                ? 'scale(0.5)'
                                : 'scale(1)',
                        transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
                    },
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

export default MeasurementProgress
