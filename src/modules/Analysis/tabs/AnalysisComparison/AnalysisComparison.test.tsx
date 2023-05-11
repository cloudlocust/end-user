import { reduxedRender } from 'src/common/react-platform-components/test'
import AnalysisComparison from 'src/modules/Analysis/tabs/AnalysisComparison'
import { AnalysisComparisonProps } from 'src/modules/Analysis/tabs/AnalysisComparison/analysisComparison'

let mockAnalysisComprisonProps: AnalysisComparisonProps = {
    monthlyRange: {
        from: '2022-06-01T00:00:00.000Z',
        to: '2022-06-04T23:59:59.999Z',
    },
    filters: [],
}

// ApexCharts cannot render if we don't mock react-apexcharts
jest.mock(
    'react-apexcharts',
    // eslint-disable-next-line jsdoc/require-jsdoc
    () => (props: any) => <div className="apexcharts-svg" data-testid="apexchart" {...props}></div>,
)

describe('AnanlysisComprison tests', () => {
    test('when there is no available data', async () => {
        const { getByText } = reduxedRender(<AnalysisComparison {...mockAnalysisComprisonProps} />)
        expect(getByText('Aucune donnée de comparaison disponible')).toBeTruthy()
    })
})
