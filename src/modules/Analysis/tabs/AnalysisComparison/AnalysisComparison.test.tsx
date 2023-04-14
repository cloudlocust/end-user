import { reduxedRender } from 'src/common/react-platform-components/test'
import { FAKE_MONTH_DATA } from 'src/mocks/handlers/metrics'
import AnalysisComparison from 'src/modules/Analysis/tabs/AnalysisComparison'
import { AnalysisComparisonProps } from 'src/modules/Analysis/tabs/AnalysisComparison/analysisComparison'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'

let mockData: IMetric[] = [{ target: metricTargetsEnum.consumption, datapoints: FAKE_MONTH_DATA }]

let mockAnalysisComprisonProps: AnalysisComparisonProps = {
    data: mockData,
    range: {
        from: '2022-06-01T00:00:00.000Z',
        to: '2022-06-04T23:59:59.999Z',
    },
}

const COMPARISON_TEXT = 'Comparaison de ma consommation globale à un même type de foyer'

// ApexCharts cannot render if we don't mock react-apexcharts
jest.mock(
    'react-apexcharts',
    // eslint-disable-next-line jsdoc/require-jsdoc
    () => (props: any) => <div className="apexcharts-svg" data-testid="apexchart" {...props}></div>,
)

describe('AnanlysisComprison tests', () => {
    test('Analysis tab content is in the document', async () => {
        const { getByText, getByTestId } = reduxedRender(<AnalysisComparison {...mockAnalysisComprisonProps} />)
        expect(getByText(COMPARISON_TEXT)).toBeTruthy()
        const apexchart = getByTestId('apexchart')
        expect(apexchart).toBeTruthy()
    })
})
