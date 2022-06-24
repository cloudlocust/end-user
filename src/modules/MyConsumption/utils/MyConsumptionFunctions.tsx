import { metricFiltersType } from 'src/modules/Metrics/Metrics'

/**
 * FormatMetricFilter function converts the data to the required format.
 *
 * @param valueGuid Meter guid.
 * @returns Formated meter data.
 */
export const formatMetricFilter = (valueGuid: string) => {
    return [
        {
            key: 'meter_guid',
            operator: '=',
            value: valueGuid,
        },
    ] as metricFiltersType
}

/**
 * Function that calculate the sum of an array of numbers.
 *
 * @param values Array of values.
 * @returns The sum of all the values.
 */
export const calculateSum = (values: number[]) => {
    let sum = 0
    values.forEach((val) => (sum += val))

    return sum
}

/**
 * Function that returns the average of an array of numbers.
 *
 * @param values Array of values.
 * @returns The average of the array.
 */
export const calculateAverage = (values: number[]) => {
    let sum = 0
    let average = 0
    values.forEach((val) => (sum += val))
    average = sum / values.length

    return Math.round(average)
}

/**
 * Function that returns the max number of an array.
 *
 * @param values Array of values.
 * @returns Max number of the array.
 */
export const calculateMaxNumber = (values: number[]) => {
    return Math.max(...values)
}
