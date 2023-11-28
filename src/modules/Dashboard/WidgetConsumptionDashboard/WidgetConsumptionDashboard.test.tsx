import { reduxedRender } from 'src/common/react-platform-components/test'
import { WidgetConsumptionDashboard } from 'src/modules/Dashboard/WidgetConsumptionDashboard'

const apexChartsTestId = 'apexcharts'

// Mocking apexcharts, because there are errors related to modules not found, in test mode.
jest.mock(
    'react-apexcharts',
    // eslint-disable-next-line jsdoc/require-jsdoc
    () => (props: any) => <div className="apexcharts-svg" {...props}></div>,
)

describe('Test WidgetConsumptionDashboard', () => {
    test('When WidgetConsumptionDashboard is rendered, ApexChart should be shown', () => {
        const { getByTestId } = reduxedRender(<WidgetConsumptionDashboard />)
        expect(getByTestId(apexChartsTestId)).toBeInTheDocument()
    })

    // More tests will be added later
})
