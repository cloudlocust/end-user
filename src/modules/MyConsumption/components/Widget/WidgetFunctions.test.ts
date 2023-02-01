import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import {
    computeTotalConsumption,
    getDataFromYAxis,
    computePMax,
    computeInternallTemperature,
    computeTotalEuros,
    computeExternalTemperature,
    computeWidgetAssets,
    renderWidgetTitle,
    getWidgetPreviousRange,
    getWidgetRange,
    computeTotalProduction,
    computeTotalAutoconsumption,
} from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'

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
        test('when it returns 0 €', () => {
            const val = 0
            const expectedResult = {
                value: val,
                unit: '€',
            }
            const data: IMetric[] = [
                {
                    datapoints: [[null, 1640995200000]] as number[][],
                    target: metricTargetsEnum.eurosConsumption,
                },
            ]
            const result = computeTotalEuros(data)
            expect(result).toStrictEqual(expectedResult)
        })
    })

    describe('test computeTotalProduction function', () => {
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
                    target: 'enphase_production_metrics',
                },
            ]
            const result = computeTotalProduction(data)
            expect(result).toStrictEqual(expectedResult)
        })
        test('when it returns kWh unit', () => {
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
                    target: 'enphase_production_metrics',
                },
            ]
            const result = computeTotalProduction(data)
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
                    target: 'enphase_production_metrics',
                },
            ]
            const result = computeTotalProduction(data)
            expect(result).toStrictEqual(expectedResult)
        })
    })

    describe('test computeTotalAutoconsumption function', () => {
        test('when it returns W unit:', () => {
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
                    target: 'auto_consumption_metrics',
                },
            ]
            const result = computeTotalAutoconsumption(data)
            expect(result).toStrictEqual(expectedResult)
        })
        test('when it returns kWh unit:', () => {
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
                    target: 'auto_consumption_metrics',
                },
            ]
            const result = computeTotalAutoconsumption(data)
            expect(result).toStrictEqual(expectedResult)
        })
        test('when it returns MWh unit:', () => {
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
                    target: 'auto_consumption_metrics',
                },
            ]
            const result = computeTotalAutoconsumption(data)
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
                {
                    target: metricTargetsEnum.totalProduction,
                    unit: 'Wh',
                    value: val,
                },
                {
                    target: metricTargetsEnum.autoconsumption,
                    unit: 'Wh',
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

    describe('test renderWidgetTitle', () => {
        test('returns the different metric targets title', () => {
            const cases = [
                {
                    target: metricTargetsEnum.eurosConsumption,
                    value: 'Coût Total',
                },
                {
                    target: metricTargetsEnum.consumption,
                    value: 'Consommation Totale',
                },
                {
                    target: metricTargetsEnum.internalTemperature,
                    value: 'Température Intérieure',
                },
                {
                    target: metricTargetsEnum.externalTemperature,
                    value: 'Température Extérieure',
                },
                {
                    target: metricTargetsEnum.pMax,
                    value: 'Puissance Maximale',
                },
                {
                    target: metricTargetsEnum.pMax,
                    value: 'Puissance Maximale',
                },
                {
                    target: metricTargetsEnum.totalProduction,
                    value: 'Production Totale',
                },
                {
                    target: metricTargetsEnum.autoconsumption,
                    value: 'Autoconsommation',
                },
            ]

            cases.forEach(({ value, target }) => {
                const result = renderWidgetTitle(target)
                expect(result).toBe(value)
            })
        })
    })
    describe('test getWidgetPreviousRange', () => {
        test('returns the different values', () => {
            const cases = [
                {
                    range: { from: '2022-12-03T00:00:00.000Z', to: '2022-12-03T23:59:59.999Z' },
                    value: { from: '2022-12-02T00:00:00.000Z', to: '2022-12-02T23:59:59.999Z' },
                    period: 'daily',
                },
                {
                    range: { from: '2022-12-14T00:00:00.000Z', to: '2022-12-20T23:59:59.999Z' },
                    value: { from: '2022-12-07T00:00:00.000Z', to: '2022-12-13T23:59:59.999Z' },
                    period: 'weekly',
                },
                {
                    range: { from: '2021-12-01T00:00:00.000Z', to: '2022-12-15T23:59:59.999Z' },
                    value: { from: '2021-11-01T00:00:00.000Z', to: '2021-11-30T23:59:59.999Z' },
                    period: 'monthly',
                },
                {
                    range: { from: '2022-12-01T00:00:00.000Z', to: '2022-12-22T23:59:59.999Z' },
                    value: { from: '2021-01-01T00:00:00.000Z', to: '2021-12-31T23:59:59.999Z' },
                    period: 'yearly',
                },
            ]

            cases.forEach(({ range, period, value }) => {
                const result = getWidgetPreviousRange(range, period as periodType)
                expect(result).toStrictEqual(value)
            })
        })
    })
    describe('test getWidgetRange', () => {
        test('correct values', () => {
            const cases = [
                {
                    range: { from: '2022-12-04T10:00:00.000Z', to: '2022-12-04T23:59:59.999Z' },
                    value: { from: '2022-12-04T00:00:00.000Z', to: '2022-12-04T23:59:59.999Z' },
                    period: 'daily',
                },
                {
                    range: { from: '2022-12-18T00:00:00.000Z', to: '2022-12-21T23:59:59.999Z' },
                    value: { from: '2022-12-15T00:00:00.000Z', to: '2022-12-21T23:59:59.999Z' },
                    period: 'weekly',
                },
                {
                    range: { from: '2022-11-08T00:00:00.000Z', to: '2022-11-15T23:59:59.999Z' },
                    value: { from: '2022-11-01T00:00:00.000Z', to: '2022-11-15T23:59:59.999Z' },
                    period: 'monthly',
                },
                {
                    range: { from: '2022-06-01T00:00:00.000Z', to: '2022-12-20T23:59:59.999Z' },
                    value: { from: '2022-01-01T00:00:00.000Z', to: '2022-11-20T23:59:59.999Z' },
                    period: 'yearly',
                },
                {
                    range: { from: '2022-01-02T00:00:00.000Z', to: '2022-01-20T23:59:59.999Z' },
                    value: { from: '2022-01-01T00:00:00.000Z', to: '2022-01-20T23:59:59.999Z' },
                    period: 'yearly',
                },
            ]

            cases.forEach(({ range, period, value }) => {
                const result = getWidgetRange(range, period as periodType)
                expect(result).toStrictEqual(value)
            })
        })
    })
})
