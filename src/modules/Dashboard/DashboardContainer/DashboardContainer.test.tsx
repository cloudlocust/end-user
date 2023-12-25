import { screen } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { DashboardContainer } from 'src/modules/Dashboard/DashboardContainer'
import { BrowserRouter as Router } from 'react-router-dom'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    /**
     * Mock the useParams.
     *
     * @returns UseParams.
     */
    // This mock is for categoryId for the ecogeste hook.
    useParams: () => ({
        categoryId: '1',
    }),
}))

jest.mock('src/modules/Consents/consentsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConsents: () => ({
        getConsents: jest.fn(),
    }),
}))
jest.mock('src/modules/Dashboard/StatusWrapper/nrlinkPowerHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useNrlinkMetrics: () => ({
        data: [],
    }),
}))

// Mocking apexcharts, because there are errors related to modules not found, in test mode.
jest.mock(
    'react-apexcharts',
    // eslint-disable-next-line jsdoc/require-jsdoc
    () => (props: any) => <div className="apexcharts-svg" {...props}></div>,
)

// Mock the useConsumptionAlerts hook
jest.mock('src/modules/Alerts/components/ConsumptionAlert/consumptionAlertHooks', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConsumptionAlerts: () => ({
        isAlertsLoadingInProgress: true,
        consumptionAlerts: [],
    }),
}))

describe('DashboardContainer tests', () => {
    test('should render the component', () => {
        reduxedRender(
            <Router>
                <DashboardContainer />
            </Router>,
            {
                initialState: { housingModel: { currentHousing: { id: 1, address: { city: 'Paris' } } } },
            },
        )

        expect(screen.getByText('Accueil')).toBeInTheDocument()
    })
})
