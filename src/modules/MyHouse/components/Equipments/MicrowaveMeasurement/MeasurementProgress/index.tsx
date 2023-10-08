/* eslint-disable react-hooks/exhaustive-deps */
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import {
    MeasurementProgressProps,
    measurementStatusEnum,
} from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgress.d'
import { useEffect, useState } from 'react'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * MeasurementProgress component.
 *
 * @param root0 N/A.
 * @param root0.status Current status of the measurement process.
 * @param root0.maxDuration Estimated value for the maximum duration of the measurement process (in seconds).
 * @returns The MeasurementProgress component.
 */
const MeasurementProgress = ({ status, maxDuration }: MeasurementProgressProps) => {
    const [secondsCounter, setSecondsCounter] = useState(0)
    const [remainingTime, setRemainingTime] = useState(maxDuration)
    const [circularProgressValue, setCircularProgressValue] = useState(0)

    useEffect(() => {
        let intervalId: NodeJS.Timer | null = null

        if (status === measurementStatusEnum.inProgress) {
            intervalId = setInterval(() => {
                setSecondsCounter((oldValue) => oldValue + 1)
            }, 1000)
        } else {
            if (intervalId) {
                clearInterval(intervalId)
                intervalId = null
            }
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [status])

    /**
     * Calculate the time remaining until the end of the measurement.
     *
     * @param second The second value.
     * @returns The remaining time (in seconds).
     */
    const calculateRemainingTime = (second: number): number => {
        const linear = maxDuration - second
        const expo = maxDuration * Math.exp((-2.5 * second) / maxDuration)
        return Math.max(linear, expo)
    }

    /**
     * Calculate the value prop for the CircularProgress component.
     *
     * @param remainingSeconds Remaining time until the end of the measurement.
     * @returns The CircularProgress value prop.
     */
    const calculateCircularProgressValue = (remainingSeconds: number): number => {
        return 100 - (100 * remainingSeconds) / maxDuration
    }

    useEffect(() => {
        const newRemainingTime = calculateRemainingTime(secondsCounter)
        setCircularProgressValue(calculateCircularProgressValue(newRemainingTime))
        if (newRemainingTime !== remainingTime) setRemainingTime(Math.ceil(newRemainingTime))
    }, [secondsCounter])

    /**
     * Format the seconds value duration to mm:ss fomat.
     *
     * @param durationInSeconds Duration in seconds.
     * @returns Formated duration.
     */
    const formatDuration = (durationInSeconds: number): string => {
        const minutes = Math.floor(durationInSeconds / 60)
        const seconds = durationInSeconds % 60
        const formattedMinutes = String(minutes).padStart(2, '0')
        const formattedSeconds = String(seconds).padStart(2, '0')
        return `${formattedMinutes} : ${formattedSeconds}`
    }

    /**
     * Get the content to render in the middle of the progress circle depending on the status value.
     *
     * @returns The content to render.
     */
    const renderContent = () => {
        switch (status) {
            case measurementStatusEnum.pending:
                return <TypographyFormatMessage>En attente</TypographyFormatMessage>
            case measurementStatusEnum.inProgress:
                return <h4>{formatDuration(remainingTime)}</h4>
            case measurementStatusEnum.success:
                return <CheckCircleIcon color="success" sx={{ transform: 'scale(2.5)' }} />
            case measurementStatusEnum.failed:
                return <CancelIcon color="error" sx={{ transform: 'scale(2.5)' }} />
            default:
                return null
        }
    }

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
