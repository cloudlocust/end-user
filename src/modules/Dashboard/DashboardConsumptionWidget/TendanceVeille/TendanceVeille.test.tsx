import { TendanceVeille } from 'src/modules/Dashboard/DashboardConsumptionWidget/TendanceVeille'
import { reduxedRender } from 'src/common/react-platform-components/test'

describe('TendanceVeille component', () => {
    test('renders correctly with positive percentageChange', () => {
        const { getByText } = reduxedRender(<TendanceVeille percentageChange={10.76} />)

        expect(
            getByText((content, _) => {
                return content.startsWith('11')
            }),
        ).toBeInTheDocument()
        expect(
            getByText((content, _) => {
                return content.endsWith('%')
            }),
        ).toBeInTheDocument()
        expect(getByText('Comparé à hier')).toBeInTheDocument()
    })

    test('renders correctly with negative percentageChange', () => {
        const { getByText } = reduxedRender(<TendanceVeille percentageChange={-49.4} />)

        expect(
            getByText((content, _) => {
                return content.startsWith('49')
            }),
        ).toBeInTheDocument()
    })
})
