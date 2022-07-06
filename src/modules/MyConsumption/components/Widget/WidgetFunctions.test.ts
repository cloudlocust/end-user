import { IMetric } from 'src/modules/Metrics/Metrics'
import {
    computeTotalConsumption,
    getDataFromYAxis,
    computePMax,
    computeTemperature,
} from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'

describe('Test widget functions', () => {
    describe('test getDataFromYAxis function', () => {
        const expectedResult = [50, 50, 50]
        const data: IMetric[] = [
            {
                datapoints: [
                    [50, 1640995200000],
                    [50, 1641081600000],
                    [50, 1641168000000],
                ],
                target: 'consumption_metrics',
            },
        ]
        const result = getDataFromYAxis(data)
        expect(result).toStrictEqual(expectedResult)
    })

    describe('test computeTotalConsumption function', () => {
        test('when it returns W unit', () => {
            const expectedResult = {
                value: 50,
                unit: 'W',
            }
            const data: IMetric[] = [
                {
                    datapoints: [
                        [25, 1640995200000],
                        [25, 1641081600000],
                    ],
                    target: 'consumption_metrics',
                },
            ]
            const result = computeTotalConsumption(data)
            expect(result).toStrictEqual(expectedResult)
        })
        test('when it returns kVa unit', () => {
            const expectedResult = {
                value: 1,
                unit: 'kWh',
            }
            const data: IMetric[] = [
                {
                    datapoints: [
                        [500, 1640995200000],
                        [500, 1641081600000],
                    ],
                    target: 'consumption_metrics',
                },
            ]
            const result = computeTotalConsumption(data)
            expect(result).toStrictEqual(expectedResult)
        })
        test('when it returns MWh unit', () => {
            const expectedResult = {
                value: 1,
                unit: 'MWh',
            }
            const data: IMetric[] = [
                {
                    datapoints: [
                        [500_000, 1640995200000],
                        [500_000, 1641081600000],
                    ],
                    target: 'consumption_metrics',
                },
            ]
            const result = computeTotalConsumption(data)
            expect(result).toStrictEqual(expectedResult)
        })
    })

    describe('test computePMax function', () => {
        test('when it returns VA unit', () => {
            const expectedResult = {
                value: 50.5,
                unit: 'VA',
            }
            const data: IMetric[] = [
                {
                    datapoints: [
                        [20, 1640995200000],
                        [50.5, 1641081600000],
                    ],
                    target: 'enedis_max_power',
                },
            ]
            const result = computePMax(data)
            expect(result).toStrictEqual(expectedResult)
        })
        test('when it returns kVa unit', () => {
            const expectedResult = {
                value: 5,
                unit: 'kVa',
            }
            const data: IMetric[] = [
                {
                    datapoints: [
                        [500, 1640995200000],
                        [5000, 1641081600000],
                    ],
                    target: 'enedis_max_power',
                },
            ]
            const result = computePMax(data)
            expect(result).toStrictEqual(expectedResult)
        })
    })

    describe('test computeTemperature', () => {
        test('when it returns °C unit', () => {
            const expectedResult = {
                value: 38,
                unit: '°C',
            }
            const data: IMetric[] = [
                {
                    datapoints: [
                        [25, 1640995200000],
                        [50, 1641081600000],
                    ],
                    target: 'nrlink_internal_temperature_metrics',
                },
            ]
            const result = computeTemperature(data)
            expect(result).toStrictEqual(expectedResult)
        })
    })
})
