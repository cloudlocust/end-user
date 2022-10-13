import { reduxedRender } from 'src/common/react-platform-components/test'
import AnalysisInformationList from 'src/modules/Analysis/components/AnalysisInformationList'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { titleAnalysisInformationType } from 'src/modules/Analysis/analysisTypes'
import { createTheme } from '@mui/material'

const NO_DATA_TEXT = 'Aucune donnée disponible'
const MEAN_CONSUMPTION_INFORMATION_TEXT: titleAnalysisInformationType = 'Conso moyenne par jour'
const MAX_CONSUMPTION_DAY_INFORMATION_TEXT: titleAnalysisInformationType = 'Jour de Conso maximale'
const MIN_CONSUMPTION_DAY_INFORMATION_TEXT: titleAnalysisInformationType = 'Jour de Conso minimale'
const informationAvatarClassname = 'MuiAvatar-root'

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

const mockTheme = createTheme()

/**
 * Mock for AnalysisInformationList props.
 */
const mockAnalysisInformationListProps = {
    data: mockMetricsData,
    range: { from: '2022-01-01T00:00:00.000Z', to: '2022-01-01T23:59:59.999Z' },
}

describe('AnalysisInformationList test', () => {
    test('when data given, it should render all information', async () => {
        const { getByText, getAllByText, container } = reduxedRender(
            <AnalysisInformationList {...mockAnalysisInformationListProps} activeInformationName={'meanConsumption'} />,
        )

        expect(getByText(MAX_CONSUMPTION_DAY_INFORMATION_TEXT, { exact: false })).toBeTruthy()
        expect(getByText(MIN_CONSUMPTION_DAY_INFORMATION_TEXT, { exact: false })).toBeTruthy()
        expect(getByText(MEAN_CONSUMPTION_INFORMATION_TEXT, { exact: false })).toBeTruthy()
        expect(container.getElementsByClassName(informationAvatarClassname)[0] as HTMLDivElement).toBeTruthy()
        expect(
            (container.getElementsByClassName(informationAvatarClassname)[0].parentElement as HTMLDivElement).style
                .order,
        ).toBe('1')
        expect((container.getElementsByClassName(informationAvatarClassname)[0] as HTMLDivElement).style.border).toBe(
            `3px solid ${mockTheme.palette.primary.light}`,
        )
        expect((container.getElementsByClassName(informationAvatarClassname)[0] as HTMLDivElement).style.filter).toBe(
            'contrast(150%)',
        )

        // Mean, Min and Maxhave 20 Wh
        expect(getAllByText('20 Wh')).toHaveLength(3)
        expect(getAllByText('Saturday 01')).toHaveLength(2)
    })
    test('When no activeInformation is given then no border styling on the information avatar', async () => {
        const { container } = reduxedRender(<AnalysisInformationList {...mockAnalysisInformationListProps} />)
        // When no activeInformation is given then no border styling on the information avatar
        Array.from(
            container.getElementsByClassName(informationAvatarClassname) as HTMLCollectionOf<HTMLDivElement>,
        ).forEach((informationElement, index) => {
            expect(informationElement.style.border.includes('3px solid')).toBeTruthy()
            expect(informationElement.style.filter).toBe('none')
            expect((informationElement.parentElement as HTMLDivElement).style.order).toBe(`${index + 2}`)
        })
    })
    test('when data is empty, no data available should be shown', async () => {
        mockAnalysisInformationListProps.data = []
        const { getByText, getAllByText } = reduxedRender(
            <AnalysisInformationList {...mockAnalysisInformationListProps} />,
        )

        expect(getByText(MAX_CONSUMPTION_DAY_INFORMATION_TEXT, { exact: false })).toBeTruthy()
        expect(getByText(MIN_CONSUMPTION_DAY_INFORMATION_TEXT, { exact: false })).toBeTruthy()
        expect(getByText(MEAN_CONSUMPTION_INFORMATION_TEXT, { exact: false })).toBeTruthy()
        expect(getAllByText(NO_DATA_TEXT)).toHaveLength(3)
    })
})
