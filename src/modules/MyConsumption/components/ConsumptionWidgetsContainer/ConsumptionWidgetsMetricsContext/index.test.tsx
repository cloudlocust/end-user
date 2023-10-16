import { reduxedRender } from 'src/common/react-platform-components/test'
import { IMetric, metricFiltersType, metricIntervalType, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { ConsumptionWidgetsMetricsContext } from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/ConsumptionWidgetsMetricsContext'
import { Widget } from 'src/modules/MyConsumption/components/Widget'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widget/Widget'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'

let mockCurrentRangeMetricWidgetsData: IMetric[] = []
let mockOldRangeMetricWidgetsData: IMetric[] = []
let mockStoreWidgetMetricsData = jest.fn()
let mockGetMetricsWidgetsData = jest.fn()
let mockResetMetricsWidgetData = jest.fn()

let mockProviderValueProp = {
    currentRangeMetricWidgetsData: mockCurrentRangeMetricWidgetsData,
    oldRangeMetricWidgetsData: mockOldRangeMetricWidgetsData,
    storeWidgetMetricsData: mockStoreWidgetMetricsData,
    getMetricsWidgetsData: mockGetMetricsWidgetsData,
    resetMetricsWidgetData: mockResetMetricsWidgetData,
}

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

let mockWidgetProps: IWidgetProps = {
    period: mockPeriod,
    filters: mockFilters,
    metricsInterval: mockMetricsInterval,
    range: mockRange,
    target: metricTargetsEnum.consumption,
}

/**
 * Render the component with the mock provider value.
 *
 * @returns The rendered component.
 */
const renderTestComponent = () => {
    return reduxedRender(
        <ConsumptionWidgetsMetricsContext.Provider value={mockProviderValueProp}>
            <Widget {...mockWidgetProps} />
        </ConsumptionWidgetsMetricsContext.Provider>,
    )
}

describe('ConsumptionWidgetsMetrics Context test', () => {
    test('when ConsumptionWidgetsMetrics is rendered with default values', async () => {
        renderTestComponent()
        expect(mockCurrentRangeMetricWidgetsData).toEqual([])
        expect(mockOldRangeMetricWidgetsData).toEqual([])
    })
})
