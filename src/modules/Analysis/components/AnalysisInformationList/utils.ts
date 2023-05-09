import { mean, round, sum } from 'lodash'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { getDataFromYAxis } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'

/**
 * Function that compute idle consumption average data.
 *
 * @param data Metrics data.
 * @returns Computed average of idle consumption.
 */
export const computeAverageIdleConssumption = (data: IMetric[]) => {
    let values: number[] = []
    if (data.length > 0) {
        values = getDataFromYAxis(data, metricTargetsEnum.idleConsumption)
        return round(mean(values.filter(Number)))
    }
}

/**
 * Function that compute idle consumption sum data.
 *
 * @param data Metrics data.
 * @returns Computed sum of idle consumption.
 */
export const computeSumIdleConsumption = (data: IMetric[]) => {
    let values: number[] = []
    if (data.length > 0) {
        values = getDataFromYAxis(data, metricTargetsEnum.idleConsumption)
        return sum(values.filter(Number))
    }
}
