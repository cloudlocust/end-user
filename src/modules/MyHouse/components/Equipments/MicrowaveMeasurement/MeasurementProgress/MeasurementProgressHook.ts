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
 * @returns The states remainingTime and circularProgressValue.
 */
export const useMeasurementProgress = (status: measurementStatusEnum, maxDuration: number) => {
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

    useEffect(() => {
        const newRemainingTime = calculateRemainingTime(secondsCounter, maxDuration)
        setCircularProgressValue(calculateCircularProgressValue(newRemainingTime, maxDuration))
        setRemainingTime((prevRemainingTime) =>
            newRemainingTime !== prevRemainingTime ? Math.ceil(newRemainingTime) : prevRemainingTime,
        )
    }, [maxDuration, secondsCounter])

    return { remainingTime, circularProgressValue }
}
