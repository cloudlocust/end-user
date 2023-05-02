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
    test('when not all days in the month has data', async () => {
        const { getByText } = reduxedRender(<AnalysisComparison {...mockAnalysisComprisonProps} />)
        expect(getByText(COMPARISON_TEXT)).toBeTruthy()
        expect('Aucune donnée de comparison disponible').toBeTruthy()
    })
    test('When every day has data', async () => {
        // Check if the first item of every sub array of datapoints has a value
        mockData = [
            {
                target: metricTargetsEnum.consumption,
                datapoints: [
                    [11, 11],
                    [22, 22],
                ],
            },
        ]
        const { getByText, getByTestId } = reduxedRender(<AnalysisComparison {...mockAnalysisComprisonProps} />)
        expect(getByText(COMPARISON_TEXT)).toBeTruthy()
        const apexchart = getByTestId('apexchart')
        expect(apexchart).toBeTruthy()
    })
})
