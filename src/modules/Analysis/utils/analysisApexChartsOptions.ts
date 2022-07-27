import { Theme } from '@mui/material/styles/createTheme'
import { Props } from 'react-apexcharts'

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
export const getAnalysisApexChartOptions = (
    // eslint-disable-next-line jsdoc/require-jsdoc
    values: ApexNonAxisChartSeries,
    // eslint-disable-next-line jsdoc/require-jsdoc
    theme: Theme,
) => {
    let analysisApexChartsOptions: Props['options'] = defaultAnalysisApexChartsOptions(theme)!

    analysisApexChartsOptions.tooltip = {
        y: {
            /**
             * Customize the text in the tooltip.
             *
             * @param normalizedValue Represent normalized value not the real value.
             * @param opts N/A.
             * @param opts.seriesIndex Represent the index of the real value in given values.
             * @returns Text in the tooltip.
             */
            formatter: function (normalizedValue, { seriesIndex: valueIndex }) {
                return `${Number(values[valueIndex]).toFixed(2)} kWh`
            },
            title: {
                /**
                 * Remove the title in the tooltip so that we show only the ${value} Kwh.
                 *
                 * @param seriesName SerieName.
                 * @returns New tooltip title.
                 */
                formatter: (seriesName) => '',
            },
        },
    }
    return analysisApexChartsOptions
}
