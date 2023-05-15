import { Theme } from '@mui/material/styles/createTheme'
import { Props } from 'react-apexcharts'
import AnalysisChartTooltip from 'src/modules/Analysis/components/AnalysisChart/AnalysisChartTooltip'
import { normalizeValues } from './computationFunctions'
import { renderToString } from 'react-dom/server'

/**
 * Generating and showin a tooltip, when selecting an element because Apexcharts in its default behaviour, it doesn't show tooltip onClick only on hover which doesn't exist on mobile.
 *
 * @param e Selection Event of selected value.
 * @param values Represents values shown in the chart.
 * @param timestampValues Timestamps of the values.
 * @param valueIndex Index of selected value.
 * @param theme Current Theme so that we set tooltip color related to the theme.
 */
export const showAnalysisChartTooltipOnValueSelected = (
    e: any,
    values: ApexNonAxisChartSeries,
    timestampValues: ApexNonAxisChartSeries,
    valueIndex: number,
    theme: Theme,
) => {
    const tooltipContainerElement = document.getElementsByClassName('apexcharts-tooltip')[0] as HTMLDivElement
    const analysisChartContainer = document.getElementsByClassName('apexcharts-canvas')[0] as HTMLDivElement
    // As default tooltip left position is 40px left the position of click
    let tooltipXStartPosition = e.offsetX - 40
    // Check if tooltip will be overflowing on Left of analysisChart
    // Tooltip overflow on left of analysisChart when start position of tooltip is before the start position of analysisChartContainer (which is represented by getBoundingClientRect().left )
    // If its true then tooltip will start its position where the click happened, as it'll have plenty space.
    if (tooltipXStartPosition <= analysisChartContainer.getBoundingClientRect().left) tooltipXStartPosition = e.offsetX
    // Check if tooltip will be overflowing on Right of analysisChart, then tooltip will end at the position of click
    // Tooltip overflow on right of analysisChart when right of tooltip (which is represented by the position of click + width of tooltip) is after the end position of analysisChartContainer (which is represented by getBoundingClientRect().right )
    else if (
        e.offsetX + tooltipContainerElement.getBoundingClientRect().width >=
        analysisChartContainer.getBoundingClientRect().right
    )
        // If its true then tooltip will end its position where the click happened.
        tooltipXStartPosition = e.offsetX - tooltipContainerElement.getBoundingClientRect().width
    tooltipContainerElement.style.left = `${tooltipXStartPosition}px`
    tooltipContainerElement.style.top = `${e.offsetY - 40}px`
    // Rendering the tooltip text
    tooltipContainerElement.innerHTML = renderToString(
        <AnalysisChartTooltip
            valueIndex={valueIndex}
            values={values}
            timestampValues={timestampValues}
            theme={theme}
        />,
    )
    // Displaying the tooltip
    tooltipContainerElement.classList.add('apexcharts-active')
    tooltipContainerElement.style.display = 'flex'
}

/**
 * Applying a stroke color to the selected element in analysisChart, as we deals with SVG elements, When you select an element it'll apply a stroke color and remove it when you select an other element.
 *
 * @param indexSelectedValue Index of selected value.
 * @param strokeColorSelectedValue Selected Value Stroke color applied.
 * @param defaultStrokeColor Default color applied as default stroke.
 */
export const addAnalysisChartSelectedValueStroke = (
    indexSelectedValue: number,
    strokeColorSelectedValue: string,
    defaultStrokeColor: string,
) => {
    const activeStrokeClassname = 'active-stroke'
    const chartValueElements = document.getElementsByClassName('apexcharts-slices')[0]
    // Check previous selectedElement and clear previous stroke.
    const previousSelectedElement = document.getElementsByClassName(activeStrokeClassname)[0] as SVGElement
    if (previousSelectedElement) {
        // Clear to default stroke
        ;(previousSelectedElement.firstElementChild! as SVGElement).style.stroke = defaultStrokeColor
        // Remove the active stroke class
        previousSelectedElement.classList.remove(activeStrokeClassname)
    }

    // Apply the stroke to the selected element
    const selectedValueElement = chartValueElements.children[indexSelectedValue] as SVGElement
    // Apply the selected element stroke color
    ;(selectedValueElement.firstElementChild! as SVGElement).style.stroke = strokeColorSelectedValue
    // Add the active stroke class
    selectedValueElement.classList.add(activeStrokeClassname)
}

/**
 * Default AnalysisApexChart Options, represent the default options of AnalysisChart.
 *
 * @param theme Current Theme so that we set properties related to the theme (such as chart color).
 * @returns Default AnalysisApexChart Options.
 */
export const defaultAnalysisApexChartsOptions: (theme: Theme) => Props['options'] = (theme) => ({
    chart: {
        height: '100%',
        width: '100%',
        animations: {
            enabled: true,
        },
    },
    legend: {
        show: false,
    },
    yaxis: {
        show: false,
    },
    plotOptions: {
        polarArea: {
            rings: {
                strokeColor: 'transparent',
            },
            spokes: {
                strokeWidth: 0,
                connectorColors: 'transparent',
            },
        },
    },
    stroke: {
        width: 2,
        colors: ['transparent'],
    },
    fill: {
        opacity: 0.8,
    },
    colors: [theme.palette.primary.main],
})

/**
 * Function that returns apexCharts Props related to MyConsumptionChart with its different yAxis charts for each target.
 *
 * @param values Represents values shown in the chart.
 * @param timestampValues Timestamps of the values.
 * @param theme Represents the current theme as it is needed to set apexCharts options to fit MyConsumptionChart, for example the colors of the grid should be theme.palette.primary.contrastText.
 * @returns Props of apexCharts in MyConsumptionChart.
 */
export const getAnalysisApexChartProps = (
    // eslint-disable-next-line jsdoc/require-jsdoc
    values: ApexNonAxisChartSeries,
    // eslint-disable-next-line jsdoc/require-jsdoc
    timestampValues: ApexNonAxisChartSeries,
    // eslint-disable-next-line jsdoc/require-jsdoc
    theme: Theme,
) => {
    let optionsAnalysisApexCharts: Props['options'] = defaultAnalysisApexChartsOptions(theme)!

    optionsAnalysisApexCharts.tooltip = {
        /**
         * Change default tooltip, to keep same tooltip when clicking or hovering.
         *
         * @param param0 N/A.
         * @param param0.seriesIndex Index of selected value.
         * @returns Custom tooltip.
         */
        custom: ({ seriesIndex }) =>
            renderToString(
                <AnalysisChartTooltip
                    valueIndex={seriesIndex}
                    values={values}
                    timestampValues={timestampValues}
                    theme={theme}
                />,
            ),
    }

    // Fill the min and max values with their corresponding colors colors
    let minDayConsumptionIndex = values.indexOf(Math.min(...values.filter((value) => value !== 0)))
    let maxDayConsumptionIndex = values.indexOf(Math.max(...values))

    const opacityList: number[] = []
    const colorList: string[] = []
    // Filling the color and opacity for each value in analysisChart.
    values.forEach((val, index) => {
        switch (index) {
            // When value represent the minDayConsumption then it has its own color.
            case minDayConsumptionIndex:
                opacityList.push(1)
                colorList.push(theme.palette.primary.light)
                break
            // When value represent the maxDayConsumption then it has its own color.
            case maxDayConsumptionIndex:
                opacityList.push(1)
                colorList.push(theme.palette.primary.dark)
                break
            default:
                // When value that's not minDayConsumption or maxDayConsumption then it'll have a different color, and when value is 0 then the element will be transparent (through opacity 0).
                // When value is 0 then we hide the element from analysisChart
                opacityList.push(val === 0 ? 0 : 0.7)
                colorList.push(theme.palette.primary.main)
                break
        }
    })
    optionsAnalysisApexCharts!.colors = colorList
    optionsAnalysisApexCharts!.fill!.opacity = opacityList

    return {
        options: optionsAnalysisApexCharts,
        // normalize values to [200, 150], to improve polarArea chart and show all values from min to max.
        // Values taken of min: 150, max: 200, makes the bars big enough for the lowest value, while being able to show the CircleContent inside the chart.
        // For consumption values of 0, it shouldn't be normalized as min, their charts should be only small enough to be selected.
        series: normalizeValues(values, 150, 200),
    }
}
