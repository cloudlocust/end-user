/**
 * Calculate the time remaining until the end of the measurement. We have used a combination
 * of linear and exponential functions to ensure that the time remaining never reaches
 * the value 0. In this way, the user won't worry if he sees that the time remaining has
 * become 0 and the process is still running in the case where there has been a delay
 * in the measurement process.
 *
 * @param second The second value.
 * @param maxDuration Estimated value for the maximum duration of the measurement process (in seconds).
 * @returns The remaining time (in seconds).
 */
export const calculateRemainingTime = (second: number, maxDuration: number): number => {
    const linear = maxDuration - second
    const expo = maxDuration * Math.exp((-2.5 * second) / maxDuration)
    return Math.max(linear, expo)
}

/**
 * Calculate the value prop for the MUI CircularProgress component, which is a value between 0 and 100
 * that represent the progress percentage for the CircularProgress component. This value is inversely
 * proportional to the remainingSeconds value :
 *  / if (remainingSeconds == maxDuration)   ==>   value == 0
 *  \ if (remainingSeconds == 0          )   ==>   value == 100     .
 *
 * @param remainingSeconds Remaining time until the end of the measurement.
 * @param maxDuration Estimated value for the maximum duration of the measurement process (in seconds).
 * @returns The CircularProgress value prop.
 */
export const calculateCircularProgressValue = (remainingSeconds: number, maxDuration: number): number => {
    return 100 - (100 * remainingSeconds) / maxDuration
}

/**
 * Format the seconds value duration to mm:ss fomat.
 *
 * @param durationInSeconds Duration in seconds.
 * @returns Formated duration.
 */
export const formatDuration = (durationInSeconds: number): string => {
    const minutes = Math.floor(durationInSeconds / 60)
    const seconds = durationInSeconds % 60
    const formattedMinutes = String(minutes).padStart(2, '0')
    const formattedSeconds = String(seconds).padStart(2, '0')
    return `${formattedMinutes} : ${formattedSeconds}`
}
