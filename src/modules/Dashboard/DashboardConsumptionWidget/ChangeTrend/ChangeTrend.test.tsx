import { ChangeTrend } from 'src/modules/Dashboard/DashboardConsumptionWidget/ChangeTrend'
import { reduxedRender } from 'src/common/react-platform-components/test'

describe('ChangeTrend component', () => {
    test('renders correctly with positive percentageChange', () => {
        const { getByText } = reduxedRender(<ChangeTrend percentageChange={10.76} />)

        expect(getByText('trending_up')).toBeInTheDocument()
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
        const { getByText } = reduxedRender(<ChangeTrend percentageChange={-49.4} />)

        expect(getByText('trending_down')).toBeInTheDocument()
        expect(
            getByText((content, _) => {
                return content.startsWith('49')
            }),
        ).toBeInTheDocument()
    })
})
