/**
 * Returns an array of tuples indicating whether a value is null for each time point.
 *
 * @param datapointsOfMetrics - An array of arrays representing the datapoints for each metric at each time point.
 * @returns An array of tuples, where the first element is a boolean indicating whether the value is null,
 *          and the second element is the corresponding time point.
 */
export const checkMissingData = (datapointsOfMetrics: number[][][]): [boolean, number][] => {
    if (!datapointsOfMetrics.length) return []
    return datapointsOfMetrics[0].map(([_value, time], index) => {
        for (const datapointsOfMetric of datapointsOfMetrics) {
            if (datapointsOfMetric[index][0] !== null) return [true, time]
        }
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
    let maxTimeBetweenSuccessiveNullValue = 0
    const data = checkMissingData(datapointsOfMetrics)
    const deltaTime = data[1][1] - data[0][1]
    let timeBetweenSuccessiveNullValue = 0
    for (const [value] of data) {
        if (value === false) {
            timeBetweenSuccessiveNullValue += deltaTime
            if (timeBetweenSuccessiveNullValue > maxTimeBetweenSuccessiveNullValue) {
                maxTimeBetweenSuccessiveNullValue = timeBetweenSuccessiveNullValue
            }
        } else if (timeBetweenSuccessiveNullValue !== 0) {
            timeBetweenSuccessiveNullValue = 0
        }
    }
    return maxTimeBetweenSuccessiveNullValue / 1000 / 60
}
