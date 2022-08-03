import { reduxedRender } from 'src/common/react-platform-components/test'
import AnalysisChart from 'src/modules/Analysis/components/AnalysisChart'
import { BrowserRouter as Router } from 'react-router-dom'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { TEST_SUCCESS_WEEK_METRICS } from 'src/mocks/handlers/metrics'
import { createTheme } from '@mui/material/styles'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import AnalysisChartTooltip from 'src/modules/Analysis/components/AnalysisChart/AnalysisChartTooltip'
import { renderToString } from 'react-dom/server'
import { getDataFromYAxis } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import convert from 'convert-units'

let mockData: IMetric[] = TEST_SUCCESS_WEEK_METRICS([metricTargetsEnum.consumption])
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
const mockValueSelected = getDataFromYAxis(mockData, metricTargetsEnum.consumption)[0]
const mockTimeStampValueSelected = mockData[0].datapoints[0][1]
const tooltipContainerClassname = 'tooltipContainer'
const analysisChartValueClasslist = ['element-0', 'apexcharts-polararea-slice-0']
const mockTheme = createTheme()

const mockEventNotSelected = {
    offsetX: 140,
    offsetY: 140,
    target: {
        classList: analysisChartValueClasslist,
        instance: {},
    },
}

const mockEventSelected = {
    ...mockEventNotSelected,
    target: {
        ...mockEventNotSelected.target,
        instance: {
            // Represent the styling when Chart Value is selected (When hover a valueElement background got grey, because of filter css property).
            filterer: {
                background: 'grey',
            },
        },
    },
}

let mockEvent: typeof mockEventSelected | typeof mockEventNotSelected = mockEventSelected

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
            >
                <div className="analysisChartValuesContainer">
                    <div
                        className={analysisChartValueClasslist.join(' ')}
                        onClick={() => {
                            // When clicking calling the dataPointSelection given, to be tested.
                            props.options.chart!.events!.dataPointSelection(mockEvent, {}, { dataPointIndex: 0 })
                        }}
                    >
                        {mockValueSelected}
                    </div>
                </div>
                <div className="tooltipContainer apexcharts-tooltip"></div>
            </div>
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

    test('When selecting analysisChart Element tooltip should be shown, and stroke color should change', async () => {
        const styleDirection = '100px'
        const activeClassname = 'apexcharts-active'
        Element.prototype.getBoundingClientRect = jest.fn(() => {
            return {
                width: 120,
                height: heightAnalaysisChartMobile,
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                x: 10,
                y: 10,
                toJSON: jest.fn(),
            }
        })
        mockAnalysisChartProps.data = mockData
        const { container, getByText } = reduxedRender(
            <Router>
                <AnalysisChart {...mockAnalysisChartProps} />
            </Router>,
        )

        const tooltipContainerElement = container.getElementsByClassName(tooltipContainerClassname)[0] as HTMLDivElement

        // When selecting a value tooltip should be shown.
        userEvent.click(getByText(mockValueSelected))
        await waitFor(() => {
            expect(tooltipContainerElement.firstElementChild! as HTMLDivElement).toBeInTheDocument()
        })
        expect(tooltipContainerElement.style.top).toBe(styleDirection)
        expect(tooltipContainerElement.style.left).toBe(styleDirection)
        expect(tooltipContainerElement.innerHTML).toBe(
            renderToString(
                <AnalysisChartTooltip
                    valueIndex={0}
                    values={[convert(mockValueSelected).from('Wh').to('kWh')]}
                    timestampValues={[mockTimeStampValueSelected]}
                    theme={mockTheme}
                />,
            ),
        )
        expect(tooltipContainerElement.style.display).toBe('flex')
        expect(tooltipContainerElement.classList.contains(activeClassname)).toBeTruthy()

        // When deselecting a value tooltip should be hidden
        mockEvent = mockEventNotSelected
        userEvent.click(getByText(mockValueSelected))
        await waitFor(() => {
            expect(tooltipContainerElement.firstElementChild! as HTMLDivElement).not.toBeInTheDocument()
        })
        expect(tooltipContainerElement.style.display).toBe('none')
        expect(tooltipContainerElement.innerHTML).toBe('')
    }, 20000)
})
