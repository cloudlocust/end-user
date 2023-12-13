import { screen } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { DashboardContainer } from 'src/modules/Dashboard/DashboardContainer'

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

describe('DashboardContainer tests', () => {
    test('should render the component', async () => {
        reduxedRender(<DashboardContainer />, {
            initialState: { housingModel: { currentHousing: { id: 1, address: { city: 'Paris' } } } },
        })

        screen.getByText('Accueil')
    })
})
