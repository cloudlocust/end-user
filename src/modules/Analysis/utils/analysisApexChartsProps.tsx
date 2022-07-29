import { Theme } from '@mui/material/styles/createTheme'
import { Props } from 'react-apexcharts'
import AnalysisChartTooltip from 'src/modules/Analysis/components/AnalysisChart/AnalysisChartTooltip'
import { normalizeValues } from './computationFunctions'
import { renderToString } from 'react-dom/server'

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
