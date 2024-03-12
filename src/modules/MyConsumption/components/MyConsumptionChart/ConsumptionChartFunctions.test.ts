import {
    checkMissingData,
    getMaxTimeBetweenSuccessiveMissingValue,
} from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartFunctions'

let datapointsOfMetrics = [
    [
        [null, 1709856000000],
        [null, 1709856060000],
        [null, 1709856120000],
        [4, 1709856180000],
    ],
    [
        [5, 1709856000000],
        [null, 1709856060000],
        [null, 1709856120000],
        [8, 1709856180000],
    ],
    [
        [9, 1709856000000],
        [null, 1709856060000],
        [null, 1709856120000],
        [null, 1709856180000],
    ],
] as number[][][]

describe('ConsumptionChartFunctions test', () => {
    // Should return an array of tuples with the same length as the input array
    it('should return an array of tuples with the same length as the input array when given a non-empty input array', () => {
        const result = checkMissingData(datapointsOfMetrics)
        expect(result.length).toBe(datapointsOfMetrics[0].length)
    })

    it('should return an empty array when given an empty input array', () => {
        const datapointsOfMetrics: number[][][] = []
        const result = checkMissingData(datapointsOfMetrics)
        expect(result.length).toBe(0)
    })

    it('should return the correct data', () => {
        const result = checkMissingData(datapointsOfMetrics)
        expect(result).toStrictEqual([
            [true, 1709856000000],
            [false, 1709856060000],
            [false, 1709856120000],
            [true, 1709856180000],
        ])
    })

    it('should return 2min the maximum time between successive missing values when given valid input', () => {
        const result = getMaxTimeBetweenSuccessiveMissingValue(datapointsOfMetrics)
        expect(result).toBe(2)
    })

    it('should return 0min when there are no missing values', () => {
        datapointsOfMetrics = datapointsOfMetrics.map((item, index) =>
            index === 0 ? item : item.map(([_value, time]) => [1, time]),
        )
        const result = getMaxTimeBetweenSuccessiveMissingValue(datapointsOfMetrics)
        expect(result).toBe(0)
    })
})
