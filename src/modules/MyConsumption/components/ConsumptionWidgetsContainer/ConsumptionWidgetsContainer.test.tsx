import { BrowserRouter as Router } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { metricFiltersType, metricIntervalType } from 'src/modules/Metrics/Metrics'
import ConsumptionWidgetsContainer from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer'
import { ConsumptionWidgetsContainerProps } from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/WidgetContainer'
import { ConsumptionWidgetsMetricsProvider } from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/ConsumptionWidgetsMetricsContext'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'

const widgetClassnameSelector = ' .MuiGrid-root .MuiGrid-item'
// const numbersOfWidgets = WidgetTargets.length
const LIST_WIDGETS_TEXT = 'Chiffres clés'
let mockEnphaseConsentFeatureState = true

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

jest.mock('src/modules/MyHouse/MyHouseConfig', () => ({
    ...jest.requireActual('src/modules/MyHouse/MyHouseConfig'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    get enphaseConsentFeatureState() {
        return mockEnphaseConsentFeatureState
    },
}))

jest.mock('src/modules/Metrics/metricsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMetrics: () => ({
        data: [],
        isMetricsLoading: false,
        setRange: jest.fn(),
        setMetricsInterval: jest.fn(),
    }),
}))

describe('ConsumptionWidgetsContainer test', () => {
    test('the widgets is showing correctly', async () => {
        const { container, getByText } = reduxedRender(
            <Router>
                <ConsumptionWidgetsMetricsProvider>
                    <ConsumptionWidgetsContainer {...consumptionWidgetsContainerProps} />
                </ConsumptionWidgetsMetricsProvider>
            </Router>,
        )
        expect(getByText(LIST_WIDGETS_TEXT)).toBeTruthy()
        expect(container.querySelectorAll(widgetClassnameSelector).length).toBe(8)
    })
    test('when the enphase consent is not active, the widgets of production & autoconsumption should not be showing', async () => {
        consumptionWidgetsContainerProps.enphaseOff = true
        const { container, getByText, queryByText } = reduxedRender(
            <Router>
                <ConsumptionWidgetsMetricsProvider>
                    <ConsumptionWidgetsContainer {...consumptionWidgetsContainerProps} />
                </ConsumptionWidgetsMetricsProvider>
            </Router>,
        )
        expect(getByText(LIST_WIDGETS_TEXT)).toBeTruthy()
        expect(container.querySelectorAll(widgetClassnameSelector).length).toBe(6)

        expect(queryByText('Production Totale')).not.toBeInTheDocument()
        expect(queryByText('Autoconsommation')).not.toBeInTheDocument()

        consumptionWidgetsContainerProps.enphaseOff = false
    })
    test('when the enphase feature is disabled, the widgets of production & autoconsumption should not be showing', async () => {
        mockEnphaseConsentFeatureState = false
        const { container, getByText, queryByText } = reduxedRender(
            <Router>
                <ConsumptionWidgetsMetricsProvider>
                    <ConsumptionWidgetsContainer {...consumptionWidgetsContainerProps} />
                </ConsumptionWidgetsMetricsProvider>
            </Router>,
        )
        expect(getByText(LIST_WIDGETS_TEXT)).toBeTruthy()
        expect(container.querySelectorAll(widgetClassnameSelector).length).toBe(6)

        expect(queryByText('Production Totale')).not.toBeInTheDocument()
        expect(queryByText('Autoconsommation')).not.toBeInTheDocument()

        mockEnphaseConsentFeatureState = true
    })
})
