import {
    computeAverageIdleConssumption,
    computeSumIdleConsumption,
} from 'src/modules/Analysis/components/AnalysisInformationList/utils'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'

// need to mock this because myHouseConfig uses it
jest.mock('src/modules/MyHouse/utils/MyHouseHooks.ts', () => ({
    ...jest.requireActual('src/modules/MyHouse/utils/MyHouseHooks.ts'),
    //eslint-disable-next-line
    arePlugsUsedBasedOnProductionStatus: () => true,
}))

describe('test computeAverageIdleConssumption', () => {
    test('when no null values in datapoints', () => {
        // Hardcoded because datapoints are randomly generated in mock.
        // 0 Indicates the timestamp in order to simply the test.
        let mockData: IMetric[] = [
            {
                datapoints: [
                    [2, 0],
                    [4, 0],
                    [6, 0],
                    [8, 0],
                ],
                target: metricTargetsEnum.idleConsumption,
            },
        ]
        const result = computeAverageIdleConssumption(mockData)
        expect(result).toBe(5)
    })
    test('when datapoints has null values', () => {
        // Hardcoded because datapoints are randomly generated in mock.
        // 0 Indicates the timestamp in order to simply the test.
        let mockData = [
            {
                datapoints: [
                    [null, 0],
                    [2, 0],
                    [null, 0],
                    [2, 0],
                ],
                target: metricTargetsEnum.idleConsumption,
            },
        ]
        const result = computeAverageIdleConssumption(mockData as IMetric[])
        expect(result).toBe(2)
    })
})

describe('computeSumIdleConsumption test', () => {
    test('when no null values in datapoints', () => {
        // Hardcoded because datapoints are randomly generated in mock.
        // 0 Indicates the timestamp in order to simply the test.
        let mockData: IMetric[] = [
            {
                datapoints: [
                    [2, 0],
                    [2, 0],
                    [2, 0],
                    [2, 0],
                ],
                target: metricTargetsEnum.idleConsumption,
            },
        ]
        const result = computeSumIdleConsumption(mockData)
        expect(result).toBe(8)
    })
    test('when datapoints has null values', () => {
        // Hardcoded because datapoints are randomly generated in mock.
        // 0 Indicates the timestamp in order to simply the test.
        let mockData = [
            {
                datapoints: [
                    [null, 0],
                    [2, 0],
                    [null, 0],
                    [2, 0],
                ],
                target: metricTargetsEnum.idleConsumption,
            },
        ]
        const result = computeSumIdleConsumption(mockData as IMetric[])
        expect(result).toBe(4)
    })
})
