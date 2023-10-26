import { reduxedRender } from 'src/common/react-platform-components/test'
import { IMetric, metricFiltersType, metricIntervalType, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widget/Widget'
import WidgetConsumption from 'src/modules/MyConsumption/components/WidgetConsumption'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { BrowserRouter as Router } from 'react-router-dom'
import { TEST_SUCCESS_WEEK_METRICS } from 'src/mocks/handlers/metrics'
import { renderWidgetTitle } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { ConsumptionWidgetsMetricsProvider } from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/ConsumptionWidgetsMetricsContext'

const CONSOMMATION_TOTALE_TEXT = 'Consommation Totale'
const CONSOMMATION_PURCHASED_TEXT = renderWidgetTitle(metricTargetsEnum.consumption)
const WH_UNIT_TEXT = 'Wh'
const KWH_UNIT_TEXT = 'kWh'
const NO_DATA_MESSAGE = 'Aucune donnée disponible'

const circularProgressClassname = '	.MuiCircularProgress-root'

const TEST_WEEK_DATA: IMetric[] = TEST_SUCCESS_WEEK_METRICS([
    metricTargetsEnum.consumption,
    metricTargetsEnum.autoconsumption,
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
    targets: [metricTargetsEnum.consumption],
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
        interval: mockMetricsInterval,
        setFilters: mockSetFilters,
        getMetricsWithParams: mockGetMetricsWithParams,
    }),
}))

// need to mock this because myHouseConfig uses it
jest.mock('src/modules/MyHouse/MyHouseConfig', () => ({
    ...jest.requireActual('src/modules/MyHouse/MyHouseConfig'),
    //eslint-disable-next-line
    arePlugsUsedBasedOnProductionStatus: jest.fn(),
    //eslint-disable-next-line
    isProductionActiveAndHousingHasAccess: () => true,
}))

/**
 * Reusable render Test Component.
 *
 * @returns Rendered WidgetConsumption component.
 */
const renderTestComponent = () => {
    return reduxedRender(
        <Router>
            <ConsumptionWidgetsMetricsProvider>
                <WidgetConsumption {...mockWidgetPropsDefault} />
            </ConsumptionWidgetsMetricsProvider>
        </Router>,
    )
}

describe('WidgetConsumption test', () => {
    test('when isMetricLoading is true, a spinner is shown', async () => {
        mockIsMetricsLoading = true
        const { container } = renderTestComponent()

        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
    })
    test('Two value should be shown, consumption & (consumption + autoconsumption)', async () => {
        mockIsMetricsLoading = false
        mockData[0].datapoints = [[500, 1651406400]]
        mockData[1].datapoints = [[500, 1651406400]]
        const { getByText, queryByText } = renderTestComponent()

        // consumption total = (consumption + autoconsumption) = (500Wh + 500Wh) = 1kWh
        expect(queryByText(CONSOMMATION_TOTALE_TEXT)).toBeInTheDocument()
        expect(getByText(1)).toBeInTheDocument()
        expect(getByText(KWH_UNIT_TEXT)).toBeInTheDocument()

        // consumption = 500Wh
        expect(queryByText(CONSOMMATION_PURCHASED_TEXT)).toBeInTheDocument()
        expect(getByText(500)).toBeInTheDocument()
        expect(getByText(WH_UNIT_TEXT)).toBeInTheDocument()
    })
    test('When autoconsumption is null, it show two info with same value (consumption) ie: consumption total = consumption', () => {
        mockData[0].datapoints = [[500, 1651406400]]
        mockData[1].datapoints = [[0, 1651406400]]
        const { getAllByText, queryByText } = renderTestComponent()

        // consumption total = consumption = 500Wh
        expect(queryByText(CONSOMMATION_TOTALE_TEXT)).toBeInTheDocument()
        expect(queryByText(CONSOMMATION_PURCHASED_TEXT)).toBeInTheDocument()
        expect(getAllByText(500)).toHaveLength(2)
        expect(getAllByText(WH_UNIT_TEXT)).toHaveLength(2)
    })
    test('When there is no data, an error message is shown the two title', () => {
        mockData = []
        const { queryByText, getAllByText } = renderTestComponent()

        expect(queryByText(CONSOMMATION_TOTALE_TEXT)).toBeInTheDocument()
        expect(queryByText(CONSOMMATION_PURCHASED_TEXT)).toBeInTheDocument()
        expect(getAllByText(NO_DATA_MESSAGE)).toHaveLength(2)
    })
})
