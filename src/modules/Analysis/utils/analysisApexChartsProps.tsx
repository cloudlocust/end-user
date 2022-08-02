import { Theme } from '@mui/material/styles/createTheme'
import { Props } from 'react-apexcharts'
import AnalysisChartTooltip from 'src/modules/Analysis/components/AnalysisChart/AnalysisChartTooltip'
import { normalizeValues } from './computationFunctions'
import { renderToString } from 'react-dom/server'
import { getColorsArrayType } from 'src/modules/Analysis/analysisTypes.d'

/**
 * Generating and showin a tooltip, when selecting an element because Apexcharts in its default behaviour, it doesn't show tooltip onClick only on hover which doesn't exist on mobile.
 *
 * @param e Selection Event of selected value.
 * @param values Represents values shown in the chart.
 * @param timestampValues Timestamps of the values.
 * @param theme Current Theme so that we set tooltip color related to the theme.
 */
export const showAnalysisChartTooltipOnValueSelected = (
    e: any,
    values: ApexNonAxisChartSeries,
    timestampValues: ApexNonAxisChartSeries,
    theme: Theme,
) => {
    const tooltipContainerElement = document.getElementsByClassName('apexcharts-tooltip')[0] as HTMLDivElement
    // Serie Element will have ClassList[1] as follow apexcharts-polararea-slice-18
    const valueIndex = Number(e.target.classList[1].split('-').slice(-1))
    // If the element is selected
    if (e.target.instance.filterer) {
        // Positioning the tooltip close to the click
        tooltipContainerElement.style!.left = `${e.offsetX - 40}px`
        tooltipContainerElement.style!.top = `${e.offsetY - 40}px`
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
    // If the element is deselected
    else {
        // Hide tooltip
        tooltipContainerElement.style.display = 'none'
        // Remove tooltip text is needed because we can have a behaviour where we store not related tooltip text
        tooltipContainerElement.innerHTML = ''
    }
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
        colors: [theme.palette.background.default],
    },
    fill: {
        opacity: 0.8,
    },
    colors: [theme.palette.primary.main],
})

/**
 * Return the opacity array, where we'll fill all values with default Opacity, only the one indicated in indexes array with opacity of 1.
 *
 * @param size Size of Opacity Array (representing the opacity for each index).
 * @param defaultOpacity Opacity applied to all elements.
 * @param indexes List of indexes that will have opacity of 1 in the opacity Array.
 * @returns Opacity Array.
 */
export const getFillOpacityArray = (size: number, defaultOpacity: number, indexes: number[]): number[] => {
    const fillOpacityArray = Array(size).fill(defaultOpacity)
    indexes.forEach((valIndex) => {
        fillOpacityArray[valIndex] = 1
    })
    return fillOpacityArray
}

/**
 * Get colors array for all values with defaultColor except the ones in indexes with their colorIndexes.
 *
 * @param size Size of colors Array (representing the color for each index).
 * @param opts Opts.
 * @param opts.defaultColor Default color applied to all elements.
 * @param opts.indexes List of indexes that will have different color.
 * @param opts.colorIndexes Color of the indexes elements, the first colorIndexes will go to the first indexes and so on...etc.
 * @returns Colors Array.
 */
export const getColorsArray: getColorsArrayType = (size, { defaultColor, indexes, colorIndexes }) => {
    const colorsArray = Array(size).fill(defaultColor)
    indexes.forEach((valIndex, i) => {
        colorsArray[valIndex] = colorIndexes[i]
    })
    return colorsArray
}

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
    let minIndex = values.indexOf(Math.min(...values))
    let maxIndex = values.indexOf(Math.max(...values))
    optionsAnalysisApexCharts.fill!.opacity = getFillOpacityArray(values.length, 0.7, [minIndex, maxIndex])
    optionsAnalysisApexCharts.colors = getColorsArray(values.length, {
        indexes: [minIndex, maxIndex],
        colorIndexes: [theme.palette.primary.light, theme.palette.primary.dark],
        defaultColor: theme.palette.primary.main,
    })

    return {
        options: optionsAnalysisApexCharts,
        // normalize values to [200, 150], to improve polarArea chart and show all values from min to max.
        // Values taken of min: 150, max: 200, makes the bars big enough for the lowest value, while being able to show the CircleContent inside the chart.
        series: normalizeValues(values, 150, 200),
    }
}
