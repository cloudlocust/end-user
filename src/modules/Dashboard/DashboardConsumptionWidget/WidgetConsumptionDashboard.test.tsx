import { reduxedRender } from 'src/common/react-platform-components/test'
import { DashboardConsumptionWidget } from 'src/modules/Dashboard/DashboardConsumptionWidget'

const apexChartsTestId = 'apexcharts'

// Mocking apexcharts, because there are errors related to modules not found, in test mode.
jest.mock(
    'react-apexcharts',
    // eslint-disable-next-line jsdoc/require-jsdoc
    () => (props: any) => <div className="apexcharts-svg" {...props}></div>,
)

describe('DashboardConsumptionWidget', () => {
    test('When the component DashboardConsumptionWidget is rendered, ApexChart should be shown', () => {
        const { getByTestId } = reduxedRender(<DashboardConsumptionWidget />)
        expect(getByTestId(apexChartsTestId)).toBeInTheDocument()
    })

    // More tests will be added later
})
