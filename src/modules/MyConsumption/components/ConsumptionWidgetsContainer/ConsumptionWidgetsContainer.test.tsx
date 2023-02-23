import { BrowserRouter as Router } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { metricFiltersType, metricIntervalType } from 'src/modules/Metrics/Metrics'
import ConsumptionWidgetsContainer from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer'
import { ConsumptionWidgetsContainerProps } from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/WidgetContainer'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { WidgetTargets } from 'src/modules/MyConsumption/utils/myConsumptionVariables'

const widgetClassnameSelector = ' .MuiGrid-root .MuiGrid-item'
const numbersOfWidgets = WidgetTargets.length
const LIST_WIDGETS_TEXT = 'Chiffres clés'

let mockFilters: metricFiltersType = [
    {
        key: 'meter_guid',
        operator: '=',
        value: '123456789',
    },
]
let mockMetricsInterval: metricIntervalType = '1m'
let mockPeriod: periodType = 'daily'
let mockRange = {
    from: '2022-06-04T00:00:00.000Z',
    to: '2022-06-04T23:59:59.999Z',
}

const consumptionWidgetsContainerProps: ConsumptionWidgetsContainerProps = {
    filters: mockFilters,
    metricsInterval: mockMetricsInterval,
    period: mockPeriod,
    range: mockRange,
    hasMissingHousingContracts: false,
    enedisOff: false,
    enphaseOff: false,
}

describe('ConsumptionWidgetsContainer test', () => {
    test('the widgets is showing correctly', async () => {
        const { container, getByText } = reduxedRender(
            <Router>
                <ConsumptionWidgetsContainer {...consumptionWidgetsContainerProps} />
            </Router>,
        )
        expect(getByText(LIST_WIDGETS_TEXT)).toBeTruthy()
        expect(container.querySelectorAll(widgetClassnameSelector).length).toBe(numbersOfWidgets)
    })
})
