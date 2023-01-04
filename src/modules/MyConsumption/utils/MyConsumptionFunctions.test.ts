import {
    isEqualDates,
    generateXAxisValues,
    fillApexChartsAxisMissingValues,
    fillApexChartsDatetimeSeriesMissingValues,
    formatMetricFilter,
    convertToDateFnsPeriod,
    isMissingYAxisValues,
    getDateWithoutTimezoneOffset,
    addPeriod,
    subPeriod,
    filterPmaxAndEurosConsumptionTargetFromVisibleChartTargets,
} from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { IMetric, metricIntervalType, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { FAKE_WEEK_DATA, FAKE_DAY_DATA, FAKE_MONTH_DATA, FAKE_YEAR_DATA } from 'src/mocks/handlers/metrics'
import { getRange } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import {
    convertMetricsDataToApexChartsAxisValues,
    convertMetricsDataToApexChartsDateTimeAxisValues,
} from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import dayjs from 'dayjs'
import { dateFnsPeriod, periodType } from 'src/modules/MyConsumption/myConsumptionTypes.d'

// eslint-disable-next-line jsdoc/require-jsdoc
let interval: metricIntervalType = '2m'

// GMT: Thursday, 23 June 2022 00:00:00
const timestamp1 = 1655942400000

// FAKE_WEEK_DATA starts at 1st Jan and ends at 7th Jan.
// GMT: Saturday, 8 January 2022 01:00:00
const fakeWeekTimestamp = 1641603600000
/**
 * Fake Range for the fake timestamp, according to the FAKE_WEEK_DATA.
 */
const fakeWeekRange = {
    from: dayjs
        .utc(new Date(fakeWeekTimestamp).toUTCString())
        .subtract(1, 'week')
        .startOf('day')
        .toDate()
        .toISOString(),
    to: dayjs(new Date(fakeWeekTimestamp)).subtract(1, 'day').startOf('day').toDate().toISOString(),
}

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
        expect(xAxisValues.length).toBeGreaterThanOrEqual(30)
        expect(xAxisValues.length).toBeLessThanOrEqual(32)

        // When period is yearly we have correct length of xAxisValues.
        interval = '1M'
        xAxisValues = generateXAxisValues('yearly', getRange('year'))
        // If interval is 1d and period is yearly , then length should be 13 because we start from the current month till the month of next year.
        expect(xAxisValues).toHaveLength(13)
    })

    test('fillApexChartsAxisMissingValues test with different cases', async () => {
        // When Mock week has only three values values, then filling of xAxisValues should be 7, and mappin is done correctly the MOCK_WEEK_MISSING_DATA[3] should be at index 6 on the nex filledApexChartsValues.
        const MOCK_YEAR_MISSING_DATA = [FAKE_YEAR_DATA[0], FAKE_YEAR_DATA[1], FAKE_YEAR_DATA[11]]
        mockMetricsData[0].datapoints = MOCK_YEAR_MISSING_DATA
        let apexChartsMissingValues = convertMetricsDataToApexChartsAxisValues(mockMetricsData)
        let ApexChartsFilledAxisValues = fillApexChartsAxisMissingValues(
            apexChartsMissingValues,
            'yearly',
            fakeYearRange,
        )
        expect(ApexChartsFilledAxisValues.xAxisSeries[0]).toHaveLength(13)
        expect(ApexChartsFilledAxisValues.yAxisSeries[0].data).toHaveLength(13)
        expect(ApexChartsFilledAxisValues.yAxisSeries[0].data[0]).toEqual(MOCK_YEAR_MISSING_DATA[0][0])
        expect(ApexChartsFilledAxisValues.yAxisSeries[0].data[1]).toEqual(MOCK_YEAR_MISSING_DATA[1][0])
        expect(ApexChartsFilledAxisValues.yAxisSeries[0].data[2]).toBeNull()
        expect(ApexChartsFilledAxisValues.yAxisSeries[0].data[3]).toBeNull()
        expect(ApexChartsFilledAxisValues.yAxisSeries[0].data[4]).toBeNull()
        expect(ApexChartsFilledAxisValues.yAxisSeries[0].data[5]).toBeNull()
        expect(ApexChartsFilledAxisValues.yAxisSeries[0].data[6]).toBeNull()
        expect(ApexChartsFilledAxisValues.yAxisSeries[0].data[7]).toBeNull()
        expect(ApexChartsFilledAxisValues.yAxisSeries[0].data[8]).toBeNull()
        expect(ApexChartsFilledAxisValues.yAxisSeries[0].data[9]).toBeNull()
        expect(ApexChartsFilledAxisValues.yAxisSeries[0].data[10]).toBeNull()
        expect(ApexChartsFilledAxisValues.yAxisSeries[0].data[11]).toEqual(MOCK_YEAR_MISSING_DATA[2][0])
        expect(ApexChartsFilledAxisValues.yAxisSeries[0].data[12]).toBeNull()

        // When yAxisSeries is empty nothing should changes
        apexChartsMissingValues = convertMetricsDataToApexChartsAxisValues([])
        ApexChartsFilledAxisValues = fillApexChartsAxisMissingValues(apexChartsMissingValues, 'yearly', fakeYearRange)
        expect(ApexChartsFilledAxisValues.xAxisSeries).toHaveLength(0)
        expect(ApexChartsFilledAxisValues.yAxisSeries).toHaveLength(0)
    }, 20000)

    test('fillApexChartsDatetimeSeriesMissingValues test with different cases', async () => {
        // When Mock year has only three values values, then datapoints length should be 13.
        const MOCK_YEAR_MISSING_DATA = [FAKE_YEAR_DATA[0], FAKE_YEAR_DATA[1], FAKE_YEAR_DATA[11]]
        mockMetricsData[0].datapoints = MOCK_YEAR_MISSING_DATA
        let apexChartsDatetimeMissingValues = convertMetricsDataToApexChartsDateTimeAxisValues(mockMetricsData)
        let ApexChartsDatetimeFilledValues = fillApexChartsDatetimeSeriesMissingValues(
            apexChartsDatetimeMissingValues,
            'yearly',
            fakeYearRange,
        )
        expect(ApexChartsDatetimeFilledValues[0].data).toHaveLength(13)
        expect((ApexChartsDatetimeFilledValues[0].data[0] as [number, number])[1]).toEqual(MOCK_YEAR_MISSING_DATA[0][0])
        expect((ApexChartsDatetimeFilledValues[0].data[1] as [number, number])[1]).toEqual(MOCK_YEAR_MISSING_DATA[1][0])
        expect((ApexChartsDatetimeFilledValues[0].data[2] as [number, number])[1]).toBeNull()
        expect((ApexChartsDatetimeFilledValues[0].data[3] as [number, number])[1]).toBeNull()
        expect((ApexChartsDatetimeFilledValues[0].data[4] as [number, number])[1]).toBeNull()
        expect((ApexChartsDatetimeFilledValues[0].data[5] as [number, number])[1]).toBeNull()
        expect((ApexChartsDatetimeFilledValues[0].data[6] as [number, number])[1]).toBeNull()
        expect((ApexChartsDatetimeFilledValues[0].data[7] as [number, number])[1]).toBeNull()
        expect((ApexChartsDatetimeFilledValues[0].data[8] as [number, number])[1]).toBeNull()
        expect((ApexChartsDatetimeFilledValues[0].data[9] as [number, number])[1]).toBeNull()
        expect((ApexChartsDatetimeFilledValues[0].data[10] as [number, number])[1]).toBeNull()
        expect((ApexChartsDatetimeFilledValues[0].data[11] as [number, number])[1]).toEqual(
            MOCK_YEAR_MISSING_DATA[2][0],
        )
        expect((ApexChartsDatetimeFilledValues[0].data[12] as [number, number])[1]).toBeNull()

        // When yAxisSeries is empty nothing should changes
        apexChartsDatetimeMissingValues = convertMetricsDataToApexChartsDateTimeAxisValues([])
        ApexChartsDatetimeFilledValues = fillApexChartsDatetimeSeriesMissingValues(
            apexChartsDatetimeMissingValues,
            'weekly',
            fakeWeekRange,
        )
        expect(ApexChartsDatetimeFilledValues).toHaveLength(0)
    }, 70000)
    test('formatMetricFilter test', async () => {
        const FAKE_GUID = '123'
        let resultMetricFilter = formatMetricFilter(FAKE_GUID)
        expect(resultMetricFilter).toStrictEqual([
            {
                key: 'meter_guid',
                operator: '=',
                value: FAKE_GUID,
            },
        ])
    })
    test('isMissingYAxisValues test', async () => {
        interval = '2m'
        // When day period, and data doesn't contains all day values.
        mockMetricsData[0].datapoints = FAKE_DAY_DATA
        let ApexChartsFilledAxisValues = convertMetricsDataToApexChartsAxisValues(mockMetricsData)
        let isMissingValues = isMissingYAxisValues(ApexChartsFilledAxisValues.yAxisSeries[0].data, 'daily')
        expect(isMissingValues).toBeTruthy()

        // When week period, and data contains all week values.
        mockMetricsData[0].datapoints = FAKE_WEEK_DATA
        ApexChartsFilledAxisValues = convertMetricsDataToApexChartsAxisValues(mockMetricsData)
        isMissingValues = isMissingYAxisValues(ApexChartsFilledAxisValues.yAxisSeries[0].data, 'weekly')
        expect(isMissingValues).toBeFalsy()

        // When week period, and data doesn't contains all week values.
        mockMetricsData[0].datapoints = FAKE_WEEK_DATA.filter((v, i) => i !== 0)
        ApexChartsFilledAxisValues = convertMetricsDataToApexChartsAxisValues(mockMetricsData)
        isMissingValues = isMissingYAxisValues(ApexChartsFilledAxisValues.yAxisSeries[0].data, 'weekly')
        expect(isMissingValues).toBeTruthy()

        // When month period, and data contains all month values.
        mockMetricsData[0].datapoints = FAKE_MONTH_DATA
        ApexChartsFilledAxisValues = convertMetricsDataToApexChartsAxisValues(mockMetricsData)
        isMissingValues = isMissingYAxisValues(ApexChartsFilledAxisValues.yAxisSeries[0].data, 'monthly')
        expect(isMissingValues).toBeFalsy()

        // When month period, and data doesn't contains all month values.
        mockMetricsData[0].datapoints = FAKE_MONTH_DATA.filter((v, i) => i !== 0)
        ApexChartsFilledAxisValues = convertMetricsDataToApexChartsAxisValues(mockMetricsData)
        isMissingValues = isMissingYAxisValues(ApexChartsFilledAxisValues.yAxisSeries[0].data, 'yearly')
        expect(isMissingValues).toBeTruthy()

        // When year period, and data contains all year values.
        mockMetricsData[0].datapoints = FAKE_YEAR_DATA
        mockMetricsData[0].datapoints.push([33, timestamp1])
        ApexChartsFilledAxisValues = convertMetricsDataToApexChartsAxisValues(mockMetricsData)
        isMissingValues = isMissingYAxisValues(ApexChartsFilledAxisValues.yAxisSeries[0].data, 'yearly')
        expect(isMissingValues).toBeFalsy()

        // When year period, and data doesn't contains all week values.
        mockMetricsData[0].datapoints = FAKE_YEAR_DATA.filter((v, i) => i !== 0)
        ApexChartsFilledAxisValues = convertMetricsDataToApexChartsAxisValues(mockMetricsData)
        isMissingValues = isMissingYAxisValues(ApexChartsFilledAxisValues.yAxisSeries[0].data, 'yearly')
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

    test('filterPmaxAndEurosConsumptionTargetFromVisibleChartTargets test with different cases', async () => {
        const caseList = [
            // Filtering eurosConsumption Target.
            {
                visibleTargetsChart: [metricTargetsEnum.eurosConsumption, metricTargetsEnum.internalTemperature],
                expectedResult: [
                    metricTargetsEnum.consumption,
                    metricTargetsEnum.autoconsumption,
                    metricTargetsEnum.internalTemperature,
                ],
            },
            // Filtering pMax Target.
            {
                visibleTargetsChart: [metricTargetsEnum.eurosConsumption, metricTargetsEnum.pMax],
                expectedResult: [metricTargetsEnum.consumption, metricTargetsEnum.autoconsumption],
            },
            // Everything's alright.
            {
                visibleTargetsChart: [
                    metricTargetsEnum.consumption,
                    metricTargetsEnum.autoconsumption,
                    metricTargetsEnum.internalTemperature,
                    metricTargetsEnum.externalTemperature,
                ],
                expectedResult: [
                    metricTargetsEnum.consumption,
                    metricTargetsEnum.autoconsumption,
                    metricTargetsEnum.internalTemperature,
                    metricTargetsEnum.externalTemperature,
                ],
            },
        ]
        caseList.forEach(({ visibleTargetsChart, expectedResult }) => {
            const result = filterPmaxAndEurosConsumptionTargetFromVisibleChartTargets(visibleTargetsChart)
            expect(result).toEqual(expectedResult)
        })
    })
})
