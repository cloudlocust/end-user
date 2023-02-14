import { reduxedRender } from 'src/common/react-platform-components/test'
import { IMetric, metricFiltersType, metricIntervalType, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { ConsumptionWidgetsMetricsContext } from 'src/modules/MyConsumption/Context/ConsumptionWidgetsMetricsContext'
import { Widget } from 'src/modules/MyConsumption/components/Widget'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widget/Widget'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'

let mockCurrentMetricsWidgets: IMetric[] = []
let mockOldMetricsWidgets: IMetric[] = []
let mockAddMetrics = jest.fn()
let mockGetMetrics = jest.fn()
let mockResetMetrics = jest.fn()

let mockProviderValueProp = {
    currentMetricsWidgets: mockCurrentMetricsWidgets,
    oldMetricsWidgets: mockOldMetricsWidgets,
    addMetrics: mockAddMetrics,
    getMetrics: mockGetMetrics,
    resetMetrics: mockResetMetrics,
}

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
    test('when ConsumptionWidgetsMetrics is rendered with default values and addMetrics is called', async () => {
        renderTestComponent()
        expect(mockCurrentMetricsWidgets).toEqual([])
        expect(mockOldMetricsWidgets).toEqual([])
    })
})
