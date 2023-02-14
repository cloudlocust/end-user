import { reduxedRender } from 'src/common/react-platform-components/test'
import { metricFiltersType, metricIntervalType, metricTargetsEnum } from 'src/modules/Metrics/Metrics'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widget/Widget'
import WidgetConsumption from 'src/modules/MyConsumption/components/WidgetConsumption'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { BrowserRouter as Router } from 'react-router-dom'

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

let mockWidgetPropsDefault: IWidgetProps = {
    period: mockPeriod,
    filters: mockFilters,
    metricsInterval: mockMetricsInterval,
    range: mockRange,
    target: metricTargetsEnum.consumption,
}

describe('WidgetConsumption test', () => {
    test('it shown two infos', () => {
        const { getByText } = reduxedRender(
            <Router>
                <WidgetConsumption {...mockWidgetPropsDefault} />
            </Router>,
        )
        expect(getByText('Consommation Totale')).toBeInTheDocument()
        expect(getByText('Achetée')).toBeInTheDocument()
    })
})
