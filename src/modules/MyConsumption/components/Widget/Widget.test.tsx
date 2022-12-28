import { reduxedRender } from 'src/common/react-platform-components/test'
import { Widget } from 'src/modules/MyConsumption/components/Widget'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widget/Widget'
import { IMetric, metricFiltersType, metricIntervalType, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { TEST_SUCCESS_WEEK_METRICS } from 'src/mocks/handlers/metrics'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'

const TEST_WEEK_DATA: IMetric[] = TEST_SUCCESS_WEEK_METRICS([metricTargetsEnum.consumption])
let mockData: IMetric[] = TEST_WEEK_DATA

const CONSOMMATION_TOTALE_TEXT = 'Consommation Totale'
const CONSOMMATION_TOTALE_UNIT = 'kWh'

const NO_DATA_MESSAGE = 'Aucune donnée disponible'
const circularProgressClassname = '	.MuiCircularProgress-root'

const mockGetMetricsWithParams = jest.fn()
let mockFilters: metricFiltersType = [
    {
        key: 'meter_guid',
        operator: '=',
        value: '123456789',
    },
]
let mockRange = {
    from: '2022-06-01T00:00:00.000Z',
    to: '2022-06-04T23:59:59.999Z',
}
let mockIsMetricsLoading = false
const mockSetFilters = jest.fn()
let mockPeriod: periodType = 'weekly'
let mockMetricsInterval: metricIntervalType = '1d'

let mockWidgetProps: IWidgetProps = {
    period: mockPeriod,
    filters: mockFilters,
    hasMissingHousingContracts: false,
    metricsInterval: mockMetricsInterval,
    range: mockRange,
    target: metricTargetsEnum.consumption,
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

describe('Widget component test', () => {
    test('when isMetricLoading is true, a spinner is shown', async () => {
        mockIsMetricsLoading = true
        const { container } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
    })
    test('When widget getMetrics, value should be shown', async () => {
        mockIsMetricsLoading = false
        mockData[0].datapoints = [[1000, 1651406400]]
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(CONSOMMATION_TOTALE_TEXT)).toBeInTheDocument()
        expect(getByText(CONSOMMATION_TOTALE_UNIT)).toBeInTheDocument()
        // Data is converted to kWh
        expect(getByText(1)).toBeInTheDocument()
    })

    test('when there is no data, an error message is shown', async () => {
        mockData = []
        const { getByText } = reduxedRender(<Widget {...mockWidgetProps} />)

        expect(getByText(NO_DATA_MESSAGE)).toBeTruthy()
    })
})
