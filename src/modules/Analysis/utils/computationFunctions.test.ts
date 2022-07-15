import { convertMetricsDataToApexChartsAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { computationFunctionType } from 'src/modules/Analysis/analysisTypes.d'
import {
    computeMeanConsumption,
    computeMaxConsumption,
    computeMinConsumption,
} from 'src/modules/Analysis/utils/computationFunctions'
import { IMetric } from 'src/modules/Metrics/Metrics.d'

// eslint-disable-next-line jsdoc/require-jsdoc
const mockMetricsData: IMetric[] = [
    {
        // TODO FIX in 2427, change name to enum
        target: 'consumption_metrics',
        datapoints: [
            [10, 1640995200000],
            [20, 1641081600000],
        ],
    },
]

const valueMinConsumption = 10
const timeStampMinConsumption = 1640995200000

const valueMaxConsumption = 20
const timeStampMaxConsumption = 1641081600000

const valueMeanConsumption = Number('15.00')
const unitConsumption = 'Wh'

const emptyConsumption = {
    unit: unitConsumption,
    value: 0,
    timestamp: 0,
}
test('computeMeanConsumption test with different cases', async () => {
    // When data is not empty
    let apexChartsValues = convertMetricsDataToApexChartsAxisValues(mockMetricsData)

    let result = computeMeanConsumption(
        apexChartsValues.yAxisSeries[0].data as Array<number>,
    ) as computationFunctionType
    expect(result).toEqual({
        value: valueMeanConsumption,
        unit: unitConsumption,
    })

    result = computeMaxConsumption(apexChartsValues) as computationFunctionType
    expect(result).toEqual({
        value: valueMaxConsumption,
        unit: unitConsumption,
        timestamp: timeStampMaxConsumption,
    })

    result = computeMinConsumption(apexChartsValues) as computationFunctionType
    expect(result).toEqual({
        value: valueMinConsumption,
        unit: unitConsumption,
        timestamp: timeStampMinConsumption,
    })

    // When metricsData is empty
    apexChartsValues = convertMetricsDataToApexChartsAxisValues([])

    result = computeMeanConsumption([]) as computationFunctionType
    expect(result).toEqual({
        value: emptyConsumption.value,
        unit: emptyConsumption.unit,
    })

    result = computeMaxConsumption(apexChartsValues) as computationFunctionType
    expect(result).toEqual(emptyConsumption)

    result = computeMinConsumption(apexChartsValues) as computationFunctionType
    expect(result).toEqual(emptyConsumption)
}, 20000)
