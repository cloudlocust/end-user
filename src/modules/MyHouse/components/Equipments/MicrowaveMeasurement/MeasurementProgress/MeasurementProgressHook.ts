import { useState, useEffect } from 'react'
import { measurementStatusEnum } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgress.d'
import {
    calculateRemainingTime,
    calculateCircularProgressValue,
} from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgressFunctions'

/**
 * Hook that calculate the remainingTime and circularProgressValue for the MeasurementProgress component.
 *
 * @param status Current status of the measurement process.
 * @param maxDuration Estimated value for the maximum duration of the measurement process (in seconds).
 * @param getTimeFromLastUpdate Function to get the passed time (in seconds) from the last update of status.
 * @returns The states remainingTime and circularProgressValue.
 */
export const useMeasurementProgress = (
    status: measurementStatusEnum | null,
    maxDuration: number,
    getTimeFromLastUpdate: () => number,
) => {
    const [secondsCounter, setSecondsCounter] = useState(0)
    const [timeFromLastUpdate, setTimeFromLastUpdate] = useState(0)
    const [remainingTime, setRemainingTime] = useState(maxDuration)
    const [circularProgressValue, setCircularProgressValue] = useState(0)

    useEffect(() => {
        setTimeFromLastUpdate(getTimeFromLastUpdate())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status])

    useEffect(() => {
        let intervalId: NodeJS.Timer

        if (status === measurementStatusEnum.inProgress) {
            setSecondsCounter(0)
            intervalId = setInterval(() => {
                setSecondsCounter((oldValue) => oldValue + 1)
            }, 1000)
        } else {
            clearInterval(intervalId!)
        }

        return () => {
            clearInterval(intervalId!)
        }
    }, [status])

    useEffect(() => {
        const newRemainingTime = calculateRemainingTime(secondsCounter + timeFromLastUpdate, maxDuration)
        setCircularProgressValue(calculateCircularProgressValue(newRemainingTime, maxDuration))
        setRemainingTime((prevRemainingTime) =>
            newRemainingTime !== prevRemainingTime ? Math.ceil(newRemainingTime) : prevRemainingTime,
        )
    }, [maxDuration, secondsCounter, timeFromLastUpdate])

    return { remainingTime, circularProgressValue }
}
