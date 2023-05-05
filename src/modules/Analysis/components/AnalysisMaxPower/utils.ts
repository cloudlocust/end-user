import convert from 'convert-units'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'

/**
 * Function that compute Pmax value and its corresponding timestamp.
 *
 * @param data Metric data.
 * @returns MaxValue and maxValueTimestamp.
 */
export const computePMaxWithTimestamp = (data: IMetric[]) => {
    let pmaxValue = 0
    let pmaxValueTimestamp = 0

    const pmaxMetric = data.find((elem) => elem.target === metricTargetsEnum.pMax)

    pmaxMetric?.datapoints.forEach(([value, timestamp]) => {
        if (Number(value) > pmaxValue) {
            pmaxValue = value
            pmaxValueTimestamp = timestamp
        }
    })

    if (pmaxValue > 999) {
        return {
            pmaxValue: Number(convert(pmaxValue).from('VA').to('kVA').toFixed(2)),
            pmaxValueTimestamp,
            unit: 'kVa',
        }
    }

    return { pmaxValue, pmaxValueTimestamp, pmaxUnit: 'VA' }
}
