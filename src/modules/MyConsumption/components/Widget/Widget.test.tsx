import { reduxedRender } from 'src/common/react-platform-components/test'
import { Widget } from 'src/modules/MyConsumption/components/Widget'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widget/Widget'
import { IMetric, metricFiltersType, metricIntervalType, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { TEST_SUCCESS_WEEK_METRICS } from 'src/mocks/handlers/metrics'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { IEnphaseConsent } from 'src/modules/Consents/Consents'
import { BrowserRouter as Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { applyCamelCase } from 'src/common/react-platform-components'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { URL_MY_HOUSE } from 'src/modules/MyHouse'

const TEST_WEEK_DATA: IMetric[] = TEST_SUCCESS_WEEK_METRICS([metricTargetsEnum.consumption])
let mockData: IMetric[] = TEST_WEEK_DATA

// List of houses to add to the redux state
const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

const CONSOMMATION_TOTALE_TEXT = 'Consommation Totale'
const CONSOMMATION_TOTALE_UNIT = 'kWh'

const NO_DATA_MESSAGE = 'Aucune donnée disponible'
const circularProgressClassname = '	.MuiCircularProgress-root'

const ENPHASE_CONSENT_INACTIVE_ERROR_ICON = 'ErrorOutlineIcon'

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

// Enphase Consent default.
const enphaseConsent: IEnphaseConsent = {
    meterGuid: '133456',
    enphaseConsentState: 'ACTIVE',
}

let mockWidgetPropsDefault: IWidgetProps = {
    period: mockPeriod,
    filters: mockFilters,
    hasMissingHousingContracts: false,
    metricsInterval: mockMetricsInterval,
    range: mockRange,
    target: metricTargetsEnum.consumption,
    enphaseConsent,
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
        const { container } = reduxedRender(<Widget {...mockWidgetPropsDefault} />)

        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
    })
    test('When widget getMetrics, value should be shown', async () => {
        mockIsMetricsLoading = false
        mockData[0].datapoints = [[1000, 1651406400]]
        const { getByText } = reduxedRender(<Widget {...mockWidgetPropsDefault} />)

        expect(getByText(CONSOMMATION_TOTALE_TEXT)).toBeInTheDocument()
        expect(getByText(CONSOMMATION_TOTALE_UNIT)).toBeInTheDocument()
        // Data is converted to kWh
        expect(getByText(1)).toBeInTheDocument()
    })

    test('when there is no data, an error message is shown', async () => {
        mockData = []
        const { getByText } = reduxedRender(<Widget {...mockWidgetPropsDefault} />)

        expect(getByText(NO_DATA_MESSAGE)).toBeTruthy()
    })

    test('when the target is "enphase_production_metrics" and the enphaseConsent is inactive, an error icon is shown in the widget.', async () => {
        mockData = []
        const mockWidgetProps: IWidgetProps = {
            ...mockWidgetPropsDefault,
            target: metricTargetsEnum.totalProduction,
            enphaseConsent: { ...enphaseConsent, enphaseConsentState: 'NONEXISTENT' },
        }
        const { getByTestId } = reduxedRender(
            <Router>
                <Widget {...mockWidgetProps} />
            </Router>,
            {
                initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } },
            },
        )

        expect(getByTestId(ENPHASE_CONSENT_INACTIVE_ERROR_ICON)).toBeTruthy()
        userEvent.click(getByTestId(ENPHASE_CONSENT_INACTIVE_ERROR_ICON))
        expect(window.location.pathname).toBe(`${URL_MY_HOUSE}/${LIST_OF_HOUSES[0].id}`)
    })

    test('when the target is "enphase_production_metrics" and the enphaseConsent is active, an error icon does not be shown in the widget.', async () => {
        mockData = []
        const mockWidgetProps: IWidgetProps = {
            ...mockWidgetPropsDefault,
            target: metricTargetsEnum.totalProduction,
        }
        const { queryByTestId } = reduxedRender(
            <Router>
                <Widget {...mockWidgetProps} />
            </Router>,
        )
        /**
         * Be careful not to use getByTestId -getBy functions in general- when we want to test the non-existence of an element,
         * because getByTestId throw and error if the element isn't found,
         * causing the test to fail before the expect function fires.
         *
         * @see https://testing-library.com/docs/guide-disappearance/#asserting-elements-are-not-present.
         */
        expect(queryByTestId(ENPHASE_CONSENT_INACTIVE_ERROR_ICON)).not.toBeInTheDocument()
    })
    test('when the target is not "enphase_production_metrics" and the enphaseConsent is inactive, an error icon does not be shown in the widget.', async () => {
        mockData = []
        const mockWidgetProps: IWidgetProps = {
            ...mockWidgetPropsDefault,
            enphaseConsent: { ...enphaseConsent, enphaseConsentState: 'NONEXISTENT' },
        }
        const { queryByTestId } = reduxedRender(
            <Router>
                <Widget {...mockWidgetProps} />
            </Router>,
        )
        /**
         * Be careful not to use getByTestId -getBy functions in general- when we want to test the non-existence of an element,
         * because getByTestId throw and error if the element isn't found,
         * causing the test to fail before the expect function fires.
         *
         * @see https://testing-library.com/docs/guide-disappearance/#asserting-elements-are-not-present.
         */
        expect(queryByTestId(ENPHASE_CONSENT_INACTIVE_ERROR_ICON)).not.toBeInTheDocument()
    })

    // TODO: Add test for error icon for the __euros__consumption_metrics target
})
