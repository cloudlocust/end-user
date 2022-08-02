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
 * @param theme Current Theme so that we set tooltip color related to the theme.
 */
export const showAnalysisChartTooltipOnValueSelected = (e: any, values: ApexNonAxisChartSeries, theme: Theme) => {
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
            <AnalysisChartTooltip valueIndex={valueIndex} values={values} theme={theme} />,
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
 * Function that returns apexCharts Props related to MyConsumptionChart with its different yAxis charts for each target.
 *
 * @param values Represents values shown in the chart.
 * @param theme Represents the current theme as it is needed to set apexCharts options to fit MyConsumptionChart, for example the colors of the grid should be theme.palette.primary.contrastText.
 * @returns Props of apexCharts in MyConsumptionChart.
 */
export const getAnalysisApexChartProps = (
    // eslint-disable-next-line jsdoc/require-jsdoc
    values: ApexNonAxisChartSeries,
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
            renderToString(<AnalysisChartTooltip valueIndex={seriesIndex} values={values} theme={theme} />),
    }

    return {
        options: optionsAnalysisApexCharts,
        // normalize values to [200, 150], to improve polarArea chart and show all values from min to max.
        // Values taken of min: 150, max: 200, makes the bars big enough for the lowest value, while being able to show the CircleContent inside the chart.
        series: normalizeValues(values, 150, 200),
    }
}
