import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import {
    computeTotalConsumption,
    getDataFromYAxis,
    computePMax,
    computeInternallTemperature,
    computeTotalEuros,
    computeExternalTemperature,
    computeWidgetAssets,
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
        const result = getDataFromYAxis(data, 'consumption_metrics')
        expect(result).toStrictEqual(expectedResult)
    })

    describe('test computeTotalConsumption function', () => {
        test('when it returns W unit', () => {
            const expectedResult = {
                value: 50,
                unit: 'Wh',
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
                        [25.1, 1640995200000],
                        [50.1, 1641081600000],
                        [NaN, 1641081600000],
                        [NaN, 1641081600000],
                    ],
                    target: 'nrlink_internal_temperature_metrics',
                },
                {
                    datapoints: [
                        [25.1, 1640995200000],
                        [50.1, 1641081600000],
                        [NaN, 1641081600000],
                        [NaN, 1641081600000],
                    ],
                    target: metricTargetsEnum.externalTemperature,
                },
            ]
            const resultInternalTemperature = computeInternallTemperature(data)
            expect(resultInternalTemperature).toStrictEqual(expectedResult)
            const resultExternalTemperature = computeExternalTemperature(data)
            expect(resultExternalTemperature).toStrictEqual(expectedResult)
        })
    })

    describe('test computeTotalEuros', () => {
        test('when it returns € unit', () => {
            const val = 70
            const expectedResult = {
                value: val.toFixed(2),
                unit: '€',
            }
            const data: IMetric[] = [
                {
                    datapoints: [
                        [20, 1640995200000],
                        [50, 1641081600000],
                        [0, 1641081600000],
                    ],
                    target: metricTargetsEnum.eurosConsumption,
                },
            ]
            const result = computeTotalEuros(data)
            expect(result).toStrictEqual(expectedResult)
        })
    })

    describe('test computeWidgetAssets', () => {
        test('when it returns € unit', () => {
            const val = 70
            const cases = [
                {
                    target: metricTargetsEnum.eurosConsumption,
                    unit: '€',
                    value: val.toFixed(2),
                },
                {
                    target: metricTargetsEnum.consumption,
                    unit: 'Wh',
                    value: val,
                },
                {
                    target: metricTargetsEnum.internalTemperature,
                    unit: '°C',
                    value: val,
                },
                {
                    target: metricTargetsEnum.externalTemperature,
                    unit: '°C',
                    value: val,
                },
                {
                    target: metricTargetsEnum.pMax,
                    unit: 'VA',
                    value: val,
                },
            ]
            const datapoints = [[val, 1640995200000]]
            const data: IMetric[] = [
                {
                    datapoints,
                    target: metricTargetsEnum.eurosConsumption,
                },
            ]

            cases.forEach((testCase) => {
                data[0].target = testCase.target
                const result = computeWidgetAssets(data, testCase.target)
                expect(result).toStrictEqual({ value: testCase.value, unit: testCase.unit })
            })
        })
    })
})
