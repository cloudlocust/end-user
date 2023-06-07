import { reduxedRender } from 'src/common/react-platform-components/test'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import AnalysisChartCircleContent from 'src/modules/Analysis/components/AnalysisChartCircleContent'
import { waitFor } from '@testing-library/react'

/**
 * Mocking the AnalysisChartCircleContent component props.
 *
 * DateReference will be 1 Jan 2023, because FAKE_YEAR mock Data goes from 1 jan 2022 , to 1 Dec 2022.
 *
 */
const mockAnalysisChartCircleContent = {
    dateReferenceConsumptionValue: '2023-01-01T00:00:00.000Z',
    filters: [],
}

const totalConsumption = 100
const PREVIOUS_MONTH_DATE_TEXT = '12/2022'
const PREVIOUS_YEAR_DATE_TEXT = '01/2022'
// eslint-disable-next-line jsdoc/require-jsdoc
const metricsData: IMetric[] = [
    {
        target: metricTargetsEnum.consumption,
        datapoints: [
            // January 2022, compared to last year its decrease of 50%, because 200 represents last year and 100 represents reference, so from 200 to 100 its 50% decrease.
            [200, 1640995200000],
            // February 2022
            [20, 1643673600000],
            // March 2022
            [41, 1646092800000],
            // April 2022
            [38, 1648771200000],
            // Mai 2022
            [45, 1651363200000],
            // June 2022
            [62, 1654041600000],
            // July 2022
            [42, 1656633600000],
            // August 2022
            [32, 1659312000000],
            // September 2022
            [66, 1661990400000],
            // October 2022
            [37, 1664582400000],
            // November 2022
            [24, 1667260800000],
            // December 2022, compared to last year its increase of 100%, because 50 represents last month and we have 100 as reference, so from 50 to 100 its 100% increase.
            [50, 1672444800000],
            // January 2023, Represent the reference month (where we are comparing).
            [totalConsumption, 1672531200000],
        ],
    },
    {
        target: metricTargetsEnum.eurosConsumption,
        datapoints: [
            // January 2022.
            [0, 1640995200000],
            // February 2022
            [0, 1643673600000],
            // March 2022
            [0, 1646092800000],
            // April 2022
            [0, 1648771200000],
            // Mai 2022
            [0, 1651363200000],
            // June 2022
            [0, 1654041600000],
            // July 2022
            [0, 1656633600000],
            // August 2022
            [0, 1659312000000],
            // September 2022
            [0, 1661990400000],
            // October 2022
            [0, 1664582400000],
            // November 2022
            [0, 1667260800000],
            // December 2022.
            [0, 1672444800000],
            // January 2023, Represent the reference month (where we are comparing).
            [75, 1672531200000],
        ],
    },
]
let mockMetricsData: IMetric[] = JSON.parse(JSON.stringify(metricsData))
let mockIsMetricsLoading = false

// Increasse
const INCREASE_PERCENTAGE_CHANGE = 'trending_up'
const INCREASE_COLOR_ICON_CLASSNAME = '.MuiIcon-colorError'
// Decrease
const DECREASE_PERCENTAGE_CHANGE = 'trending_down'
const DECREASE_COLOR_ICON_CLASSNAME = '.MuiIcon-colorSuccess'

// Mock metricsHook
jest.mock('src/modules/Metrics/metricsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMetrics: () => ({
        data: mockMetricsData,
        isMetricsLoading: mockIsMetricsLoading,
        /*
         * Faking:
         *  - the comparaison between 1 Jan 2023 and fake data 1 Jan 2022.
         *  - the comparaison between 1 Jan 2023 and fake data December 2022.
         */
        range: {
            from: '2022-01-01T00:00:00.000Z',
            to: '2023-02-31T23:59:59.999Z',
        },
    }),
}))

const mockSetTotalConsumption = jest.fn()
/**
 * Mocking the Zustand Analysis Store.
 */
jest.mock('src/modules/Analysis/store/analysisStore', () => ({
    /**
     * Mock the set total consumption returned from useAnalysisStore.
     *
     * @returns Total Consumption Value.
     */
    useAnalysisStore: () => mockSetTotalConsumption,
}))

describe('AnalysisChartCircleContent test', () => {
    test('when data given, it should render all information', async () => {
        const { getByText } = reduxedRender(<AnalysisChartCircleContent {...mockAnalysisChartCircleContent} />)

        // Increase compared to previous month
        // Its increase of 50%, because 50 represents last month and we have 100 as reference, so from 50 to 100 its 100% increase.
        const previousMonthChangeDiv = getByText(PREVIOUS_MONTH_DATE_TEXT, { exact: false }).parentElement!
        expect(previousMonthChangeDiv.querySelector(INCREASE_COLOR_ICON_CLASSNAME)).toBeInTheDocument()
        expect(previousMonthChangeDiv.querySelector(INCREASE_COLOR_ICON_CLASSNAME)!.textContent).toBe(
            INCREASE_PERCENTAGE_CHANGE,
        )
        expect(getByText('50.0', { exact: false })).toBeTruthy()

        // Decrease compared to last year
        // Its decrease of 50%, because 200 represents last year and 100 represents reference, so from 200 to 100 its 50% decrease.
        const previousYearChangeDiv = getByText(PREVIOUS_YEAR_DATE_TEXT, { exact: false }).parentElement!
        expect(previousYearChangeDiv.querySelector(DECREASE_COLOR_ICON_CLASSNAME)).toBeInTheDocument()
        expect(previousYearChangeDiv.querySelector(DECREASE_COLOR_ICON_CLASSNAME)!.textContent).toBe(
            DECREASE_PERCENTAGE_CHANGE,
        )
        expect(getByText('100.0', { exact: false })).toBeTruthy()
        const TOTAL_CONSUMPTION_TEXT = `${totalConsumption} Wh`
        const TOTAL_EUROS_CONSUMPTION_TEXT = `75.00 €`
        expect(getByText(TOTAL_CONSUMPTION_TEXT)).toBeTruthy()
        expect(getByText(TOTAL_EUROS_CONSUMPTION_TEXT)).toBeTruthy()
    })
    test('when changePercentage is 0 for previousMonth or previousYear it should not be shown', async () => {
        // Last year value is 0, thus changePercentage is 0.
        mockMetricsData[0].datapoints[0][0] = 0
        const { getByText } = reduxedRender(<AnalysisChartCircleContent {...mockAnalysisChartCircleContent} />)

        // Previous Month is shown
        expect(getByText(PREVIOUS_MONTH_DATE_TEXT, { exact: false })).toBeTruthy()
        // Last year not shown
        expect(() => getByText(PREVIOUS_YEAR_DATE_TEXT, { exact: false })).toThrow()
    })
    test('when isMetricsLoading, no data available should be shown', async () => {
        mockIsMetricsLoading = true
        const { container } = reduxedRender(<AnalysisChartCircleContent {...mockAnalysisChartCircleContent} />)
        // When metricsLoading there is nothing to be shown empty DOM
        expect(container.innerHTML).toBe('')
    })
    test('when data is empty, no data available should be shown', async () => {
        mockMetricsData[0].datapoints = []
        const { container } = reduxedRender(<AnalysisChartCircleContent {...mockAnalysisChartCircleContent} />)
        // When Data is empty, there is nothing to be shown empty DOM
        expect(container.innerHTML).toBe('')
    })
    test('when data, store setTotalConsumption should be called with totalConsumption', async () => {
        mockMetricsData = metricsData
        mockIsMetricsLoading = false
        reduxedRender(<AnalysisChartCircleContent {...mockAnalysisChartCircleContent} />)

        await waitFor(() => {
            expect(mockSetTotalConsumption).toHaveBeenCalledWith(totalConsumption)
        })
    })
})
