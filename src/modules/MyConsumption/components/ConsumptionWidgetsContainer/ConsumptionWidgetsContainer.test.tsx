import { BrowserRouter as Router } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { metricFiltersType, metricIntervalType } from 'src/modules/Metrics/Metrics'
import ConsumptionWidgetsContainer from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer'
import { ConsumptionWidgetsContainerProps } from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/WidgetContainer'
import { ConsumptionWidgetsMetricsProvider } from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/ConsumptionWidgetsMetricsContext'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { getDateWithoutTimezoneOffset } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { endOfDay, startOfDay } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

const CONSOMMATION_TOTAL_TEXT = 'Consommation Totale'
const CONSOMMATION_PURCHASED_TEXT = 'Achetée'
const CONSOMMATION_VEILLE_TEXT = 'Consommation de Veille'
const PRODUCTION_TOTAL_TEXT = 'Production Totale'
const PRODUCTION_INJECTED_TEXT = 'Injectée'
const AUTOCONSOMMATION_TEXT = 'Autoconsommation'
const TEMPERATURE_EXTERIEURE_TEXT = 'Température Extérieure'
const TEMPERATURE_INTERIEURE_TEXT = 'Température Intérieure'

const widgetClassnameSelector = ' .MuiGrid-root .MuiGrid-item'
// const numbersOfWidgets = WidgetTargets.length
const LIST_WIDGETS_TEXT = 'Chiffres clés'
let mockGlobalProductionFeatureState = true

let mockFilters: metricFiltersType = [
    {
        key: 'housing_id',
        operator: '=',
        value: '123456789',
    },
]
let mockMetricsInterval: metricIntervalType = '1m'
let mockPeriod: periodType = 'daily'
const mockPreviousDayRange = {
    from: '2022-06-04T00:00:00.000Z',
    to: '2022-06-04T23:59:59.999Z',
}
const currentTime = utcToZonedTime(new Date(), 'Europe/Paris')
const mockTodayRange = {
    from: getDateWithoutTimezoneOffset(startOfDay(currentTime)),
    to: getDateWithoutTimezoneOffset(endOfDay(currentTime)),
}

let consumptionWidgetsContainerProps: ConsumptionWidgetsContainerProps

let mockIsProductionActiveAndHousingHasAccess = true

jest.mock('src/modules/MyHouse/MyHouseConfig', () => ({
    ...jest.requireActual('src/modules/MyHouse/MyHouseConfig'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    get globalProductionFeatureState() {
        return mockGlobalProductionFeatureState
    },
    //eslint-disable-next-line
    arePlugsUsedBasedOnProductionStatus: () => true,
    //eslint-disable-next-line
    isProductionActiveAndHousingHasAccess: () => mockIsProductionActiveAndHousingHasAccess,
}))

jest.mock('src/modules/Metrics/metricsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMetrics: () => ({
        data: [],
        isMetricsLoading: false,
        setRange: jest.fn(),
        setMetricsInterval: jest.fn(),
        setData: jest.fn(),
    }),
}))

describe('ConsumptionWidgetsContainer test', () => {
    beforeEach(() => {
        consumptionWidgetsContainerProps = {
            filters: mockFilters,
            metricsInterval: mockMetricsInterval,
            period: mockPeriod,
            range: mockTodayRange,
            hasMissingHousingContracts: false,
            enedisOff: false,
            enphaseOff: false,
            isIdleWidgetShown: true,
        }
    })

    afterEach(() => {
        consumptionWidgetsContainerProps.enphaseOff = false
        mockGlobalProductionFeatureState = true
    })

    test('show all the widgets when the range is for today', async () => {
        const { container, getByText } = reduxedRender(
            <Router>
                <ConsumptionWidgetsMetricsProvider>
                    <ConsumptionWidgetsContainer {...consumptionWidgetsContainerProps} />
                </ConsumptionWidgetsMetricsProvider>
            </Router>,
        )
        expect(getByText(LIST_WIDGETS_TEXT)).toBeTruthy()
        expect(container.querySelectorAll(widgetClassnameSelector).length).toBe(8)

        expect(getByText(CONSOMMATION_TOTAL_TEXT)).toBeInTheDocument()
        expect(getByText(CONSOMMATION_PURCHASED_TEXT)).toBeInTheDocument()
        expect(getByText(CONSOMMATION_VEILLE_TEXT)).toBeInTheDocument()
        expect(getByText(PRODUCTION_TOTAL_TEXT)).toBeInTheDocument()
        expect(getByText(PRODUCTION_INJECTED_TEXT)).toBeInTheDocument()
        expect(getByText(AUTOCONSOMMATION_TEXT)).toBeInTheDocument()
        expect(getByText(TEMPERATURE_EXTERIEURE_TEXT)).toBeInTheDocument()
        expect(getByText(TEMPERATURE_INTERIEURE_TEXT)).toBeInTheDocument()
    })
    test('do not show the widget "veille" when isIdleWidgetShown is false', async () => {
        consumptionWidgetsContainerProps.isIdleWidgetShown = false
        const { container, getByText, queryByText } = reduxedRender(
            <Router>
                <ConsumptionWidgetsMetricsProvider>
                    <ConsumptionWidgetsContainer {...consumptionWidgetsContainerProps} />
                </ConsumptionWidgetsMetricsProvider>
            </Router>,
        )
        expect(getByText(LIST_WIDGETS_TEXT)).toBeTruthy()
        expect(container.querySelectorAll(widgetClassnameSelector).length).toBe(7)

        expect(getByText(CONSOMMATION_TOTAL_TEXT)).toBeInTheDocument()
        expect(getByText(CONSOMMATION_PURCHASED_TEXT)).toBeInTheDocument()
        expect(queryByText(CONSOMMATION_VEILLE_TEXT)).not.toBeInTheDocument()
        expect(getByText(PRODUCTION_TOTAL_TEXT)).toBeInTheDocument()
        expect(getByText(PRODUCTION_INJECTED_TEXT)).toBeInTheDocument()
        expect(getByText(AUTOCONSOMMATION_TEXT)).toBeInTheDocument()
        expect(getByText(TEMPERATURE_EXTERIEURE_TEXT)).toBeInTheDocument()
        expect(getByText(TEMPERATURE_INTERIEURE_TEXT)).toBeInTheDocument()
    })
    test('when the period is not daily, do not show the widgets externalTemperature and internalTemperature', async () => {
        consumptionWidgetsContainerProps.period = 'monthly'
        const { container, getByText, queryByText } = reduxedRender(
            <Router>
                <ConsumptionWidgetsMetricsProvider>
                    <ConsumptionWidgetsContainer {...consumptionWidgetsContainerProps} />
                </ConsumptionWidgetsMetricsProvider>
            </Router>,
        )
        expect(getByText(LIST_WIDGETS_TEXT)).toBeTruthy()
        expect(container.querySelectorAll(widgetClassnameSelector).length).toBe(6)

        expect(getByText(CONSOMMATION_TOTAL_TEXT)).toBeInTheDocument()
        expect(getByText(CONSOMMATION_PURCHASED_TEXT)).toBeInTheDocument()
        expect(getByText(CONSOMMATION_VEILLE_TEXT)).toBeInTheDocument()
        expect(getByText(PRODUCTION_TOTAL_TEXT)).toBeInTheDocument()
        expect(getByText(PRODUCTION_INJECTED_TEXT)).toBeInTheDocument()
        expect(getByText(AUTOCONSOMMATION_TEXT)).toBeInTheDocument()
        expect(queryByText(TEMPERATURE_EXTERIEURE_TEXT)).not.toBeInTheDocument()
        expect(queryByText(TEMPERATURE_INTERIEURE_TEXT)).not.toBeInTheDocument()
    })
    test('when the range is not for today, do not show the widgets externalTemperature and internalTemperature', async () => {
        consumptionWidgetsContainerProps.range = mockPreviousDayRange
        const { container, getByText, queryByText } = reduxedRender(
            <Router>
                <ConsumptionWidgetsMetricsProvider>
                    <ConsumptionWidgetsContainer {...consumptionWidgetsContainerProps} />
                </ConsumptionWidgetsMetricsProvider>
            </Router>,
        )
        expect(getByText(LIST_WIDGETS_TEXT)).toBeTruthy()
        expect(container.querySelectorAll(widgetClassnameSelector).length).toBe(6)

        expect(getByText(CONSOMMATION_TOTAL_TEXT)).toBeInTheDocument()
        expect(getByText(CONSOMMATION_PURCHASED_TEXT)).toBeInTheDocument()
        expect(getByText(CONSOMMATION_VEILLE_TEXT)).toBeInTheDocument()
        expect(getByText(PRODUCTION_TOTAL_TEXT)).toBeInTheDocument()
        expect(getByText(PRODUCTION_INJECTED_TEXT)).toBeInTheDocument()
        expect(getByText(AUTOCONSOMMATION_TEXT)).toBeInTheDocument()
        expect(queryByText(TEMPERATURE_EXTERIEURE_TEXT)).not.toBeInTheDocument()
        expect(queryByText(TEMPERATURE_INTERIEURE_TEXT)).not.toBeInTheDocument()
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

        expect(getByText(CONSOMMATION_TOTAL_TEXT)).toBeInTheDocument()
        expect(queryByText(CONSOMMATION_PURCHASED_TEXT)).not.toBeInTheDocument()
        expect(getByText(CONSOMMATION_VEILLE_TEXT)).toBeInTheDocument()
        expect(queryByText(PRODUCTION_TOTAL_TEXT)).not.toBeInTheDocument()
        expect(queryByText(PRODUCTION_INJECTED_TEXT)).not.toBeInTheDocument()
        expect(queryByText(AUTOCONSOMMATION_TEXT)).not.toBeInTheDocument()
    })
    test('when the enphase feature is disabled, the widgets of production & autoconsumption should not be showing', async () => {
        mockGlobalProductionFeatureState = false // in tests no need for this since we mocked the hire function (IsProductionActiveAndHasHousingAccess)
        mockIsProductionActiveAndHousingHasAccess = false
        const { container, getByText, queryByText } = reduxedRender(
            <Router>
                <ConsumptionWidgetsMetricsProvider>
                    <ConsumptionWidgetsContainer {...consumptionWidgetsContainerProps} />
                </ConsumptionWidgetsMetricsProvider>
            </Router>,
        )
        expect(getByText(LIST_WIDGETS_TEXT)).toBeTruthy()
        expect(container.querySelectorAll(widgetClassnameSelector).length).toBe(6)

        expect(getByText(CONSOMMATION_TOTAL_TEXT)).toBeInTheDocument()
        expect(queryByText(CONSOMMATION_PURCHASED_TEXT)).not.toBeInTheDocument()
        expect(getByText(CONSOMMATION_VEILLE_TEXT)).toBeInTheDocument()
        expect(queryByText(PRODUCTION_TOTAL_TEXT)).not.toBeInTheDocument()
        expect(queryByText(PRODUCTION_INJECTED_TEXT)).not.toBeInTheDocument()
        expect(queryByText(AUTOCONSOMMATION_TEXT)).not.toBeInTheDocument()
    })
})
