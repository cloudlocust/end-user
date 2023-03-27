import convert from 'convert-units'
import { IMetric } from 'src/modules/Metrics/Metrics.d'

/**
 * Function that compute Pmax value and its corresponding timestamp.
 *
 * @param data Metric data.
 * @returns MaxValue and maxValueTimestamp.
 */
export const conputePMaxWithTimestamp = (data: IMetric) => {
    let maxValue = 0
    let maxValueTimestamp = 0

    data['datapoints'].forEach(([value, timestamp]) => {
        if (value > maxValue) {
            maxValue = value
            maxValueTimestamp = timestamp
        }
    })

    if (maxValue > 999) {
        return {
            maxValue: Number(convert(maxValue).from('VA').to('kVA').toFixed(2)),
            maxValueTimestamp,
            unit: 'kVa',
        }
    }

    return { maxValue, maxValueTimestamp, unit: 'VA' }
}
