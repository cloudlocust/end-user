import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter } from 'react-router-dom'
import { DashboardConsumptionWidget } from 'src/modules/Dashboard/DashboardConsumptionWidget'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'

const APEX_CHARTS_TEST_ID = 'apexcharts'
const CONSUMPTION_AND_PRICE_TEST_ID = 'consumption-and-price'
const PERCENTAGE_CHANGE_TEST_ID = 'percentage-change'

const mockInitialState = {
    housingModel: {
        currentHousing: {
            id: 1,
        },
    },
}

const mockGetMetricsWithParams = jest.fn(() => [])
let mockIsMetricsLoading = true

// Mock metricsHook
jest.mock('src/modules/Metrics/metricsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMetrics: () => ({
        isMetricsLoading: mockIsMetricsLoading,
        getMetricsWithParams: mockGetMetricsWithParams,
    }),
}))

jest.mock('src/modules/Alerts/components/ConsumptionAlert/consumptionAlertHooks.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConsumptionAlerts: () => ({
        pricePerKwh: 1.8,
    }),
}))

// Mocking apexcharts, because there are errors related to modules not found, in test mode.
jest.mock(
    'react-apexcharts',
    // eslint-disable-next-line jsdoc/require-jsdoc
    () => (props: any) => <div className="apexcharts-svg" {...props}></div>,
)

describe('DashboardConsumptionWidget', () => {
    test('When the widget content is loading, show loading circle', () => {
        const { getByRole } = reduxedRender(
            <BrowserRouter>
                <DashboardConsumptionWidget />
            </BrowserRouter>,
            {
                initialState: mockInitialState,
            },
        )

        expect(getByRole('progressbar')).toBeInTheDocument()
    })

    test('When the widget content is not loading, show the elements of the DashboardConsumptionWidget', async () => {
        mockIsMetricsLoading = false
        const { getByTestId, getByText } = reduxedRender(
            <BrowserRouter>
                <DashboardConsumptionWidget />
            </BrowserRouter>,
            {
                initialState: mockInitialState,
            },
        )

        expect(getByTestId(APEX_CHARTS_TEST_ID)).toBeInTheDocument()
        expect(getByTestId(CONSUMPTION_AND_PRICE_TEST_ID)).toBeInTheDocument()
        expect(getByTestId(PERCENTAGE_CHANGE_TEST_ID)).toBeInTheDocument()
        expect(getByText('Conso')).toBeInTheDocument()
        const showMyConsumptionLink = getByText((content, _) => {
            return content.startsWith('Voir ma conso du jour')
        })
        expect(showMyConsumptionLink).toBeInTheDocument()
        userEvent.click(showMyConsumptionLink)
        await waitFor(() => {
            expect(window.location.pathname).toBe('/my-consumption')
        })
    })
})
