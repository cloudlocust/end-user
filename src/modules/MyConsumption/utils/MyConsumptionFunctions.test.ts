import {
    isEqualDates,
    generateXAxisValues,
    fillChartsAxisMissingValues,
    formatMetricFilter,
    convertToDateFnsPeriod,
    isMissingYAxisValues,
    getDateWithoutTimezoneOffset,
    addPeriod,
    subPeriod,
    convertConsumptionToWatt,
    getRangeV2,
    subtractTime,
    addTime,
    getTotalOffIdleConsumptionData,
    getDefaultConsumptionTargets,
    filterMetricsData,
    nullifyTodayIdleConsumptionValue,
} from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { IMetric, metricIntervalType, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { FAKE_WEEK_DATA, FAKE_DAY_DATA, FAKE_MONTH_DATA, FAKE_YEAR_DATA } from 'src/mocks/handlers/metrics'
import { getRange } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { convertMetricsDataToChartsAxisValues } from 'src/modules/MyConsumption/utils/chartsDataConverter'
import dayjs from 'dayjs'
import { PeriodEnum, dateFnsPeriod, periodType } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import {
    addDays,
    addMonths,
    addWeeks,
    addYears,
    endOfDay,
    endOfMonth,
    endOfWeek,
    endOfYear,
    startOfDay,
    startOfMonth,
    startOfWeek,
    startOfYear,
    subDays,
    subMonths,
    subWeeks,
    subYears,
} from 'date-fns'
import fr from 'date-fns/locale/fr'

// eslint-disable-next-line jsdoc/require-jsdoc
let interval: metricIntervalType = '1m'

// GMT: Thursday, 23 June 2022 00:00:00
const timestamp1 = 1655942400000

// FAKE_YEAR_DATA starts at 1st Jan and ends at Dec.
// GMT: Sunday, 1 January 2023 01:00:00
const fakeYearTimestamp = 1672534800000

/**
 * Fake Year Range for the fake timestamp, according to the FAKE_YEAR_DATA.
 */
const fakeYearRange = {
    from: dayjs
        .utc(new Date(fakeYearTimestamp).toUTCString())
        .subtract(1, 'year')
        .startOf('day')
        .toDate()
        .toISOString(),
    to: dayjs(new Date(fakeYearTimestamp)).startOf('day').toDate().toISOString(),
}

// eslint-disable-next-line jsdoc/require-jsdoc
const mockMetricsData: IMetric[] = [
    {
        // TODO FIX in 2427, change name to enum
        target: 'consumption_metrics',
        datapoints: FAKE_WEEK_DATA,
    },
]

// eslint-disable-next-line jsdoc/require-jsdoc
describe('test pure functions', () => {
    test('isEqualDates test with different cases', async () => {
        // When period is daily and time are not the same, it should return false.
        let timestamp2 = new Date(dayjs(new Date(timestamp1)).add(1, 'minute').format()).getTime()
        let equalityResult = isEqualDates(timestamp1, timestamp2, 'daily')
        expect(equalityResult).toBeFalsy()

        // When period is daily and time are the same, it should return true.
        equalityResult = isEqualDates(timestamp1, timestamp1, 'daily')
        expect(equalityResult).toBeTruthy()

        // When period is not daily and time are the same, it should return true.
        equalityResult = isEqualDates(timestamp1, timestamp2, 'yearly')
        expect(equalityResult).toBeTruthy()

        // When period is not daily and time are not the same, it should return false.
        timestamp2 = dayjs(new Date(timestamp2)).add(1, 'month').unix() * 1000
        equalityResult = isEqualDates(timestamp1, timestamp2, 'yearly')
        expect(equalityResult).toBeFalsy()

        // When period is not daily and time are the same, it should return true.
        equalityResult = isEqualDates(timestamp1, timestamp1, 'yearly')
        expect(equalityResult).toBeTruthy()
    })
    test('generateXAxisValues test with different cases', async () => {
        // When period is daily we have correct length of xAxisValues.
        let xAxisValues = generateXAxisValues('daily', getRange('day'))
        // If interval is 2min , then length should be 2 * 30 * 24.
        expect(xAxisValues).toHaveLength((60 / parseInt(interval)) * 24)

        // When period is weekly we have correct length of xAxisValues.
        interval = '1d'
        xAxisValues = generateXAxisValues('weekly', getRange('week'))
        // If interval is 1d and period is weekly , then length should be 7.
        expect(xAxisValues).toHaveLength(7)

        // When period is monthly we have correct length of xAxisValues.
        interval = '1d'
        xAxisValues = generateXAxisValues('monthly', getRange('month'))
        // If interval is 1d and period is monthly , then length should be less or Equal than 32 because we start counting from the current day till the same day next month, so it's like the current date and the month before so whether 31 or 32.
        expect(xAxisValues.length).toBeGreaterThanOrEqual(29)
        expect(xAxisValues.length).toBeLessThanOrEqual(32)

        // When period is yearly we have correct length of xAxisValues.
        interval = '1M'
        xAxisValues = generateXAxisValues('yearly', getRange('year'))
        // If interval is 1d and period is yearly , then length should be 13 because we start from the current month till the month of next year.
        expect(xAxisValues).toHaveLength(12)
    })

    test('fillChartsAxisMissingValues test with different cases', async () => {
        // When Mock week has only three values values, then filling of xAxisValues should be 7, and mappin is done correctly the MOCK_WEEK_MISSING_DATA[3] should be at index 6 on the nex filledchartsValues.
        const MOCK_YEAR_MISSING_DATA = [FAKE_YEAR_DATA[0], FAKE_YEAR_DATA[1], FAKE_YEAR_DATA[11]]
        mockMetricsData[0].datapoints = MOCK_YEAR_MISSING_DATA
        let chartsMissingValues = convertMetricsDataToChartsAxisValues(mockMetricsData)
        let ChartsFilledAxisValues = fillChartsAxisMissingValues(chartsMissingValues, 'yearly', fakeYearRange)
        expect(ChartsFilledAxisValues.xAxisSeries[0]).toHaveLength(12)
        expect(ChartsFilledAxisValues.yAxisSeries[0].data).toHaveLength(12)
        expect(ChartsFilledAxisValues.yAxisSeries[0].data[0]).toEqual(MOCK_YEAR_MISSING_DATA[0][0])
        expect(ChartsFilledAxisValues.yAxisSeries[0].data[1]).toEqual(MOCK_YEAR_MISSING_DATA[1][0])
        expect(ChartsFilledAxisValues.yAxisSeries[0].data[2]).toBeNull()
        expect(ChartsFilledAxisValues.yAxisSeries[0].data[3]).toBeNull()
        expect(ChartsFilledAxisValues.yAxisSeries[0].data[4]).toBeNull()
        expect(ChartsFilledAxisValues.yAxisSeries[0].data[5]).toBeNull()
        expect(ChartsFilledAxisValues.yAxisSeries[0].data[6]).toBeNull()
        expect(ChartsFilledAxisValues.yAxisSeries[0].data[7]).toBeNull()
        expect(ChartsFilledAxisValues.yAxisSeries[0].data[8]).toBeNull()
        expect(ChartsFilledAxisValues.yAxisSeries[0].data[9]).toBeNull()
        expect(ChartsFilledAxisValues.yAxisSeries[0].data[10]).toBeNull()
        expect(ChartsFilledAxisValues.yAxisSeries[0].data[11]).toEqual(MOCK_YEAR_MISSING_DATA[2][0])

        // When yAxisSeries is empty nothing should changes
        chartsMissingValues = convertMetricsDataToChartsAxisValues([])
        ChartsFilledAxisValues = fillChartsAxisMissingValues(chartsMissingValues, 'yearly', fakeYearRange)
        expect(ChartsFilledAxisValues.xAxisSeries).toHaveLength(0)
        expect(ChartsFilledAxisValues.yAxisSeries).toHaveLength(0)
    }, 20000)

    test('formatMetricFilter test', async () => {
        const FAKE_HOUSING_ID = 123
        let resultMetricFilter = formatMetricFilter(FAKE_HOUSING_ID)
        expect(resultMetricFilter).toStrictEqual([
            {
                key: 'housing_id',
                operator: '=',
                value: `${FAKE_HOUSING_ID}`,
            },
        ])
    })
    test('isMissingYAxisValues test', async () => {
        interval = '1m'
        // When day period, and data doesn't contains all day values.
        mockMetricsData[0].datapoints = FAKE_DAY_DATA
        let ChartsFilledAxisValues = convertMetricsDataToChartsAxisValues(mockMetricsData)
        let isMissingValues = isMissingYAxisValues(ChartsFilledAxisValues.yAxisSeries[0].data, 'daily')
        expect(isMissingValues).toBeTruthy()

        // When week period, and data contains all week values.
        mockMetricsData[0].datapoints = FAKE_WEEK_DATA
        ChartsFilledAxisValues = convertMetricsDataToChartsAxisValues(mockMetricsData)
        isMissingValues = isMissingYAxisValues(ChartsFilledAxisValues.yAxisSeries[0].data, 'weekly')
        expect(isMissingValues).toBeFalsy()

        // When week period, and data doesn't contains all week values.
        mockMetricsData[0].datapoints = FAKE_WEEK_DATA.filter((_v, i) => i !== 0)
        ChartsFilledAxisValues = convertMetricsDataToChartsAxisValues(mockMetricsData)
        isMissingValues = isMissingYAxisValues(ChartsFilledAxisValues.yAxisSeries[0].data, 'weekly')
        expect(isMissingValues).toBeTruthy()

        // When month period, and data contains all month values.
        mockMetricsData[0].datapoints = FAKE_MONTH_DATA
        ChartsFilledAxisValues = convertMetricsDataToChartsAxisValues(mockMetricsData)
        isMissingValues = isMissingYAxisValues(ChartsFilledAxisValues.yAxisSeries[0].data, 'monthly')
        expect(isMissingValues).toBeFalsy()

        // When month period, and data doesn't contains all month values.
        mockMetricsData[0].datapoints = FAKE_MONTH_DATA.filter((_v, i) => i !== 0)
        ChartsFilledAxisValues = convertMetricsDataToChartsAxisValues(mockMetricsData)
        isMissingValues = isMissingYAxisValues(ChartsFilledAxisValues.yAxisSeries[0].data, 'yearly')
        expect(isMissingValues).toBeTruthy()

        // When year period, and data contains all year values.
        mockMetricsData[0].datapoints = FAKE_YEAR_DATA
        mockMetricsData[0].datapoints.push([33, timestamp1])
        ChartsFilledAxisValues = convertMetricsDataToChartsAxisValues(mockMetricsData)
        isMissingValues = isMissingYAxisValues(ChartsFilledAxisValues.yAxisSeries[0].data, 'yearly')
        expect(isMissingValues).toBeFalsy()

        // When year period, and data doesn't contains all week values.
        mockMetricsData[0].datapoints = FAKE_YEAR_DATA.filter((_v, i) => i !== 0)
        ChartsFilledAxisValues = convertMetricsDataToChartsAxisValues(mockMetricsData)
        isMissingValues = isMissingYAxisValues(ChartsFilledAxisValues.yAxisSeries[0].data, 'yearly')
        expect(isMissingValues).toBeTruthy()
    })

    test('convertToDateFnsPeriod test with different cases', async () => {
        const caseList = [
            // Daily period.
            { dateFnsPeriod: 'days', period1: 'daily', period2: 'day' },
            // Weekly period.
            { dateFnsPeriod: 'weeks', period1: 'weekly', period2: 'week' },
            // Monthly period.
            { dateFnsPeriod: 'months', period1: 'monthly', period2: 'month' },
            // Yearly period.
            { dateFnsPeriod: 'years', period1: 'yearly', period2: 'year' },
        ]
        caseList.forEach(({ dateFnsPeriod, period1, period2 }) => {
            let result = convertToDateFnsPeriod(period1 as periodType)
            expect(result).toEqual(dateFnsPeriod)
            result = convertToDateFnsPeriod(period2)
            expect(result).toEqual(dateFnsPeriod)
        })
    })

    test('getDateWithoutTimezoneOffset test with different cases', async () => {
        const date = new Date('12/12/2012')
        // Set our local time to midnight.
        date.setHours(0, 0, 0, 0)
        // Local time is returned into ISOString.
        let result = getDateWithoutTimezoneOffset(date)
        expect(result).toEqual('2012-12-12T00:00:00.000Z')
    })

    test('addPeriod test with different cases', async () => {
        const date = new Date('10/10/2022 00:00:00')

        const caseList = [
            // Adding 1 day period.
            { period: 'days', resultDate: '2022-10-10T23:59:59.999Z' },
            // Adding 1 week period.
            { period: 'weeks', resultDate: '2022-10-16T00:00:00.000Z' },
            // Adding 1 month period.
            { period: 'months', resultDate: '2022-11-10T23:59:59.999Z' },
            // Adding 1 year period.
            { period: 'years', resultDate: '2023-10-01T00:00:00.000Z' },
        ]
        caseList.forEach(({ period, resultDate }) => {
            const result = addPeriod(date, period as dateFnsPeriod)
            expect(getDateWithoutTimezoneOffset(result)).toEqual(resultDate)
        })
    })

    test('subPeriod test with different cases', async () => {
        const date = new Date('10/10/2022 23:59:59:999')

        const caseList = [
            // Subtracting 1 day period.
            { period: 'days', resultDate: '2022-10-10T00:00:00.000Z' },
            // Subtracting 1 week period.
            { period: 'weeks', resultDate: '2022-10-04T00:00:00.000Z' },
            // Subtracting 1 month period.
            { period: 'months', resultDate: '2022-09-10T00:00:00.000Z' },
            // Subtracting 1 year period.
            { period: 'years', resultDate: '2021-10-01T00:00:00.000Z' },
        ]
        caseList.forEach(({ period, resultDate }) => {
            const result = subPeriod(date, period as dateFnsPeriod)
            expect(getDateWithoutTimezoneOffset(result)).toEqual(resultDate)
        })
    })
    describe('convertConsumptionToWatt', () => {
        it('should round 104 watt hours to 208 watts for 30 minute interval', () => {
            const yValue = 104
            const isYValueRounded = true
            const metricsInterval = '30m'
            const result = convertConsumptionToWatt(yValue, isYValueRounded, metricsInterval)
            expect(result).toEqual('208 W')
        })

        it('should handle null yValue', () => {
            const yValue = null
            const isYValueRounded = false
            const metricsInterval = '30m'
            const result = convertConsumptionToWatt(yValue, isYValueRounded, metricsInterval)
            expect(result).toEqual('0 W')
        })

        it('should handle undefined yValue', () => {
            const yValue = undefined
            const isYValueRounded = false
            const metricsInterval = '30m'
            const result = convertConsumptionToWatt(yValue, isYValueRounded, metricsInterval)
            expect(result).toEqual('0 W')
        })

        it('should handle undefined isYValueRounded', () => {
            const yValue = 104
            const isYValueRounded = undefined
            const metricsInterval = '30m'
            const result = convertConsumptionToWatt(yValue, isYValueRounded, metricsInterval)
            expect(result).toEqual('208.00 W')
        })

        it('should default to 2 conversion factor for 30m metricsInterval', () => {
            const yValue = 104
            const isYValueRounded = false
            const metricsInterval = '30m'
            const result = convertConsumptionToWatt(yValue, isYValueRounded, metricsInterval)
            expect(result).toEqual('208.00 W')
        })

        it('should default to 60 conversion factor for 1m metricsInterval', () => {
            const yValue = 104
            const isYValueRounded = false
            const metricsInterval = '1m'
            const result = convertConsumptionToWatt(yValue, isYValueRounded, metricsInterval)
            expect(result).toEqual('6240.00 W')
        })

        it('should default to 60 conversion factor for undefined metricsInterval', () => {
            const yValue = 104
            const isYValueRounded = false
            const metricsInterval = undefined // default is "1m"
            const result = convertConsumptionToWatt(yValue, isYValueRounded, metricsInterval)
            expect(result).toEqual('6240.00 W')
        })
    })
})

describe('getRangeV2', () => {
    const currentDate = new Date()

    it('should return the correct range for DAILY period', () => {
        const expectedRange = {
            from: getDateWithoutTimezoneOffset(startOfDay(currentDate)),
            to: getDateWithoutTimezoneOffset(endOfDay(currentDate)),
        }
        const actualRange = getRangeV2(PeriodEnum.DAILY)
        expect(actualRange).toEqual(expectedRange)
    })

    it('should return the correct range for WEEKLY period', () => {
        const expectedRange = {
            from: getDateWithoutTimezoneOffset(startOfWeek(currentDate, { locale: fr })),
            to: getDateWithoutTimezoneOffset(endOfWeek(currentDate, { locale: fr })),
        }
        const actualRange = getRangeV2(PeriodEnum.WEEKLY)
        expect(actualRange).toEqual(expectedRange)
    })

    it('should return the correct range for MONTHLY period', () => {
        const expectedRange = {
            from: getDateWithoutTimezoneOffset(startOfMonth(currentDate)),
            to: getDateWithoutTimezoneOffset(endOfMonth(currentDate)),
        }
        const actualRange = getRangeV2(PeriodEnum.MONTHLY)
        expect(actualRange).toEqual(expectedRange)
    })

    it('should return the correct range for YEARLY period', () => {
        const expectedRange = {
            from: getDateWithoutTimezoneOffset(startOfYear(currentDate)),
            to: getDateWithoutTimezoneOffset(endOfYear(currentDate)),
        }
        const actualRange = getRangeV2(PeriodEnum.YEARLY)
        expect(actualRange).toEqual(expectedRange)
    })
})

describe('subtractTime', () => {
    const currentDate = new Date()

    it('should subtract 1 day from the current date for DAILY period', () => {
        const expectedDate = getDateWithoutTimezoneOffset(subDays(startOfDay(currentDate), 1))
        const actualDate = subtractTime(currentDate, PeriodEnum.DAILY)
        expect(actualDate).toEqual(expectedDate)
    })

    it('should subtract 1 week from the current date for WEEKLY period', () => {
        const expectedDate = getDateWithoutTimezoneOffset(subWeeks(startOfWeek(currentDate, { locale: fr }), 1))
        const actualDate = subtractTime(currentDate, PeriodEnum.WEEKLY)
        expect(actualDate).toEqual(expectedDate)
    })

    it('should subtract 1 month from the current date for MONTHLY period', () => {
        const expectedDate = getDateWithoutTimezoneOffset(subMonths(startOfMonth(currentDate), 1))
        const actualDate = subtractTime(currentDate, PeriodEnum.MONTHLY)
        expect(actualDate).toEqual(expectedDate)
    })

    it('should subtract 1 year from the current date for YEARLY period', () => {
        const expectedDate = getDateWithoutTimezoneOffset(subYears(startOfYear(currentDate), 1))
        const actualDate = subtractTime(currentDate, PeriodEnum.YEARLY)
        expect(actualDate).toEqual(expectedDate)
    })
})

describe('addTime', () => {
    const currentDate = new Date()

    it('should add 1 day to the current date for DAILY period', () => {
        const expectedDate = getDateWithoutTimezoneOffset(addDays(startOfDay(currentDate), 1))
        const actualDate = addTime(currentDate, PeriodEnum.DAILY)
        expect(actualDate).toEqual(expectedDate)
    })

    it('should add 1 week to the current date for WEEKLY period', () => {
        const expectedDate = getDateWithoutTimezoneOffset(addWeeks(startOfWeek(currentDate, { locale: fr }), 1))
        const actualDate = addTime(currentDate, PeriodEnum.WEEKLY)
        expect(actualDate).toEqual(expectedDate)
    })

    it('should add 1 month to the current date for MONTHLY period', () => {
        const expectedDate = getDateWithoutTimezoneOffset(addMonths(startOfMonth(currentDate), 1))
        const actualDate = addTime(currentDate, PeriodEnum.MONTHLY)
        expect(actualDate).toEqual(expectedDate)
    })

    it('should add 1 year to the current date for YEARLY period', () => {
        const expectedDate = getDateWithoutTimezoneOffset(addYears(startOfYear(currentDate), 1))
        const actualDate = addTime(currentDate, PeriodEnum.YEARLY)
        expect(actualDate).toEqual(expectedDate)
    })
})

describe('getDefaultConsumptionTargets tests', () => {
    let enphaseOff = false

    beforeEach(() => {
        enphaseOff = false
    })

    test('when enphaseOff is true, it returns consumption metrics', () => {
        enphaseOff = true
        const result = getDefaultConsumptionTargets(enphaseOff)
        expect(result).toStrictEqual([metricTargetsEnum.consumptionByTariffComponent, metricTargetsEnum.consumption])
    })

    test('when enphase is false, , it returns auto conso w/ base consumption', () => {
        const result = getDefaultConsumptionTargets(enphaseOff)

        expect(result).toStrictEqual([metricTargetsEnum.autoconsumption, metricTargetsEnum.consumption])
    })
})

describe('getTotalOffIdleConsumptionData test with different cases', () => {
    test('different cases', () => {
        const caseList = [
            // NORMAL CASE
            // Total off idle consumption with null values
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
                    target: metricTargetsEnum.totalOffIdleConsumption,
                    datapoints: [
                        [null, 10001],
                        [null, 10002],
                        [null, 10003],
                        [null, 10004],
                    ],
                },
            },
            // Total off idle consumption with not-null values.
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
                        target: metricTargetsEnum.idleConsumption,
                        datapoints: [
                            [0, 10001],
                            [30, 10002],
                            [33, 10003],
                            [null, 10004],
                        ],
                    },
                ],
                expectedResult: {
                    target: metricTargetsEnum.totalOffIdleConsumption,
                    datapoints: [
                        [null, 10001],
                        [100, 10002],
                        [22, 10003],
                        [800, 10004],
                    ],
                },
            },
            // Undefined return.
            {
                data: [
                    {
                        target: metricTargetsEnum.consumption,
                        datapoints: [
                            [890, 10001],
                            [130, 10002],
                            [77, 10003],
                            [148, 10004],
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
                expectedResult: undefined,
            },
            // EUROS CASE:
            // EUROS Total off idle consumption with not-null values.
            {
                data: [
                    {
                        target: metricTargetsEnum.eurosConsumption,
                        datapoints: [
                            [null, 10001],
                            [130, 10002],
                            [55, 10003],
                            [800, 10004],
                        ],
                    },
                    {
                        target: metricTargetsEnum.eurosIdleConsumption,
                        datapoints: [
                            [0, 10001],
                            [30, 10002],
                            [33, 10003],
                            [null, 10004],
                        ],
                    },
                ],
                expectedResult: {
                    target: metricTargetsEnum.totalEurosOffIdleConsumption,
                    datapoints: [
                        [null, 10001],
                        [100, 10002],
                        [22, 10003],
                        [800, 10004],
                    ],
                },
            },
            // Undefined return.
            {
                data: [
                    {
                        target: metricTargetsEnum.eurosConsumption,
                        datapoints: [
                            [890, 10001],
                            [130, 10002],
                            [77, 10003],
                            [148, 10004],
                        ],
                    },
                    {
                        target: metricTargetsEnum.pMax,
                        datapoints: [
                            [0, 10001],
                            [30, 10002],
                            [32, 10003],
                            [null, 10004],
                        ],
                    },
                ],
                expectedResult: undefined,
            },
        ]
        caseList.forEach(({ data, expectedResult }) => {
            const result = getTotalOffIdleConsumptionData(data as IMetric[])
            expect(result).toEqual(expectedResult)
        })
    })
})

describe('nullifyTodayIdleConsumptionValue test with different cases', () => {
    test('different cases', () => {
        const todaysTimestamp = new Date().getTime()
        const caseList = [
            {
                data: [
                    {
                        target: metricTargetsEnum.idleConsumption,
                        datapoints: [
                            [null, 10001],
                            [null, 10002],
                            [null, 10003],
                            [0, todaysTimestamp],
                        ],
                    },
                ],
                expectedResult: [
                    {
                        target: metricTargetsEnum.idleConsumption,
                        datapoints: [
                            [null, 10001],
                            [null, 10002],
                            [null, 10003],
                            [null, todaysTimestamp],
                        ],
                    },
                ],
            },
            {
                data: [
                    {
                        target: metricTargetsEnum.eurosIdleConsumption,
                        datapoints: [
                            [0, 10001],
                            [30, 10002],
                            [33, 10003],
                            [800, todaysTimestamp],
                        ],
                    },
                ],
                expectedResult: [
                    {
                        target: metricTargetsEnum.eurosIdleConsumption,
                        datapoints: [
                            [0, 10001],
                            [30, 10002],
                            [33, 10003],
                            [null, todaysTimestamp],
                        ],
                    },
                ],
            },
            // Total Idle Consumption
            {
                data: [
                    {
                        target: metricTargetsEnum.consumption,
                        datapoints: [
                            [0, 10001],
                            [30, 10002],
                            [33, 10003],
                            [800, todaysTimestamp],
                        ],
                    },
                ],
                expectedResult: [
                    {
                        target: metricTargetsEnum.totalIdleConsumption,
                        datapoints: [
                            [0, 10001],
                            [30, 10002],
                            [33, 10003],
                            [800, todaysTimestamp],
                        ],
                    },
                ],
            },
            // Total Idle EurosConsumption
            {
                data: [
                    {
                        target: metricTargetsEnum.eurosConsumption,
                        datapoints: [
                            [0, 10001],
                            [30, 10002],
                            [33, 10003],
                            [800, todaysTimestamp],
                        ],
                    },
                ],
                expectedResult: [
                    {
                        target: metricTargetsEnum.totalEurosIdleConsumption,
                        datapoints: [
                            [0, 10001],
                            [30, 10002],
                            [33, 10003],
                            [800, todaysTimestamp],
                        ],
                    },
                ],
            },
            // Undefined return.
            {
                data: [
                    {
                        target: metricTargetsEnum.idleConsumption,
                        datapoints: [
                            [890, 10001],
                            [130, 10002],
                            [77, 10003],
                            [148, todaysTimestamp],
                        ],
                    },
                ],
                expectedResult: [
                    {
                        target: metricTargetsEnum.idleConsumption,
                        datapoints: [
                            [890, 10001],
                            [130, 10002],
                            [77, 10003],
                            [null, todaysTimestamp],
                        ],
                    },
                ],
            },
            // No Change return data.
            {
                data: [
                    {
                        target: metricTargetsEnum.pMax,
                        datapoints: [
                            [890, 10001],
                            [130, 10002],
                            [77, 10003],
                            [148, 10004],
                        ],
                    },
                ],
                expectedResult: [
                    {
                        target: metricTargetsEnum.pMax,
                        datapoints: [
                            [890, 10001],
                            [130, 10002],
                            [77, 10003],
                            [148, 10004],
                        ],
                    },
                ],
            },
        ]
        caseList.forEach(({ data, expectedResult }) => {
            const result = nullifyTodayIdleConsumptionValue(data as IMetric[])
            expect(result).toEqual(expectedResult)
        })
    })
})

describe('filterMetricsData tests', () => {
    test('when period is daily && isBasePeakOffPeakConsumptionEmpty is true', () => {
        const expectedConsumptionData = [{ datapoints: [[0, 0]], target: metricTargetsEnum.onlyConsumption }]
        const consumptionData = [
            {
                target: metricTargetsEnum.consumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.peakHourConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.offPeakHourConsumption,
                datapoints: [[0, 0]],
            },
        ]
        const caseList = [
            // Without pMax or Temperature targets.
            {
                data: consumptionData,
                expectedResult: expectedConsumptionData,
            },
            // With pMax targets.
            {
                data: [...consumptionData, { datapoints: [[99, 99]], target: metricTargetsEnum.pMax }],
                expectedResult: [
                    ...expectedConsumptionData,
                    { datapoints: [[99, 99]], target: metricTargetsEnum.pMax },
                ],
            },
        ]
        caseList.forEach(({ data, expectedResult }) => {
            const fileteredData = filterMetricsData(data, 'daily', true)

            expect(fileteredData).toStrictEqual(expectedResult)
        })
    })

    test('when period is daily && isBaseConsumptionEmpty is true and HP HC has data', () => {
        const expectedConsumptionData = [
            { datapoints: [[99, 99]], target: metricTargetsEnum.consumption },
            { datapoints: [[99, 99]], target: metricTargetsEnum.peakHourConsumption },
            { datapoints: [[99, 99]], target: metricTargetsEnum.offPeakHourConsumption },
        ]
        const consumptionData = [
            {
                target: metricTargetsEnum.baseConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.consumption,
                datapoints: [[99, 99]],
            },
            {
                target: metricTargetsEnum.peakHourConsumption,
                datapoints: [[99, 99]],
            },
            {
                target: metricTargetsEnum.offPeakHourConsumption,
                datapoints: [[99, 99]],
            },
        ]
        const caseList = [
            // Without pMax or Temperature targets.
            {
                data: consumptionData,
                expectedResult: expectedConsumptionData,
            },
            // With Temperature targets.
            {
                data: [...consumptionData, { datapoints: [[99, 99]], target: metricTargetsEnum.internalTemperature }],
                expectedResult: [
                    ...expectedConsumptionData,
                    { datapoints: [[99, 99]], target: metricTargetsEnum.internalTemperature },
                ],
            },
        ]
        caseList.forEach(({ data, expectedResult }) => {
            const fileteredData = filterMetricsData(data, 'daily', true)
            expect(fileteredData).toStrictEqual(expectedResult)
        })
    })
    test('when period is daily && isBaseConsumptionEmpty is not TRUE', () => {
        const expectedConsumptionData = [
            { datapoints: [[99, 99]], target: metricTargetsEnum.baseConsumption },
            { datapoints: [[99, 99]], target: metricTargetsEnum.consumption },
        ]
        const consumptionData = [
            {
                target: metricTargetsEnum.baseConsumption,
                datapoints: [[99, 99]],
            },
            {
                target: metricTargetsEnum.consumption,
                datapoints: [[99, 99]],
            },
            {
                target: metricTargetsEnum.peakHourConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.offPeakHourConsumption,
                datapoints: [[0, 0]],
            },
        ]
        const caseList = [
            // Without pMax or Temperature targets.
            {
                data: consumptionData,
                expectedResult: expectedConsumptionData,
            },
            // With Temperature targets.
            {
                data: [
                    ...consumptionData,
                    { datapoints: [[99, 99]], target: metricTargetsEnum.internalTemperature },
                    { datapoints: [[99, 99]], target: metricTargetsEnum.externalTemperature },
                ],
                expectedResult: [
                    ...expectedConsumptionData,
                    { datapoints: [[99, 99]], target: metricTargetsEnum.internalTemperature },
                    { datapoints: [[99, 99]], target: metricTargetsEnum.externalTemperature },
                ],
            },
        ]
        caseList.forEach(({ data, expectedResult }) => {
            // Result
            const resultData = filterMetricsData(data, 'daily', true)

            expect(resultData).toStrictEqual(expectedResult)
        })
    })

    test('when period is NOT daily && isBaseEuroPeakOffPeakConsumptionEmpty is empty and isEuroChart is true', () => {
        const expectedConsumptionData = [
            { datapoints: [[99, 99]], target: metricTargetsEnum.onlyEuroConsumption },
            { datapoints: [[99, 99]], target: metricTargetsEnum.subscriptionPrices },
        ]
        const consumptionData = [
            {
                target: metricTargetsEnum.eurosConsumption,
                datapoints: [[99, 99]],
            },
            {
                target: metricTargetsEnum.baseEuroConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.euroPeakHourConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.euroOffPeakConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.subscriptionPrices,
                datapoints: [[99, 99]],
            },
        ]
        const caseList = [
            // Without pMax or Temperature targets.
            {
                data: consumptionData,
                expectedResult: expectedConsumptionData,
            },
            // With Temperature targets.
            {
                data: [
                    ...consumptionData,
                    { datapoints: [[99, 99]], target: metricTargetsEnum.internalTemperature },
                    { datapoints: [[99, 99]], target: metricTargetsEnum.externalTemperature },
                ],
                expectedResult: [
                    ...expectedConsumptionData,
                    { datapoints: [[99, 99]], target: metricTargetsEnum.internalTemperature },
                    { datapoints: [[99, 99]], target: metricTargetsEnum.externalTemperature },
                ],
            },
        ]
        caseList.forEach(({ data, expectedResult }) => {
            const fileteredData = filterMetricsData(data, 'weekly', true)

            expect(fileteredData).toStrictEqual(expectedResult)
        })
    })

    test('When enphase is ON (false), we return consumption & autoconsumption', () => {
        const expectedConsumptionData = [
            { datapoints: [[99, 99]], target: metricTargetsEnum.consumption },
            { datapoints: [[99, 99]], target: metricTargetsEnum.autoconsumption },
        ]
        const consumptionData = [
            {
                target: metricTargetsEnum.consumption,
                datapoints: [[99, 99]],
            },
            {
                target: metricTargetsEnum.autoconsumption,
                datapoints: [[99, 99]],
            },
        ]
        const caseList = [
            // Without pMax or Temperature targets.
            {
                data: consumptionData,
                expectedResult: expectedConsumptionData,
            },
            // With Temperature targets.
            {
                data: [
                    ...consumptionData,
                    { datapoints: [[99, 99]], target: metricTargetsEnum.internalTemperature },
                    { datapoints: [[99, 99]], target: metricTargetsEnum.externalTemperature },
                ],
                expectedResult: [
                    ...expectedConsumptionData,
                    { datapoints: [[99, 99]], target: metricTargetsEnum.internalTemperature },
                    { datapoints: [[99, 99]], target: metricTargetsEnum.externalTemperature },
                ],
            },
        ]
        caseList.forEach(({ data, expectedResult }) => {
            const fileteredData = filterMetricsData(data, 'weekly', false)

            expect(fileteredData).toStrictEqual(expectedResult)
        })
    })
    test('when one of the TEMPO targets has data (BLEU), return that target', () => {
        const consumptionData = [
            {
                target: metricTargetsEnum.baseConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.consumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.peakHourConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.offPeakHourConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.peakHourBlueTempoConsumption,
                datapoints: [[99, 99]],
            },
            {
                target: metricTargetsEnum.offPeakHourBlueTempoConsumption,
                datapoints: [[99, 99]],
            },
            {
                target: metricTargetsEnum.peakHourRedTempoConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.offPeakHourRedTempoConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.peakHourWhiteTempoConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.offPeakHourWhiteTempoConsumption,
                datapoints: [[0, 0]],
            },
        ]

        const expectedConsumptionData = [
            { datapoints: [[99, 99]], target: metricTargetsEnum.peakHourBlueTempoConsumption },
            { datapoints: [[99, 99]], target: metricTargetsEnum.offPeakHourBlueTempoConsumption },
        ]

        const caseList = [
            // Without pMax or Temperature targets.
            {
                data: consumptionData,
                expectedResult: expectedConsumptionData,
            },
            // With Temperature targets.
            {
                data: [
                    ...consumptionData,
                    { datapoints: [[99, 99]], target: metricTargetsEnum.internalTemperature },
                    { datapoints: [[99, 99]], target: metricTargetsEnum.externalTemperature },
                ],
                expectedResult: [
                    ...expectedConsumptionData,
                    { datapoints: [[99, 99]], target: metricTargetsEnum.internalTemperature },
                    { datapoints: [[99, 99]], target: metricTargetsEnum.externalTemperature },
                ],
            },
        ]
        // eslint-disable-next-line sonarjs/no-identical-functions
        caseList.forEach(({ data, expectedResult }) => {
            const fileteredData = filterMetricsData(data, 'daily', true)

            expect(fileteredData).toStrictEqual(expectedResult)
        })
    })
    test('when one of the TEMPO targets has data (ROUGE), return that target', () => {
        const consumptionData = [
            {
                target: metricTargetsEnum.baseConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.consumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.peakHourConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.offPeakHourConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.peakHourBlueTempoConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.offPeakHourBlueTempoConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.peakHourRedTempoConsumption,
                datapoints: [[99, 99]],
            },
            {
                target: metricTargetsEnum.offPeakHourRedTempoConsumption,
                datapoints: [[99, 99]],
            },
            {
                target: metricTargetsEnum.peakHourWhiteTempoConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.offPeakHourWhiteTempoConsumption,
                datapoints: [[0, 0]],
            },
        ]

        const expectedConsumptionData = [
            { datapoints: [[99, 99]], target: metricTargetsEnum.peakHourRedTempoConsumption },
            { datapoints: [[99, 99]], target: metricTargetsEnum.offPeakHourRedTempoConsumption },
        ]

        const caseList = [
            // Without pMax or Temperature targets.
            {
                data: consumptionData,
                expectedResult: expectedConsumptionData,
            },
            // With Temperature targets.
            {
                data: [
                    ...consumptionData,
                    { datapoints: [[99, 99]], target: metricTargetsEnum.internalTemperature },
                    { datapoints: [[99, 99]], target: metricTargetsEnum.externalTemperature },
                ],
                expectedResult: [
                    ...expectedConsumptionData,
                    { datapoints: [[99, 99]], target: metricTargetsEnum.internalTemperature },
                    { datapoints: [[99, 99]], target: metricTargetsEnum.externalTemperature },
                ],
            },
        ]
        // eslint-disable-next-line sonarjs/no-identical-functions
        caseList.forEach(({ data, expectedResult }) => {
            const fileteredData = filterMetricsData(data, 'daily', true)

            expect(fileteredData).toStrictEqual(expectedResult)
        })
    })
    test('when one of the TEMPO targets has data (BLANC), return that target', () => {
        const consumptionData = [
            {
                target: metricTargetsEnum.baseConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.consumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.peakHourConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.offPeakHourConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.peakHourBlueTempoConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.offPeakHourBlueTempoConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.peakHourRedTempoConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.offPeakHourRedTempoConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.peakHourWhiteTempoConsumption,
                datapoints: [[99, 99]],
            },
            {
                target: metricTargetsEnum.offPeakHourWhiteTempoConsumption,
                datapoints: [[99, 99]],
            },
        ]

        const expectedConsumptionData = [
            { datapoints: [[99, 99]], target: metricTargetsEnum.peakHourWhiteTempoConsumption },
            { datapoints: [[99, 99]], target: metricTargetsEnum.offPeakHourWhiteTempoConsumption },
        ]

        const caseList = [
            // Without pMax or Temperature targets.
            {
                data: consumptionData,
                expectedResult: expectedConsumptionData,
            },
            // With Temperature targets.
            {
                data: [
                    ...consumptionData,
                    { datapoints: [[99, 99]], target: metricTargetsEnum.internalTemperature },
                    { datapoints: [[99, 99]], target: metricTargetsEnum.externalTemperature },
                ],
                expectedResult: [
                    ...expectedConsumptionData,
                    { datapoints: [[99, 99]], target: metricTargetsEnum.internalTemperature },
                    { datapoints: [[99, 99]], target: metricTargetsEnum.externalTemperature },
                ],
            },
        ]
        // eslint-disable-next-line sonarjs/no-identical-functions
        caseList.forEach(({ data, expectedResult }) => {
            const fileteredData = filterMetricsData(data, 'daily', true)

            expect(fileteredData).toStrictEqual(expectedResult)
        })
    })

    test('when chart is euro, and there is tempo data', () => {
        const consumptionData = [
            {
                target: metricTargetsEnum.eurosConsumption,
                datapoints: [[99, 99]],
            },
            {
                target: metricTargetsEnum.baseEuroConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.euroPeakHourConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.euroOffPeakConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.subscriptionPrices,
                datapoints: [[99, 99]],
            },
            {
                target: metricTargetsEnum.euroPeakHourBlueTempoConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.euroOffPeakHourBlueTempoConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.euroPeakHourRedTempoConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.euroOffPeakHourRedTempoConsumption,
                datapoints: [[0, 0]],
            },
            {
                target: metricTargetsEnum.euroPeakHourWhiteTempoConsumption,
                datapoints: [[99, 99]],
            },
            {
                target: metricTargetsEnum.euroOffPeakHourWhiteTempoConsumption,
                datapoints: [[99, 99]],
            },
        ]

        const expectedConsumptionData = [
            {
                datapoints: [[99, 99]],
                target: metricTargetsEnum.eurosConsumption,
            },
            {
                datapoints: [[99, 99]],
                target: metricTargetsEnum.subscriptionPrices,
            },
            {
                datapoints: [[0, 0]],
                target: metricTargetsEnum.euroPeakHourBlueTempoConsumption,
            },
            {
                datapoints: [[0, 0]],
                target: metricTargetsEnum.euroOffPeakHourBlueTempoConsumption,
            },
            {
                datapoints: [[0, 0]],
                target: metricTargetsEnum.euroPeakHourRedTempoConsumption,
            },
            {
                datapoints: [[0, 0]],
                target: metricTargetsEnum.euroOffPeakHourRedTempoConsumption,
            },
            {
                datapoints: [[99, 99]],
                target: metricTargetsEnum.euroPeakHourWhiteTempoConsumption,
            },
            {
                datapoints: [[99, 99]],
                target: metricTargetsEnum.euroOffPeakHourWhiteTempoConsumption,
            },
        ]

        const caseList = [
            {
                data: consumptionData,
                expectedResult: expectedConsumptionData,
            },
            {
                data: consumptionData,
                expectedResult: expectedConsumptionData,
            },
        ]
        // eslint-disable-next-line sonarjs/no-identical-functions
        caseList.forEach(({ data, expectedResult }) => {
            const fileteredData = filterMetricsData(data, 'weekly', true)

            expect(fileteredData).toStrictEqual(expectedResult)
        })
    })
})
