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
export const useMeasurementProgress = (status: measurementStatusEnum | null, maxDuration: number) => {
    const [secondsCounter, setSecondsCounter] = useState(0)
    const [remainingTime, setRemainingTime] = useState(maxDuration)
    const [circularProgressValue, setCircularProgressValue] = useState(0)

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
        const newRemainingTime = calculateRemainingTime(secondsCounter, maxDuration)
        setCircularProgressValue(calculateCircularProgressValue(newRemainingTime, maxDuration))
        setRemainingTime((prevRemainingTime) =>
            newRemainingTime !== prevRemainingTime ? Math.ceil(newRemainingTime) : prevRemainingTime,
        )
    }, [maxDuration, secondsCounter])

    return { remainingTime, circularProgressValue }
}
