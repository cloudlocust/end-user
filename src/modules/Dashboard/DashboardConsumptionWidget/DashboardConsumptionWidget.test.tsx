import { reduxedRender } from 'src/common/react-platform-components/test'
import { DashboardConsumptionWidget } from 'src/modules/Dashboard/DashboardConsumptionWidget'
import { DashboardConsumptionWidgetProps } from 'src/modules/Dashboard/DashboardConsumptionWidget/DashboardConsumptionWidget'
import { mockMetricConsumptionData } from 'src/modules/Dashboard/DashboardConsumptionWidget/utils.test'

const APEX_CHARTS_TEST_ID = 'apexcharts'
const TOTAL_DAILY_CONSUMPTION_TEST_ID = 'consumption-value'
const CONSUMPTION_UNIT_TEST_ID = 'consumption-unit'
const TOTAL_DAILY_PRICE_TEST_ID = 'price-value'
const PRICE_UNIT = '€'
const PERCENTAGE_CHANGE_TEST_ID = 'percentage-change'

// Mocking apexcharts, because there are errors related to modules not found, in test mode.
jest.mock(
    'react-apexcharts',
    // eslint-disable-next-line jsdoc/require-jsdoc
    () => (props: any) => <div className="apexcharts-svg" {...props}></div>,
)

describe('DashboardConsumptionWidget', () => {
    let mockDashboardConsumptionWidgetProps: DashboardConsumptionWidgetProps

    beforeEach(() => {
        mockDashboardConsumptionWidgetProps = {
            getMetricsWithParams: jest.fn().mockResolvedValue(mockMetricConsumptionData),
            isMetricsLoading: true,
            metricInterval: '30m',
            pricePerKwh: 2,
        }
    })

    test('When the widget content is loading, show loading circle', () => {
        const { getByRole } = reduxedRender(<DashboardConsumptionWidget {...mockDashboardConsumptionWidgetProps} />)

        expect(getByRole('progressbar')).toBeInTheDocument()
    })

    test('When the widget content is not loading, show the elements of the DashboardConsumptionWidget', () => {
        mockDashboardConsumptionWidgetProps.isMetricsLoading = false
        const { getByTestId, getByText } = reduxedRender(
            <DashboardConsumptionWidget {...mockDashboardConsumptionWidgetProps} />,
        )

        expect(getByTestId(APEX_CHARTS_TEST_ID)).toBeInTheDocument()
        expect(getByTestId(TOTAL_DAILY_CONSUMPTION_TEST_ID)).toBeInTheDocument()
        expect(getByTestId(CONSUMPTION_UNIT_TEST_ID)).toBeInTheDocument()
        expect(getByTestId(TOTAL_DAILY_PRICE_TEST_ID)).toBeInTheDocument()
        expect(getByTestId(PERCENTAGE_CHANGE_TEST_ID)).toBeInTheDocument()
        expect(getByText(PRICE_UNIT)).toBeInTheDocument()
    })
})
