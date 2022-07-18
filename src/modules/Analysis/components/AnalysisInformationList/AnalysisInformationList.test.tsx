import { reduxedRender } from 'src/common/react-platform-components/test'
import AnalysisInformationList from 'src/modules/Analysis/components/AnalysisInformationList'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { titleAnalysisInformationType } from 'src/modules/Analysis/analysisTypes'

const NO_DATA_TEXT = 'Aucune donnée disponible'
const MEAN_CONSUMPTION_INFORMATION_TEXT: titleAnalysisInformationType = 'Conso moyenne par jour'
const MAX_CONSUMPTION_INFORMATION_TEXT: titleAnalysisInformationType = 'Jour de Conso maximale'
const MIN_CONSUMPTION_INFORMATION_TEXT: titleAnalysisInformationType = 'Jour de Conso minimale'

// eslint-disable-next-line jsdoc/require-jsdoc
const mockMetricsData: IMetric[] = [
    {
        target: metricTargetsEnum.consumption,
        datapoints: [
            // Saturday, 1 January 2022
            [20, 1640995200000],
        ],
    },
]
/**
 * Mock for AnalysisInformationList props.
 */
const mockAnalysisInformationListProps = {
    data: mockMetricsData,
    range: { from: '2022-01-01T00:00:00.000Z', to: '2022-01-01T23:59:59.999Z' },
}

describe('AnalysisInformationList test', () => {
    test('when data given, it should render all information', async () => {
        const { getByText, getAllByText } = reduxedRender(
            <AnalysisInformationList {...mockAnalysisInformationListProps} />,
        )

        expect(getByText(MAX_CONSUMPTION_INFORMATION_TEXT, { exact: false })).toBeTruthy()
        expect(getByText(MIN_CONSUMPTION_INFORMATION_TEXT, { exact: false })).toBeTruthy()
        expect(getByText(MEAN_CONSUMPTION_INFORMATION_TEXT, { exact: false })).toBeTruthy()
        // Min and Max have 20 Wh
        expect(getAllByText('20 Wh')).toHaveLength(2)
        expect(getAllByText('Saturday 01')).toHaveLength(2)
    })
    test('when data is empty, no data available should be shown', async () => {
        mockAnalysisInformationListProps.data = []
        const { getByText, getAllByText } = reduxedRender(
            <AnalysisInformationList {...mockAnalysisInformationListProps} />,
        )

        expect(getByText(MAX_CONSUMPTION_INFORMATION_TEXT, { exact: false })).toBeTruthy()
        expect(getByText(MIN_CONSUMPTION_INFORMATION_TEXT, { exact: false })).toBeTruthy()
        expect(getByText(MEAN_CONSUMPTION_INFORMATION_TEXT, { exact: false })).toBeTruthy()
        expect(getAllByText(NO_DATA_TEXT)).toHaveLength(3)
    })
})
