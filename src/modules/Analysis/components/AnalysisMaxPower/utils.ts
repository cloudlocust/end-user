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
    let datapoints: number[][] = []

    const pmaxMetric = data.filter((elem) => elem.target === metricTargetsEnum.pMax)

    if (pmaxMetric[0]) {
        const entries = Object.entries(pmaxMetric[0])
        for (const [key, objValue] of entries) {
            if (key === 'datapoints' && typeof objValue === 'object') {
                datapoints = objValue
            }
        }
    }

    datapoints.forEach(([value, timestamp]) => {
        if (value > pmaxValue) {
            pmaxValue = value
            pmaxValueTimestamp = timestamp
        }
    })

    if (pmaxValue > 999) {
        return {
            maxValue: Number(convert(pmaxValue).from('VA').to('kVA').toFixed(2)),
            pmaxValueTimestamp,
            unit: 'kVa',
        }
    }

    return { pmaxValue, pmaxValueTimestamp, pmaxUnit: 'VA' }
}
