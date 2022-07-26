import { reduxedRender } from 'src/common/react-platform-components/test'
import AnalysisChart from 'src/modules/Analysis/components/AnalysisChart'
import { BrowserRouter as Router } from 'react-router-dom'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { TEST_SUCCESS_MONTH_METRICS } from 'src/mocks/handlers/metrics'

let mockData: IMetric[] = TEST_SUCCESS_MONTH_METRICS([metricTargetsEnum.consumption])
const NO_DATA_TEXT = 'Aucune donnée disponible'
const analysisChartContainerClassname = 'analysisChartContainer'
const analysisChartClassname = 'apexcharts-inner apexcharts-graphical'
const heightAnalaysisChartMobile = 360
const heightAnalaysisChartDesktop = 520
const mockAnalysisChartProps = {
    data: mockData,
    children: <></>,
}

let mockIsMobile = true
// testing for mobile as default
jest.mock(
    '@mui/material/useMediaQuery',
    () => (params: any) =>
        // eslint-disable-next-line jsdoc/require-jsdoc
        mockIsMobile,
)
// AnalysisChart component cannot render if we don't mock react-apexcharts
jest.mock(
    'react-apexcharts',
    // eslint-disable-next-line jsdoc/require-jsdoc
    () => (props: any) => {
        return (
            <div
                id="apexcharts-svg"
                style={{ height: `${props.height}px` }}
                className={analysisChartClassname}
                {...props}
            ></div>
        )
    },
)

describe('AnalysisChart test', () => {
    test('when data is not empty, Container should take the same height as the analysisChart to center the content', async () => {
        Element.prototype.getBoundingClientRect = jest.fn(() => {
            return {
                width: 120,
                height: heightAnalaysisChartMobile,
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                x: 0,
                y: 0,
                toJSON: jest.fn(),
            }
        })
        const { container: containerMobile } = reduxedRender(
            <Router>
                <AnalysisChart {...mockAnalysisChartProps} />
            </Router>,
        )

        // When mobile
        expect(
            (containerMobile.getElementsByClassName(analysisChartContainerClassname)[0] as HTMLDivElement).style.height,
        ).toBe(`${heightAnalaysisChartMobile}px`)
        expect((containerMobile.getElementsByClassName(analysisChartClassname)[0] as HTMLDivElement).style.height).toBe(
            `${heightAnalaysisChartMobile}px`,
        )

        // When Desktop
        mockIsMobile = false
        Element.prototype.getBoundingClientRect = jest.fn(() => {
            return {
                width: 120,
                height: heightAnalaysisChartDesktop,
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                x: 0,
                y: 0,
                toJSON: jest.fn(),
            }
        })
        const { container: containerDesktop } = reduxedRender(
            <Router>
                <AnalysisChart {...mockAnalysisChartProps} />
            </Router>,
        )

        expect(
            (containerDesktop.getElementsByClassName(analysisChartContainerClassname)[0] as HTMLDivElement).style
                .height,
        ).toBe(`${heightAnalaysisChartDesktop}px`)
        expect(
            (containerDesktop.getElementsByClassName(analysisChartClassname)[0] as HTMLDivElement).style.height,
        ).toBe(`${heightAnalaysisChartDesktop}px`)
    })
    test('when data from useMetrics is empty, AnalysisChart should show empty message', async () => {
        mockAnalysisChartProps.data = []
        const { getByText } = reduxedRender(
            <Router>
                <AnalysisChart {...mockAnalysisChartProps} />
            </Router>,
        )
        expect(getByText(NO_DATA_TEXT)).toBeTruthy()
    })
})
