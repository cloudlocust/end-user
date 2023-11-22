import { IMetric } from 'src/modules/Metrics/Metrics'
import dayjs from 'dayjs'

/**
 * Function that finds the last non nullable datapoint.
 *
 * @param data Metrics data.
 * @returns Datapoint with its timestamp.
 */
export function findLastNonNullableDatapoint(data: IMetric[]) {
    if (!data.length) {
        return null
    }

    const datapoints = data[0].datapoints
    const SIX_MINUTES_IN_MILLISECONDS = 6 * 60 * 1000 // 6 minutes in milliseconds
    const currentTimestamp = dayjs().valueOf() // Current time in milliseconds

    for (let i = datapoints.length - 1; i >= 0; i--) {
        if (datapoints[i][0] !== null && datapoints[i][0] !== undefined) {
            const lastDataTimestamp = datapoints[i][1]
            const lastDataValue = datapoints[i][0]

            const timeDifference = currentTimestamp - lastDataTimestamp

            // Check if the time difference is more than 6 minutes
            if (timeDifference > SIX_MINUTES_IN_MILLISECONDS) {
                return {
                    message: 'No data received for more than 6 minutes',
                    timestamp: lastDataTimestamp,
                    value: lastDataValue,
                }
            }

            return {
                message: 'Data received within 6 minutes',
                timestamp: lastDataTimestamp,
                value: lastDataValue,
            }
        }
    }

    return null
}
