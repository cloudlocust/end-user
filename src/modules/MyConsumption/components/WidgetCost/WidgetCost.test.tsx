import { reduxedRender } from 'src/common/react-platform-components/test'
import { IMetric, metricFiltersType, metricIntervalType, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widget/Widget'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { BrowserRouter as Router } from 'react-router-dom'
import { TEST_SUCCESS_WEEK_METRICS } from 'src/mocks/handlers/metrics'
import { ConsumptionWidgetsMetricsProvider } from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/ConsumptionWidgetsMetricsContext'
import { WidgetCost } from 'src/modules/MyConsumption/components/WidgetCost'

const TOTAL_COST_TEXT = 'Coût Total'
const TOTAL_COST_INCLUDING_SUBSCRIPTIONS_TEXT = 'Coût total abonnement compris'
const EURO_UNIT_TEXT = '€'
const MESSING_DATA_TEXT = 'sur la base des données disponibles'

const circularProgressClassname = '	.MuiCircularProgress-root'

const TEST_WEEK_DATA: IMetric[] = TEST_SUCCESS_WEEK_METRICS([
    metricTargetsEnum.eurosConsumption,
    metricTargetsEnum.subscriptionPrices,
])
let mockData: IMetric[] = TEST_WEEK_DATA

let mockIsMetricsLoading = false
const mockSetFilters = jest.fn()
const mockGetMetricsWithParams = jest.fn()

let mockFilters: metricFiltersType = [
    {
        key: 'housing_id',
        operator: '=',
        value: '123456789',
    },
]
let mockRange = {
    from: '2022-06-01T00:00:00.000Z',
    to: '2022-06-04T23:59:59.999Z',
}

let mockPeriod: periodType = 'weekly'
let mockMetricsInterval: metricIntervalType = '1d'

let mockWidgetPropsDefault: IWidgetProps = {
    period: mockPeriod,
    filters: mockFilters,
    metricsInterval: mockMetricsInterval,
    range: mockRange,
    targets: [metricTargetsEnum.eurosConsumption],
}

// Mock metricsHook
jest.mock('src/modules/Metrics/metricsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMetrics: () => ({
        data: mockData,
        filters: mockFilters,
        range: mockRange,
        isMetricsLoading: mockIsMetricsLoading,
        setRange: jest.fn(),
        setMetricsInterval: jest.fn(),
        setData: jest.fn(),
        interval: mockMetricsInterval,
        setFilters: mockSetFilters,
        getMetricsWithParams: mockGetMetricsWithParams,
    }),
}))

/**
 * Reusable render Test Component.
 *
 * @returns Rendered WidgetCost component.
 */
const renderTestComponent = () => {
    return reduxedRender(
        <Router>
            <ConsumptionWidgetsMetricsProvider>
                <WidgetCost {...mockWidgetPropsDefault} />
            </ConsumptionWidgetsMetricsProvider>
        </Router>,
    )
}

describe('WidgetCost test', () => {
    test('when isMetricLoading is true, a spinner is shown', async () => {
        mockIsMetricsLoading = true
        const { container } = renderTestComponent()

        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
    })

    test.each`
        period
        ${'monthly'}
        ${'yearly'}
    `('When period is $period, total cost with subscription value should be shown', async ({ period }) => {
        mockIsMetricsLoading = false
        mockPeriod = period
        mockData[0].datapoints = [
            [40, 1651406400],
            [40, 1651406400],
        ]
        mockData[1].datapoints = [
            [10, 1651406400],
            [10, 1651406400],
        ]
        const totalCost = 80
        const totalCostIncludingSubscriptions = 100

        const { getByText, queryByText } = renderTestComponent()

        expect(queryByText(TOTAL_COST_TEXT)).toBeInTheDocument()
        expect(getByText(totalCost)).toBeInTheDocument()
        expect(getByText(EURO_UNIT_TEXT)).toBeInTheDocument()

        expect(
            queryByText(
                `${TOTAL_COST_INCLUDING_SUBSCRIPTIONS_TEXT} ${totalCostIncludingSubscriptions} ${EURO_UNIT_TEXT}`,
            ),
        ).toBeInTheDocument()
    })

    test('When period is daily and the selected day is a previous day, total cost with subscription value should be shown', async () => {
        mockIsMetricsLoading = false
        mockPeriod = 'daily'
        mockRange = {
            from: '2024-04-17T00:00:00.000Z',
            to: '2024-04-17T23:59:59.999Z',
        }
        mockData[0].datapoints = [
            [40, 1651406400],
            [40, 1651406400],
        ]
        mockData[1].datapoints = [
            [10, 1651406400],
            [10, 1651406400],
        ]
        const totalCost = 80
        const totalCostIncludingSubscriptions = 100

        const { getByText, queryByText } = renderTestComponent()

        expect(queryByText(TOTAL_COST_TEXT)).toBeInTheDocument()
        expect(getByText(totalCost)).toBeInTheDocument()
        expect(getByText(EURO_UNIT_TEXT)).toBeInTheDocument()

        expect(
            queryByText(
                `${TOTAL_COST_INCLUDING_SUBSCRIPTIONS_TEXT} ${totalCostIncludingSubscriptions} ${EURO_UNIT_TEXT}`,
            ),
        ).toBeInTheDocument()
    })

    test('When the data metrics is partially exist in yearly period, a missing data text is shown', async () => {
        mockIsMetricsLoading = false
        mockPeriod = 'yearly'
        mockData[0].datapoints = [
            [40, 1651406400],
            [40, 1651406400],
        ]
        mockData[1].datapoints = [
            [10, 1651406400],
            [10, 1651406400],
        ]
        const { getByText } = renderTestComponent()
        expect(getByText(MESSING_DATA_TEXT)).toBeInTheDocument()
    })

    test('When the data metrics is not exist in yearly period, a missing data text must be not shown', async () => {
        mockIsMetricsLoading = false
        mockPeriod = 'yearly'
        mockData = []
        const { queryByText } = renderTestComponent()
        expect(queryByText(MESSING_DATA_TEXT)).not.toBeInTheDocument()
    })
})
