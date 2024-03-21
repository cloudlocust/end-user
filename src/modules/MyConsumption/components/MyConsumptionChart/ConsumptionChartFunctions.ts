/**
 * Check the presence of value in the given datapoints of metrics on each time point.
 *
 * @param datapointsOfMetrics - An array of arrays representing the datapoints for each metric at each time point.
 * @returns An array of tuples, where the first element is a boolean indicating whether the value is null,
 *          and the second element is the corresponding time point.
 * @example
 * when the input is
 * [
 *      [[null, 1709856000000], [null, 1709856060000], [null, 1709856120000], [4, 1709856180000]],
 *      [[5, 1709856000000],    [null, 1709856060000], [null, 1709856120000], [8, 1709856180000]],
 *      [[9, 1709856000000],    [null, 1709856060000], [null, 1709856120000], [null, 1709856180000]],
 * ]
 *
 * the output should be
 * [[true, 1709856000000], [false, 1709856060000], [false, 1709856120000], [true, 1709856180000]]
 */
export const checkMissingDataList = (datapointsOfMetrics: number[][][]): [boolean, number][] => {
    // If the input array is empty, return an empty array
    if (!datapointsOfMetrics.length) return []
    // Map all the time points and return an array of tuples indicating whether a value is null for each time point
    return datapointsOfMetrics[0].map(([_value, time], index) => {
        // Map all the metrics at the current time point.
        for (const datapointsOfMetric of datapointsOfMetrics) {
            // If the value is not null, return true and the time point
            if (datapointsOfMetric[index][0] !== null) return [true, time]
        }
        // If the value is null, return false and the time point
        return [false, time]
    })
}

/**
 * Calculates the maximum time between successive missing values in the given datapoints of metrics.
 *
 * @param datapointsOfMetrics - The datapoints of metrics to analyze.
 * @returns The maximum time between successive missing values in minutes.
 */
export const getMaxTimeBetweenSuccessiveMissingValue = (datapointsOfMetrics: number[][][]): number => {
    // suppose that the max time between successive null value is 0
    let maxTimeBetweenSuccessiveNullValue = 0
    // check if the metrics have missing data int time points.
    const datapointsOfMetricsPresenceStatus = checkMissingDataList(datapointsOfMetrics)
    // calculate the time between successive null value
    const deltaTime = datapointsOfMetricsPresenceStatus[1][1] - datapointsOfMetricsPresenceStatus[0][1]
    let timeBetweenSuccessiveNullValue = 0
    // iterate over the data to find the max time between successive null value
    for (const [value] of datapointsOfMetricsPresenceStatus) {
        // if the value is false, increment the time between successive null value
        if (value === false) {
            timeBetweenSuccessiveNullValue += deltaTime
            if (timeBetweenSuccessiveNullValue > maxTimeBetweenSuccessiveNullValue) {
                maxTimeBetweenSuccessiveNullValue = timeBetweenSuccessiveNullValue
            }
            // if the value is true, reset the time between successive null value
        } else if (timeBetweenSuccessiveNullValue !== 0) {
            timeBetweenSuccessiveNullValue = 0
        }
    }
    // return the max time between successive null value in minutes
    return maxTimeBetweenSuccessiveNullValue / 1000 / 60
}
