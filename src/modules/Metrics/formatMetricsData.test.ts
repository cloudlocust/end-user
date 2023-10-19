import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { formatMetricsDataToTimestampsValues } from 'src/modules/Metrics/formatMetricsData'

describe('getTotalOffIdleConsumptionData test with different cases', () => {
    test('different cases', () => {
        const caseList = [
            // Null and zero values
            {
                data: [
                    {
                        target: metricTargetsEnum.consumption,
                        datapoints: [
                            [null, 10001],
                            [null, 10002],
                            [null, 10003],
                            [null, 10004],
                        ],
                    },
                    {
                        target: metricTargetsEnum.idleConsumption,
                        datapoints: [
                            [0, 10001],
                            [0, 10002],
                            [0, 10003],
                            [0, 10004],
                        ],
                    },
                ],
                expectedResult: {
                    values: {
                        [metricTargetsEnum.consumption]: [null, null, null, null],
                        [metricTargetsEnum.idleConsumption]: [0, 0, 0, 0],
                    },
                    timestamps: {
                        [metricTargetsEnum.consumption]: [10001, 10002, 10003, 10004],
                        [metricTargetsEnum.idleConsumption]: [10001, 10002, 10003, 10004],
                    },
                },
            },
            // Different values.
            {
                data: [
                    {
                        target: metricTargetsEnum.consumption,
                        datapoints: [
                            [null, 10001],
                            [130, 10002],
                            [55, 10003],
                            [800, 10004],
                        ],
                    },
                    {
                        target: metricTargetsEnum.pMax,
                        datapoints: [
                            [0, 10001],
                            [30, 10002],
                            [33, 10003],
                            [null, 10004],
                        ],
                    },
                    {
                        target: metricTargetsEnum.internalTemperature,
                        datapoints: [
                            [0, 10001],
                            [30, 10002],
                            [32, 10003],
                            [null, 10004],
                        ],
                    },
                ],
                expectedResult: {
                    values: {
                        [metricTargetsEnum.consumption]: [null, 130, 55, 800],
                        [metricTargetsEnum.pMax]: [0, 30, 33, null],
                        [metricTargetsEnum.internalTemperature]: [0, 30, 32, null],
                    },
                    timestamps: {
                        [metricTargetsEnum.consumption]: [10001, 10002, 10003, 10004],
                        [metricTargetsEnum.pMax]: [10001, 10002, 10003, 10004],
                        [metricTargetsEnum.internalTemperature]: [10001, 10002, 10003, 10004],
                    },
                },
            },
        ]
        caseList.forEach(({ data, expectedResult }) => {
            const result = formatMetricsDataToTimestampsValues(data as IMetric[])
            expect(result).toStrictEqual(expectedResult)
        })
    })
})
