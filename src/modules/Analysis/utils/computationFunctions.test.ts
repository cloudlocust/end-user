import { convertMetricsDataToChartsAxisValues } from 'src/modules/MyConsumption/utils/chartsDataConverter'
import { computationFunctionType } from 'src/modules/Analysis/analysisTypes.d'
import {
    computeMeanConsumption,
    computeMaxConsumption,
    computeMinConsumption,
    computePercentageChange,
    normalizeValues,
    computeStatisticsMetricsTargetData,
    distributeAmountPerMonth,
} from 'src/modules/Analysis/utils/computationFunctions'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { round } from 'lodash'
import dayjs from 'dayjs'

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
    let chartsValues = convertMetricsDataToChartsAxisValues(mockMetricsData)

    let result = computeMeanConsumption(chartsValues) as computationFunctionType
    expect(result).toEqual({
        value: valueMeanConsumption,
        unit: unitConsumption,
    })

    result = computeMaxConsumption(chartsValues) as computationFunctionType
    expect(result).toEqual({
        value: valueMaxConsumption,
        unit: unitConsumption,
        timestamp: timeStampMaxConsumption,
    })

    result = computeMinConsumption(chartsValues) as computationFunctionType
    expect(result).toEqual({
        value: valueMinConsumption,
        unit: unitConsumption,
        timestamp: timeStampMinConsumption,
    })

    // When metricsData is empty
    chartsValues = convertMetricsDataToChartsAxisValues([])

    result = computeMeanConsumption(chartsValues) as computationFunctionType
    expect(result).toEqual({
        value: emptyConsumption.value,
        unit: emptyConsumption.unit,
    })

    result = computeMaxConsumption(chartsValues) as computationFunctionType
    expect(result).toEqual(emptyConsumption)

    result = computeMinConsumption(chartsValues) as computationFunctionType
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
test('normalizeValues test with different cases', async () => {
    const values = [
        // Min value.
        10,
        // Middle value (represent the half of (max+min)).
        15,
        // Max Value
        20,
    ]

    const newMin = 100
    const newMax = 200
    const halfMinMax = (newMin + newMax) / 2
    // Test cases
    const cases = [
        // New min value
        newMin,
        // New Half value
        halfMinMax,
        // New Max Value
        newMax,
    ]
    const newValues = normalizeValues(values, newMin, newMax)
    cases.forEach((newValue, index) => {
        expect(newValues[index]).toStrictEqual(newValue)
    })
})

test('computeStatisticsMetricsTargetData test with different cases', async () => {
    // When data is not empty
    let chartsValues = convertMetricsDataToChartsAxisValues(mockMetricsData)

    let result = computeStatisticsMetricsTargetData(chartsValues, metricTargetsEnum.consumption, 'mean')
    expect(result).toEqual(valueMeanConsumption)

    result = computeStatisticsMetricsTargetData(chartsValues, metricTargetsEnum.consumption, 'maximum')
    expect(result).toEqual(valueMaxConsumption)

    result = computeStatisticsMetricsTargetData(chartsValues, metricTargetsEnum.consumption, 'minimum')
    expect(result).toEqual(valueMinConsumption)

    // When metricsData is empty
    chartsValues = convertMetricsDataToChartsAxisValues([])
    result = computeStatisticsMetricsTargetData(chartsValues, metricTargetsEnum.consumption, 'mean')
    expect(result).toEqual(emptyConsumption.value)
}, 20000)

describe('distributeAmountPerMonth', () => {
    it('should distribute amount correctly based on days of the month', () => {
        const amount = 4792
        const timestampForFebruary = dayjs('2023-02-01').valueOf() // February has 28 days in 2023
        const amountForFebruary = distributeAmountPerMonth(amount, timestampForFebruary)

        // Calculate expected amount for February
        const totalDaysIn2023 = 365 // Non-leap year
        const daysInFebruary = 28
        const expectedAmountForFebruary = round((amount / totalDaysIn2023) * daysInFebruary, 2)

        expect(amountForFebruary).toBe(expectedAmountForFebruary)
    })

    it('should distribute amount correctly for months with 31 days', () => {
        const amount = 4792
        const timestampForJuly = dayjs('2023-07-01').valueOf() // July has 31 days
        const amountForJuly = distributeAmountPerMonth(amount, timestampForJuly)

        // Calculate expected amount for July
        const totalDaysIn2023 = 365 // Non-leap year
        const daysInJuly = 31
        const expectedAmountForJuly = round((amount / totalDaysIn2023) * daysInJuly, 2)

        expect(amountForJuly).toBe(expectedAmountForJuly)
    })
})
