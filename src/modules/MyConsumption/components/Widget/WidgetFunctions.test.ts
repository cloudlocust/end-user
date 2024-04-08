import { IMetric, metricTargetsEnum, metricTargetType } from 'src/modules/Metrics/Metrics.d'
import { totalConsumptionUnits } from 'src/modules/MyConsumption/components/Widget/Widget'
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
    getWidgetIndicatorColor,
    computeTotalOfAllConsumptions,
    isRangeWithinToday,
    WRONG_TARGET_TEXT,
    computeAverageIdleConsumption,
    isWidgetMonthlyMetrics,
    computeTotalEurosWithSubscriptionPrice,
} from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { getDateWithoutTimezoneOffset } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import dayjs from 'dayjs'

let mockGlobalProductionFeatureState = true
let mockIsProductionActiveAndHousingHasAccess = true

jest.mock('src/modules/MyHouse/MyHouseConfig', () => ({
    ...jest.requireActual('src/modules/MyHouse/MyHouseConfig'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    get globalProductionFeatureState() {
        return mockGlobalProductionFeatureState
    },
    //eslint-disable-next-line
    arePlugsUsedBasedOnProductionStatus: () => true,
    //eslint-disable-next-line
    isProductionActiveAndHousingHasAccess: () => mockIsProductionActiveAndHousingHasAccess,
}))

/**
 * Reusable test function that used to test multiple compute total function.
 * Like (computeTotalConsumption, computeTotalProduction, computeTotalAutoconsumption).
 * Exp: testComputeTotalFunction('consumption_metrics', computeTotalConsumption).
 *
 * @param target Type of target.
 * @param computeTotalFunction Function that we want to test.
 */
const testComputeTotalEnergyFunction = (
    target: metricTargetType,
    computeTotalFunction: (data: IMetric[]) => /**
     * Compute function to test (it should have only the functions that compute Total Energy).
     */
    {
        /**
         * Sum of Values.
         */
        value: number
        /**
         * Unit ("Wh" | "kWh" | "MWh").
         */
        unit: totalConsumptionUnits
    },
) => {
    test('when it returns Wh unit', () => {
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
                target: target,
            },
        ]
        const result = computeTotalFunction(data)
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
                target: target,
            },
        ]
        const result = computeTotalFunction(data)
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
                target: target,
            },
        ]
        const result = computeTotalFunction(data)
        expect(result).toStrictEqual(expectedResult)
    })
}

describe('Test widget functions', () => {
    test('getDataFromYAxis function', () => {
        const expectedResult = [50, 50, 50]
        const data: IMetric[] = [
            {
                datapoints: [
                    [50, 1640995200000],
                    [50, 1641081600000],
                    [50, 1641168000000],
                ],
                target: metricTargetsEnum.consumption,
            },
        ]
        const result = getDataFromYAxis(data, metricTargetsEnum.consumption)
        expect(result).toStrictEqual(expectedResult)
    })

    describe('test computeTotalConsumption function', () => {
        testComputeTotalEnergyFunction(metricTargetsEnum.consumption, computeTotalConsumption)
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
                    target: metricTargetsEnum.pMax,
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
                    target: metricTargetsEnum.pMax,
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
                    target: metricTargetsEnum.internalTemperature,
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
        test.each`
            target
            ${metricTargetsEnum.eurosConsumption}
            ${metricTargetsEnum.subscriptionPrices}
        `('when it returns € unit, when target is $target', ({ target }) => {
            const expectedResult = {
                value: 70.5,
                unit: '€',
            }
            const data: IMetric[] = [
                {
                    datapoints: [
                        [20, 1640995200000],
                        [50, 1641081600000],
                        [0.50001, 1641081600000],
                    ],
                    target,
                },
            ]
            const result = computeTotalEuros(data, target)
            expect(result).toStrictEqual(expectedResult)
        })
        test.each`
            target
            ${metricTargetsEnum.eurosConsumption}
            ${metricTargetsEnum.subscriptionPrices}
        `('when it returns 0 €', ({ target }) => {
            const val = 0
            const expectedResult = {
                value: val,
                unit: '€',
            }
            const data: IMetric[] = [
                {
                    datapoints: [[null, 1640995200000]] as number[][],
                    target: target,
                },
            ]
            const result = computeTotalEuros(data, target)
            expect(result).toStrictEqual(expectedResult)
        })
    })

    describe('test computeTotalEurosWithSubscriptionPrice', () => {
        test('when it returns € unit', () => {
            const expectedResult = {
                value: 140.5,
                unit: '€',
            }
            const data: IMetric[] = [
                {
                    datapoints: [
                        [20, 1640995200000],
                        [50, 1641081600000],
                        [0.50001, 1641081600000],
                    ],
                    target: metricTargetsEnum.eurosConsumption,
                },
                {
                    datapoints: [
                        [20, 1640995200000],
                        [50, 1641081600000],
                        [0, 1641081600000],
                    ],
                    target: metricTargetsEnum.subscriptionPrices,
                },
            ]
            const result = computeTotalEurosWithSubscriptionPrice(data)
            expect(result).toStrictEqual(expectedResult)
        })
        test('when it returns 0 €', () => {
            const expectedResult = {
                value: 0,
                unit: '€',
            }
            const data: IMetric[] = [
                {
                    datapoints: [[null, 1640995200000]] as number[][],
                    target: metricTargetsEnum.eurosConsumption,
                },
                {
                    datapoints: [[null, 1640995200000]] as number[][],
                    target: metricTargetsEnum.subscriptionPrices,
                },
            ]
            const result = computeTotalEurosWithSubscriptionPrice(data)
            expect(result).toStrictEqual(expectedResult)
        })
    })

    describe('test computeTotalProduction function', () => {
        testComputeTotalEnergyFunction(metricTargetsEnum.totalProduction, computeTotalProduction)
    })

    describe('test computeTotalAutoconsumption function', () => {
        testComputeTotalEnergyFunction(metricTargetsEnum.autoconsumption, computeTotalAutoconsumption)
    })

    describe('test computeWidgetAssets', () => {
        test('when it returns € unit', () => {
            const val = 70
            const cases = [
                {
                    target: metricTargetsEnum.eurosConsumption,
                    unit: '€',
                    value: val,
                },
                {
                    target: metricTargetsEnum.subscriptionPrices,
                    unit: '€',
                    value: val,
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
                {
                    target: metricTargetsEnum.idleConsumption,
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
        test('when computeWidgetAssets throws', () => {
            const wrongTarget = {
                target: 'wrong target',
            }
            const dummyData = [
                {
                    datapoints: [[0, 1640995200000]],
                    target: metricTargetsEnum.eurosConsumption,
                },
            ]

            expect(() => computeWidgetAssets(dummyData, wrongTarget as unknown as metricTargetType)).toThrow(
                new Error(WRONG_TARGET_TEXT),
            )
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
                    value: 'Achetée',
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
        test('when globalProductionFeatureState is disabled, it returns `Consommation Totale` title for consumption target', () => {
            mockGlobalProductionFeatureState = false // in tests we don't realy need it
            mockIsProductionActiveAndHousingHasAccess = false
            expect(renderWidgetTitle(metricTargetsEnum.consumption)).toBe('Consommation Totale')
        })
        test('when globalProductionFeatureState & enphase is off, it returns `Consommation Totale` title for consumption target', () => {
            mockGlobalProductionFeatureState = true
            expect(renderWidgetTitle(metricTargetsEnum.consumption, true)).toBe('Consommation Totale')
        })
        test('when it throws', () => {
            expect(() => renderWidgetTitle('error target' as unknown as metricTargetType)).toThrow(
                new Error(WRONG_TARGET_TEXT),
            )
        })
    })
    describe('test getWidgetPreviousRange', () => {
        test('returns the different values', () => {
            const cases = [
                {
                    range: { from: '2022-12-03T00:00:00.000Z', to: '2022-12-03T23:59:59.999Z' },
                    value: { from: '2022-12-02T00:00:00.000Z', to: '2022-12-02T23:59:59.999Z' },
                    period: 'daily',
                    target: metricTargetsEnum.consumption,
                },
                {
                    range: { from: '2022-12-14T00:00:00.000Z', to: '2022-12-20T23:59:59.999Z' },
                    value: { from: '2022-12-07T00:00:00.000Z', to: '2022-12-13T23:59:59.999Z' },
                    period: 'weekly',
                    target: metricTargetsEnum.consumption,
                },
                {
                    range: { from: '2021-12-01T00:00:00.000Z', to: '2022-12-15T23:59:59.999Z' },
                    value: { from: '2021-11-01T00:00:00.000Z', to: '2021-11-30T23:59:59.999Z' },
                    period: 'monthly',
                    target: metricTargetsEnum.pMax,
                },
                {
                    range: { from: '2021-12-01T00:00:00.000Z', to: '2022-12-25T23:59:59.999Z' },
                    value: { from: '2021-11-01T00:00:00.000Z', to: '2021-11-30T23:59:59.999Z' },
                    period: 'monthly',
                    target: metricTargetsEnum.consumption,
                },
                {
                    range: { from: '2021-10-01T00:00:00.000Z', to: '2022-11-25T23:59:59.999Z' },
                    value: { from: '2021-09-01T00:00:00.000Z', to: '2021-09-30T23:59:59.999Z' },
                    period: 'monthly',
                    target: metricTargetsEnum.eurosConsumption,
                },
                {
                    range: { from: '2022-12-01T00:00:00.000Z', to: '2022-12-22T23:59:59.999Z' },
                    value: { from: '2021-01-01T00:00:00.000Z', to: '2021-12-31T23:59:59.999Z' },
                    period: 'yearly',
                    target: metricTargetsEnum.consumption,
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
                    target: metricTargetsEnum.consumption,
                },
                {
                    // eslint-disable-next-line sonarjs/no-duplicate-string
                    range: { from: '2022-12-01T10:00:00.000Z', to: '2022-12-31T23:59:59.999Z' },
                    value: { from: '2022-12-01T00:00:00.000Z', to: '2022-12-07T23:59:59.999Z' },
                    period: 'weekly',
                    target: metricTargetsEnum.consumption,
                },
                {
                    range: { from: '2022-11-08T00:00:00.000Z', to: '2022-11-30T23:59:59.999Z' },
                    value: { from: '2022-11-01T00:00:00.000Z', to: '2022-11-30T23:59:59.999Z' },
                    period: 'monthly',
                    target: metricTargetsEnum.internalTemperature,
                },
                {
                    range: { from: '2022-09-01T00:00:00.000Z', to: '2022-09-30T23:59:59.999Z' },
                    value: { from: '2022-09-01T00:00:00.000Z', to: '2022-09-30T23:59:59.999Z' },
                    period: 'monthly',
                    target: metricTargetsEnum.consumption,
                },
                {
                    range: { from: '2022-10-01T00:00:00.000Z', to: '2022-10-31T23:59:59.999Z' },
                    value: { from: '2022-10-01T00:00:00.000Z', to: '2022-10-31T23:59:59.999Z' },
                    period: 'monthly',
                    target: metricTargetsEnum.eurosConsumption,
                },
                {
                    // eslint-disable-next-line sonarjs/no-duplicate-string
                    range: { from: '2022-01-01T00:00:00.000Z', to: '2022-12-31T23:59:59.999Z' },
                    value: { from: '2022-01-01T00:00:00.000Z', to: '2022-12-31T23:59:59.999Z' },
                    period: 'yearly',
                    target: metricTargetsEnum.consumption,
                },
            ]

            cases.forEach(({ range, period, value }) => {
                const result = getWidgetRange(range, period as periodType)
                expect(result).toStrictEqual(value)
            })
        })
    })
    describe('test getWidgetIndicatorColor', () => {
        test('return the correct color', () => {
            let percentageChange = 50
            let cases = [
                {
                    target: metricTargetsEnum.eurosConsumption,
                    percentageChange,
                    color: 'error',
                },
                {
                    target: metricTargetsEnum.subscriptionPrices,
                    percentageChange,
                    color: 'error',
                },
                {
                    target: metricTargetsEnum.consumption,
                    percentageChange,
                    color: 'error',
                },
                {
                    target: metricTargetsEnum.internalTemperature,
                    percentageChange,
                    color: 'error',
                },
                {
                    target: metricTargetsEnum.externalTemperature,
                    percentageChange,
                    color: 'error',
                },
                {
                    target: metricTargetsEnum.pMax,
                    percentageChange,
                    color: 'error',
                },
                {
                    target: metricTargetsEnum.totalProduction,
                    percentageChange,
                    color: 'success',
                },
                {
                    target: metricTargetsEnum.injectedProduction,
                    percentageChange,
                    color: 'success',
                },
                {
                    target: metricTargetsEnum.autoconsumption,
                    percentageChange,
                    color: 'success',
                },
            ]
            // test all the cases when percentageChange is positive
            cases.forEach(({ color, percentageChange, target }) => {
                const result = getWidgetIndicatorColor(target, percentageChange)
                expect(result).toBe(color)
            })

            // rebuild cases with negative percentageChange and reverse the colors
            percentageChange = -50
            cases = cases.map((item) =>
                item.color === 'error'
                    ? { ...item, percentageChange, color: 'success' }
                    : { ...item, percentageChange, color: 'error' },
            )
            // test all the cases when percentageChange is negative
            cases.forEach(({ color, percentageChange, target }) => {
                const result = getWidgetIndicatorColor(target, percentageChange)
                expect(result).toBe(color)
            })
        })
        test('when it throws', () => {
            expect(() => renderWidgetTitle('errorr target' as unknown as metricTargetType)).toThrow(
                new Error(WRONG_TARGET_TEXT),
            )
        })
    })

    describe('test computeTotalOfAllConsumptions', () => {
        test('when it returns Wh unit', () => {
            const expectedResult = {
                value: 100,
                unit: 'Wh',
            }
            const data: IMetric[] = [
                {
                    datapoints: [
                        [25, 1640995200000],
                        [25, 1641081600000],
                    ],
                    target: metricTargetsEnum.consumption,
                },
                {
                    datapoints: [
                        [25, 1640995200000],
                        [25, 1641081600000],
                    ],
                    target: metricTargetsEnum.autoconsumption,
                },
            ]
            const result = computeTotalOfAllConsumptions(data)
            expect(result).toStrictEqual(expectedResult)
        })
        test('when it returns kWh unit', () => {
            const expectedResult = {
                value: 2,
                unit: 'kWh',
            }
            const data: IMetric[] = [
                {
                    datapoints: [
                        [500, 1640995200000],
                        [500, 1641081600000],
                    ],
                    target: metricTargetsEnum.consumption,
                },
                {
                    datapoints: [
                        [500, 1640995200000],
                        [500, 1641081600000],
                    ],
                    target: metricTargetsEnum.autoconsumption,
                },
            ]
            const result = computeTotalOfAllConsumptions(data)
            expect(result).toStrictEqual(expectedResult)
        })
        test('when it returns MWh unit', () => {
            const expectedResult = {
                value: 2,
                unit: 'MWh',
            }
            const data: IMetric[] = [
                {
                    datapoints: [
                        [500_000, 1640995200000],
                        [500_000, 1641081600000],
                    ],
                    target: metricTargetsEnum.consumption,
                },
                {
                    datapoints: [
                        [500_000, 1640995200000],
                        [500_000, 1641081600000],
                    ],
                    target: metricTargetsEnum.autoconsumption,
                },
            ]
            const result = computeTotalOfAllConsumptions(data)
            expect(result).toStrictEqual(expectedResult)
        })
    })

    describe('test isWidgetMonthlyMetrics', () => {
        test('different cases', () => {
            const cases = [
                {
                    type: metricTargetsEnum.consumption,
                    period: 'daily',
                    value: false,
                },
                {
                    type: metricTargetsEnum.consumption,
                    period: 'monthly',
                    value: true,
                },
                {
                    type: metricTargetsEnum.eurosConsumption,
                    period: 'yearly',
                    value: false,
                },
                {
                    type: metricTargetsEnum.eurosConsumption,
                    period: 'monthly',
                    value: true,
                },
                {
                    type: metricTargetsEnum.autoconsumption,
                    period: 'weekly',
                    value: false,
                },
                {
                    type: metricTargetsEnum.autoconsumption,
                    period: 'monthly',
                    value: true,
                },

                {
                    type: metricTargetsEnum.externalTemperature,
                    period: 'monthly',
                    value: false,
                },
                {
                    type: metricTargetsEnum.pMax,
                    period: 'monthly',
                    value: false,
                },
            ]

            cases.forEach(({ type, period, value }) => {
                const result = isWidgetMonthlyMetrics(type as metricTargetsEnum, period as periodType)
                expect(result).toStrictEqual(value)
            })
        })
    })
    describe('test isDateWithinDay', () => {
        let fromRange = getDateWithoutTimezoneOffset(dayjs().startOf('day').toDate())
        let toRange = getDateWithoutTimezoneOffset(dayjs().endOf('day').toDate())
        test('when it returns true', () => {
            const boolean = isRangeWithinToday(fromRange, toRange)

            expect(boolean).toBeTruthy()
        })
        test('when it returns false', () => {
            fromRange = '2023-06-10T00:00:00.000Z'
            toRange = '2023-07-10T23:59:59.999Z'
            const boolean = isRangeWithinToday(fromRange, toRange)

            expect(boolean).toBeFalsy()
        })
    })
    describe('test computeAverageIdleConsumption', () => {
        test('when result returns Wh value', () => {
            const data: IMetric[] = [
                {
                    datapoints: [
                        [50, 1640995200000],
                        [25, 1641081600000],
                    ],
                    target: metricTargetsEnum.idleConsumption,
                },
            ]
            const expectedResult = {
                value: 38,
                unit: 'Wh',
            }
            const result = computeAverageIdleConsumption(data)
            expect(result).toStrictEqual(expectedResult)
        })
        test('when result returns kWh', () => {
            const data: IMetric[] = [
                {
                    datapoints: [
                        [5000, 1640995200000],
                        [2500, 1641081600000],
                    ],
                    target: metricTargetsEnum.idleConsumption,
                },
            ]
            const expectedResult = {
                value: 3.75,
                unit: 'kWh',
            }
            const result = computeAverageIdleConsumption(data)
            expect(result).toStrictEqual(expectedResult)
        })
        test('when result returns Mwh', () => {
            const data: IMetric[] = [
                {
                    datapoints: [
                        [50000000, 1640995200000],
                        [25000000, 1641081600000],
                    ],
                    target: metricTargetsEnum.idleConsumption,
                },
            ]
            const expectedResult = {
                value: 37.5,
                unit: 'MWh',
            }
            const result = computeAverageIdleConsumption(data)
            expect(result).toStrictEqual(expectedResult)
        })
    })
})
