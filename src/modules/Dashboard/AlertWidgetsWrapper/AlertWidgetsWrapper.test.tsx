import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter } from 'react-router-dom'
import { AlertWidgetsWrapper } from 'src/modules/Dashboard/AlertWidgetsWrapper'
import { IConsumptionAlert } from 'src/modules/Alerts/components/ConsumptionAlert/consumptionAlert'
import { IMetric } from 'src/modules/Metrics/Metrics'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'

// Mock the useConsumptionAlerts hook
let mockIsAlertsLoadingInProgress = false
let mockConsumptionAlerts: IConsumptionAlert[] = []
jest.mock('src/modules/Alerts/components/ConsumptionAlert/consumptionAlertHooks', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConsumptionAlerts: () => ({
        isAlertsLoadingInProgress: mockIsAlertsLoadingInProgress,
        consumptionAlerts: mockConsumptionAlerts,
    }),
}))

// Mock the useMetrics hook
let mockIsMetricsLoading = false
let mockMetrics: IMetric[] = []
const mockGetMetricsWithParams = jest.fn(() => mockMetrics)
jest.mock('src/modules/Metrics/metricsHook', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMetrics: () => ({
        isMetricsLoading: mockIsMetricsLoading,
        getMetricsWithParams: mockGetMetricsWithParams,
    }),
}))

const mockInitialState = {
    housingModel: {
        currentHousing: {
            id: 1,
        },
    },
}

describe('AlertWidgetsWrapper', () => {
    beforeEach(() => {
        mockIsAlertsLoadingInProgress = false
        mockIsMetricsLoading = false
    })

    test('when the alerts are loading, show loading circle', () => {
        mockIsAlertsLoadingInProgress = true
        const { getByRole } = reduxedRender(
            <BrowserRouter>
                <AlertWidgetsWrapper />
            </BrowserRouter>,
            {
                initialState: mockInitialState,
            },
        )

        expect(getByRole('progressbar')).toBeInTheDocument()
    })

    test('when the metrics are loading, show loading circle', () => {
        mockIsMetricsLoading = true
        const { getByRole } = reduxedRender(
            <BrowserRouter>
                <AlertWidgetsWrapper />
            </BrowserRouter>,
            {
                initialState: mockInitialState,
            },
        )

        expect(getByRole('progressbar')).toBeInTheDocument()
    })

    test('when neither alerts nor measurements are being loaded, show the elements of the AlertWidgetsWrapper', async () => {
        mockMetrics = [
            {
                target: 'consumption_metrics',
                datapoints: [
                    [3, 1702684800000],
                    [1, 1702684860000],
                    [2, 1702684920000],
                    [4, 1702684980000],
                ],
            },
        ]
        mockConsumptionAlerts = [
            {
                interval: 'day',
                consumption: 5,
                price: 1,
            },
            {
                interval: 'week',
                consumption: 30,
                price: 6,
            },
        ]
        const { getAllByTestId, getAllByText, getByTestId, getByText, queryByTestId } = reduxedRender(
            <BrowserRouter>
                <AlertWidgetsWrapper />
            </BrowserRouter>,
            {
                initialState: mockInitialState,
            },
        )

        // Check that the titles of the 3 widgets are displayed
        expect(getAllByTestId('NotificationsActiveIcon')).toHaveLength(3)
        expect(getAllByText("Mon seuil d'alerte")).toHaveLength(3)
        expect(getByText('journalier')).toBeInTheDocument()
        expect(getByText('hebdomadaire')).toBeInTheDocument()
        expect(getByText('mensuel')).toBeInTheDocument()

        // Check that the gauge charts are displayed for daily an weekly widgets only
        expect(getByTestId('gauge-chart-alert-daily')).toBeInTheDocument()
        expect(getByTestId('gauge-chart-alert-weekly')).toBeInTheDocument()
        expect(queryByTestId('gauge-chart-alert-monthly')).not.toBeInTheDocument()

        // Check that the the error message screen is displayed for the monthly widget
        expect(getByText("Vous n'avez pas encore configuré d'alerte de consommation")).toBeInTheDocument()
        expect(getByText('mensuel')).toBeInTheDocument()
        const addAlertButton = getByText('Créer une alerte')
        expect(addAlertButton).toBeInTheDocument()
        userEvent.click(addAlertButton)
        await waitFor(() => {
            expect(window.location.pathname).toBe('/alerts')
        })
    })
})
