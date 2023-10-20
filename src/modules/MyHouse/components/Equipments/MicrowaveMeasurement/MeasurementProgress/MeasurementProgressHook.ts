import { useState, useEffect, useRef } from 'react'
import { measurementStatusEnum } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgress.d'
import {
    calculateRemainingTime,
    calculateCircularProgressValue,
} from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgressFunctions'

/**
 * Hook that calculate "remainingTime" and "circularProgressValue" for the MeasurementProgress component.
 * - remainingTime : Time remaining before the end of the measurement process.
 * - circularProgressValue : value between 0 and 100 that represent the progress percentage for
 * the CircularProgress component.
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
    const intervalIdRef = useRef<NodeJS.Timer | null>(null)

    useEffect(() => {
        setTimeFromLastUpdate(getTimeFromLastUpdate())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status])

    /**
     * This useEffect implements the seconds counter used for calculating "remainingTime"
     * and "circularProgressValue".
     */
    useEffect(() => {
        if (status === measurementStatusEnum.inProgress) {
            setSecondsCounter(0)
            /**
             * When the status changes to the value IN_PROGRESS, an interval is created to increment
             * the secondsCounter counter every second.
             */
            intervalIdRef.current = setInterval(() => {
                setSecondsCounter((oldValue) => oldValue + 1)
            }, 1000)
        } else {
            /**
             * When the status changes to a value other than IN_PROGRESS, the interval already created
             * will be cleared.
             */
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current)
                intervalIdRef.current = null
            }
        }
    }, [status])

    /**
     * In this useEffect, we calculate "remainingTime" and "circularProgressValue" and update their status.
     */
    useEffect(() => {
        const newRemainingTime = calculateRemainingTime(secondsCounter + timeFromLastUpdate, maxDuration)
        setCircularProgressValue(calculateCircularProgressValue(newRemainingTime, maxDuration))

        /**
         * We don't always update the value of "remainingTime", because when its value approaches zero,
         * the rate of decrease of "remainingTime" will be reduced, so it's possible for remainingTime
         * to have kept the same value for two successive seconds (the idea behind this is explained
         * in the definition of the "calculateRemainingTime" function).
         */
        setRemainingTime((prevRemainingTime) =>
            newRemainingTime !== prevRemainingTime ? Math.ceil(newRemainingTime) : prevRemainingTime,
        )
    }, [maxDuration, secondsCounter, timeFromLastUpdate])

    return { remainingTime, circularProgressValue }
}
