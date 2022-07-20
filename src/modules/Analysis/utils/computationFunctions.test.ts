import { convertMetricsDataToApexChartsAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { computationFunctionType } from 'src/modules/Analysis/analysisTypes.d'
import {
    computeMeanConsumption,
    computeMaxConsumption,
    computeMinConsumption,
    computePercentageChange,
} from 'src/modules/Analysis/utils/computationFunctions'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'

// eslint-disable-next-line jsdoc/require-jsdoc
const mockMetricsData: IMetric[] = [
    {
        target: metricTargetsEnum.consumption,
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

test('computePercentageChange test with different cases', async () => {
    // When data is not empty
    const cases = [
        // Increase percentage change
        {
            oldValue: 100,
            newValue: 150,
            increase: true,
            decrease: false,
            result: 50,
        },
        // Decrease percentage change
        {
            oldValue: 200,
            newValue: 100,
            increase: false,
            decrease: true,
            result: -50,
        },
        // No percentage change
        {
            oldValue: 100,
            newValue: 100,
            decrease: false,
            increase: false,
            result: -0,
        },
    ]

    cases.forEach(({ oldValue, newValue, increase, decrease, result }) => {
        const percentage = computePercentageChange(oldValue, newValue)
        expect(percentage < 0).toEqual(decrease)
        expect(percentage > 0).toEqual(increase)
        expect(percentage).toEqual(result)
    })
}, 20000)
