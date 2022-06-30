import {
    isEqualDates,
    generateXAxisValues,
    fillApexChartsAxisMissingValues,
    formatMetricFilter,
    isMissingApexChartsAxisValues,
} from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { IMetric, metricIntervalType } from 'src/modules/Metrics/Metrics'
import { FAKE_WEEK_DATA, FAKE_DAY_DATA, FAKE_MONTH_DATA, FAKE_YEAR_DATA } from 'src/mocks/handlers/metrics'
import { getRange } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { convertMetricsDataToApexChartsAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import dayjs from 'dayjs'

// eslint-disable-next-line jsdoc/require-jsdoc
let interval: metricIntervalType = '2min'

// GMT: Thursday, 23 June 2022 00:00:00
const timestamp1 = 1655942400000

// FAKE_WEEK_DATA starts at 1st Jan and ends at 7th Jan.
// GMT: Saturday, 8 January 2022 01:00:00
const fakeWeekTimestamp = 1641603600000
/**
 * Fake Range for the fake timestamp, according to the FAKE_WEEK_DATA.
 */
const fakeWeekRange = {
    from: dayjs(new Date(fakeWeekTimestamp)).subtract(1, 'week').startOf('day').toDate().toISOString(),
    to: dayjs(new Date(fakeWeekTimestamp)).subtract(1, 'day').startOf('day').toDate().toISOString(),
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
        interval = '1 month'
        xAxisValues = generateXAxisValues('yearly', getRange('year'))
        // If interval is 1d and period is yearly , then length should be 13 because we start from the current month till the month of next year.
        expect(xAxisValues).toHaveLength(13)
    })

    test('fillApexChartsAxisMissingValues test with different cases', async () => {
        // When Mock week has only three values values, then filling of xAxisValues should be 7, and mappin is done correctly the MOCK_WEEK_MISSING_DATA[3] should be at index 6 on the nex filledApexChartsValues.
        const MOCK_WEEK_MISSING_DATA = [FAKE_WEEK_DATA[0], FAKE_WEEK_DATA[1], FAKE_WEEK_DATA[6]]
        mockMetricsData[0].datapoints = MOCK_WEEK_MISSING_DATA
        let apexChartsMissingValues = convertMetricsDataToApexChartsAxisValues(mockMetricsData)
        let ApexChartsFilledAxisValues = fillApexChartsAxisMissingValues(
            apexChartsMissingValues,
            'weekly',
            fakeWeekRange,
        )
        expect(ApexChartsFilledAxisValues.xAxisValues).toHaveLength(7)
        expect(ApexChartsFilledAxisValues.yAxisSeries[0].data).toHaveLength(7)
        expect(ApexChartsFilledAxisValues.yAxisSeries[0].data[0]).toEqual(MOCK_WEEK_MISSING_DATA[0][0])
        expect(ApexChartsFilledAxisValues.yAxisSeries[0].data[1]).toEqual(MOCK_WEEK_MISSING_DATA[1][0])
        expect(ApexChartsFilledAxisValues.yAxisSeries[0].data[2]).toBeNull()
        expect(ApexChartsFilledAxisValues.yAxisSeries[0].data[3]).toBeNull()
        expect(ApexChartsFilledAxisValues.yAxisSeries[0].data[4]).toBeNull()
        expect(ApexChartsFilledAxisValues.yAxisSeries[0].data[5]).toBeNull()
        expect(ApexChartsFilledAxisValues.yAxisSeries[0].data[6]).toEqual(MOCK_WEEK_MISSING_DATA[2][0])

        // When yAxisSeries is empty nothing should changes
        apexChartsMissingValues = convertMetricsDataToApexChartsAxisValues([])
        ApexChartsFilledAxisValues = fillApexChartsAxisMissingValues(apexChartsMissingValues, 'weekly', fakeWeekRange)
        expect(ApexChartsFilledAxisValues.xAxisValues).toHaveLength(0)
        expect(ApexChartsFilledAxisValues.yAxisSeries).toHaveLength(0)
    }, 20000)

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
    test('isMissingApexChartsAxisValues test', async () => {
        interval = '2min'
        // When day period, and data doesn't contains all day values.
        mockMetricsData[0].datapoints = FAKE_DAY_DATA
        let ApexChartsFilledAxisValues = convertMetricsDataToApexChartsAxisValues(mockMetricsData)
        let isMissingValues = isMissingApexChartsAxisValues(ApexChartsFilledAxisValues, 'daily')
        expect(isMissingValues).toBeTruthy()

        // When week period, and data contains all week values.
        mockMetricsData[0].datapoints = FAKE_WEEK_DATA
        ApexChartsFilledAxisValues = convertMetricsDataToApexChartsAxisValues(mockMetricsData)
        isMissingValues = isMissingApexChartsAxisValues(ApexChartsFilledAxisValues, 'weekly')
        expect(isMissingValues).toBeFalsy()

        // When week period, and data doesn't contains all week values.
        mockMetricsData[0].datapoints = FAKE_WEEK_DATA.filter((v, i) => i !== 0)
        ApexChartsFilledAxisValues = convertMetricsDataToApexChartsAxisValues(mockMetricsData)
        isMissingValues = isMissingApexChartsAxisValues(ApexChartsFilledAxisValues, 'weekly')
        expect(isMissingValues).toBeTruthy()

        // When month period, and data contains all month values.
        mockMetricsData[0].datapoints = FAKE_MONTH_DATA
        ApexChartsFilledAxisValues = convertMetricsDataToApexChartsAxisValues(mockMetricsData)
        isMissingValues = isMissingApexChartsAxisValues(ApexChartsFilledAxisValues, 'monthly')
        expect(isMissingValues).toBeFalsy()

        // When month period, and data doesn't contains all month values.
        mockMetricsData[0].datapoints = FAKE_MONTH_DATA.filter((v, i) => i !== 0)
        ApexChartsFilledAxisValues = convertMetricsDataToApexChartsAxisValues(mockMetricsData)
        isMissingValues = isMissingApexChartsAxisValues(ApexChartsFilledAxisValues, 'yearly')
        expect(isMissingValues).toBeTruthy()

        // When year period, and data contains all year values.
        mockMetricsData[0].datapoints = FAKE_YEAR_DATA
        mockMetricsData[0].datapoints.push([33, timestamp1])
        ApexChartsFilledAxisValues = convertMetricsDataToApexChartsAxisValues(mockMetricsData)
        isMissingValues = isMissingApexChartsAxisValues(ApexChartsFilledAxisValues, 'yearly')
        expect(isMissingValues).toBeFalsy()

        // When year period, and data doesn't contains all week values.
        mockMetricsData[0].datapoints = FAKE_YEAR_DATA.filter((v, i) => i !== 0)
        ApexChartsFilledAxisValues = convertMetricsDataToApexChartsAxisValues(mockMetricsData)
        isMissingValues = isMissingApexChartsAxisValues(ApexChartsFilledAxisValues, 'yearly')
        expect(isMissingValues).toBeTruthy()
    })
})
