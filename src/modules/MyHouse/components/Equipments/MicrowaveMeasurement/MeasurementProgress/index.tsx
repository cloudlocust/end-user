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
 * @param root0.getTimeFromLastUpdate Function to get the passed time (in seconds) from the last update of status.
 * @returns The MeasurementProgress component.
 */
export const MeasurementProgress = ({ status, maxDuration, getTimeFromLastUpdate }: MeasurementProgressProps) => {
    const { remainingTime, circularProgressValue } = useMeasurementProgress(status, maxDuration, getTimeFromLastUpdate)
    const theme = useTheme()
    const successOrFailed = status === measurementStatusEnum.SUCCESS || status === measurementStatusEnum.FAILED

    const borderCircleStyle: React.CSSProperties = {
        content: '""',
        display: successOrFailed ? 'none' : 'block',
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
            case measurementStatusEnum.IN_PROGRESS:
                return <Typography>{formatDuration(remainingTime)}</Typography>
            case measurementStatusEnum.SUCCESS:
                return <CheckCircleIcon color="success" sx={{ transform: 'scale(2.5)' }} />
            case measurementStatusEnum.FAILED:
                return <CancelIcon color="error" sx={{ transform: 'scale(2.5)' }} />
            default:
                return <TypographyFormatMessage>En attente</TypographyFormatMessage>
        }
    }

    return (
        <div className={`flex justify-center items-center ${successOrFailed ? 'h-128 w-128' : 'h-192 w-192'}`}>
            <CircularProgress
                value={status === measurementStatusEnum.IN_PROGRESS ? circularProgressValue : 100}
                variant={!status || status === measurementStatusEnum.PENDING ? 'indeterminate' : 'determinate'}
                color={
                    status === measurementStatusEnum.SUCCESS
                        ? 'success'
                        : status === measurementStatusEnum.FAILED
                        ? 'error'
                        : 'primary'
                }
                size={successOrFailed ? 128 : 180}
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
