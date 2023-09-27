import { reduxedRender } from 'src/common/react-platform-components/test'
import AnalysisChart from 'src/modules/Analysis/components/AnalysisChart'
import { BrowserRouter as Router } from 'react-router-dom'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { FAKE_WEEK_DATA } from 'src/mocks/handlers/metrics'
import { createTheme } from '@mui/material/styles'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import AnalysisChartTooltip from 'src/modules/Analysis/components/AnalysisChart/AnalysisChartTooltip'
import { renderToString } from 'react-dom/server'
import { getDataFromYAxis } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import convert from 'convert-units'

let mockData: IMetric[] = [{ target: metricTargetsEnum.consumption, datapoints: FAKE_WEEK_DATA }]
const NO_DATA_TEXT = 'Aucune donnée disponible'
const analysisChartContainerClassname = 'analysisChartContainer'
const analysisChartClassname = 'apexcharts-inner apexcharts-graphical'
const heightAnalaysisChartMobile = 360
const heightAnalaysisChartDesktop = 520
const mockAnalysisChartProps = {
    data: mockData,
    children: <></>,
    getSelectedValueElementColor: jest.fn(),
}

// need to mock this because myHouseConfig uses it
jest.mock('src/modules/MyHouse/utils/MyHouseUtilsFunctions.ts', () => ({
    ...jest.requireActual('src/modules/MyHouse/utils/MyHouseUtilsFunctions.ts'),
    //eslint-disable-next-line
    arePlugsUsedBasedOnProductionStatus: () => true,
    //eslint-disable-next-line
    isProductionActiveAndHousingHasAccess: () => true,
}))

let mockIsMobile = true
// testing for mobile as default
jest.mock(
    '@mui/material/useMediaQuery',
    () => (_params: any) =>
        // eslint-disable-next-line jsdoc/require-jsdoc
        mockIsMobile,
)
const mockValueSelected = getDataFromYAxis(mockData, metricTargetsEnum.consumption)[0]
const mockValueHovered = getDataFromYAxis(mockData, metricTargetsEnum.consumption)[2]
const mockTimeStampValueSelected = mockData[0].datapoints[0][1]
const mockTimeStampValueHovered = mockData[0].datapoints[2][1]
const tooltipContainerClassname = 'tooltipContainer'
const analysisChartValueClasslist = ['element-0', 'apexcharts-polararea-slice-0']
const mockTheme = createTheme()
let mockEventSelected = {
    offsetX: 140,
    offsetY: 140,
    target: {
        classList: analysisChartValueClasslist,
        instance: {},
    },
    type: '',
}
const APEXCHARTS_LOAD_BUTTON_TEXT = 'UseEffect'

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
                <div className="apexcharts-canvas">
                    <div className="apexcharts-pie">
                        <div className="analysisChartValuesContainer apexcharts-slices">
                            <div>
                                <div
                                    style={{}}
                                    className={analysisChartValueClasslist.join(' ')}
                                    onClick={() => {
                                        // When clicking calling the dataPointSelection given, to be tested.
                                        props.options.chart!.events!.dataPointSelection(
                                            mockEventSelected,
                                            {},
                                            { dataPointIndex: 0, w: { config: { colors: ['', '', ''] } } },
                                        )
                                    }}
                                >
                                    {mockValueSelected}
                                </div>
                            </div>
                            <div>
                                <div style={{}} className="apexcharts-polararea-slice-1">
                                    {1}
                                </div>
                            </div>
                            <div>
                                <div
                                    style={{}}
                                    className="apexcharts-polararea-slice-2"
                                    onMouseEnter={() => {
                                        // When hovering There won't be any order change.
                                        props.options.chart!.events!.dataPointMouseEnter(
                                            mockEventSelected,
                                            {},
                                            { dataPointIndex: 2, w: { config: { colors: ['', '', ''] } } },
                                        )
                                    }}
                                >
                                    {2}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tooltipContainer apexcharts-tooltip"></div>
                </div>
                <button onClick={() => props.options.chart!.events!.animationEnd()}>UseEffect</button>
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
        const { getByText: getByTextMobile, container: containerMobile } = reduxedRender(
            <Router>
                <AnalysisChart {...mockAnalysisChartProps} />
            </Router>,
        )

        // When mobile
        userEvent.click(getByTextMobile(APEXCHARTS_LOAD_BUTTON_TEXT))
        await waitFor(() => {
            expect(
                (containerMobile.getElementsByClassName(analysisChartContainerClassname)[0] as HTMLDivElement).style
                    .height,
            ).toBe(`${heightAnalaysisChartMobile}px`)
        })
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
        const { getAllByText: getAllByTextDesktop, container: containerDesktop } = reduxedRender(
            <Router>
                <AnalysisChart {...mockAnalysisChartProps} />
            </Router>,
        )

        userEvent.click(getAllByTextDesktop(APEXCHARTS_LOAD_BUTTON_TEXT)[1])
        await waitFor(() => {
            expect(
                (containerDesktop.getElementsByClassName(analysisChartContainerClassname)[0] as HTMLDivElement).style
                    .height,
            ).toBe(`${heightAnalaysisChartDesktop}px`)
        })
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

    test('When selecting analysisChart Element tooltip should be shown, and stroke color should change, and order of analysisInformation should change', async () => {
        const mockGetSelectedValueElementColor = jest.fn()
        mockAnalysisChartProps.getSelectedValueElementColor = mockGetSelectedValueElementColor
        // Testing overflowing tooltip on left of analysisChart
        let styleDirectionLeft = '20px'
        const styleDirectionTop = '100px'
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
        mockAnalysisChartProps.data[0].datapoints = mockAnalysisChartProps.data[0].datapoints.slice(0, 3)
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
        expect(tooltipContainerElement.style.top).toBe(styleDirectionTop)
        expect(tooltipContainerElement.style.left).toBe(styleDirectionLeft)
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
        // Stroke color should change in the valueSelected.
        expect(getByText(mockValueSelected).style.stroke).toBe(mockTheme.palette.primary.light)
        // Test that there is order change in informationList, with this function having been called
        expect(mockGetSelectedValueElementColor).toHaveBeenCalled()

        /*** Hover on AnalysisChart */
        // Testing overflowing tooltip on right of analysisChart
        mockEventSelected = {
            ...mockEventSelected,
            offsetX: 0,
            type: 'mouseenter',
        }
        styleDirectionLeft = '0px'
        // When hover a value tooltip should be shown.
        userEvent.hover(getByText(2))
        await waitFor(() => {
            expect(tooltipContainerElement.firstElementChild! as HTMLDivElement).toBeInTheDocument()
        })
        expect(tooltipContainerElement.innerHTML).toBe(
            renderToString(
                <AnalysisChartTooltip
                    valueIndex={0}
                    values={[convert(mockValueHovered).from('Wh').to('kWh')]}
                    timestampValues={[mockTimeStampValueHovered]}
                    theme={mockTheme}
                />,
            ),
        )
        // Stroke color should change in the valueSelected.
        expect(getByText(2).style.stroke).toBe(mockTheme.palette.primary.light)
        // The getSelectedValueElementColor have been called one time when its click, and not called when its hover.
        expect(mockGetSelectedValueElementColor).toHaveBeenCalledTimes(1)
    }, 20000)
})
