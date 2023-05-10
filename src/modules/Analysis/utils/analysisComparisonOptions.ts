import { Theme } from '@mui/material/styles/createTheme'
import convert from 'convert-units'
import { round, sum } from 'lodash'
import { Props } from 'react-apexcharts'
import { defaultApexChartOptions } from 'src/modules/MyConsumption/utils/apexChartsMyConsumptionOptions'

/**
 * Function that returns apexCharts Props related to MyConsumptionChart with its different yAxis charts for each target.
 *
 * @param params N/A.
 * @param params.yAxisSeries Represents yAxisSeries that has same format as apexChartsChartSeries, which represents a list of yAxis for each target, that will be customized (color, labels, types ...etc) that suits MyConsumptionChart (for example, when target is consumption it should have theme.palette.primary.light color).
 * @param params.theme Represents the current theme as it is needed to set apexCharts options to fit MyConsumptionChart, for example the colors of the grid should be theme.palette.primary.contrastText.
 * @returns Props of apexCharts in MyConsumptionChart.
 */
export const getApexChartAnalysisComparisonProps = ({
    yAxisSeries,
    theme,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    yAxisSeries: ApexAxisChartSeries
    // eslint-disable-next-line jsdoc/require-jsdoc
    theme: Theme
}) => {
    let options: Props['options'] = defaultApexChartOptions(theme)!
    let analysisComparisonApexChartSeries: ApexAxisChartSeries = []
    let yAxisOptions: ApexYAxis[] = []
    let consumptionValuesWithoutTimestamps = yAxisSeries.map((serie) => serie['data'].map((d: any) => d[1]))

    analysisComparisonApexChartSeries = [
        {
            data: [convert(sum(consumptionValuesWithoutTimestamps[0])).from('Wh').to('kWh')],
            name: 'Ma Consommation',
            color: theme.palette.secondary.main,
        },
        {
            data: [round(4792 / 12)],
            name: 'Consommation moyenne ADEM',
            color: theme.palette.secondary.light,
        },
    ]

    yAxisOptions.push({
        show: true,
        axisTicks: {
            show: true,
        },
        axisBorder: {
            show: true,
        },
        labels: {
            show: true,
            // eslint-disable-next-line jsdoc/require-jsdoc
            formatter: (value: number, _opts: any) => {
                return `${value} kWh`
            },
        },
    })

    options.legend! = {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        onItemClick: {
            toggleDataSeries: false,
        },
    }
    options.chart!.background = theme.palette.common.white
    options.chart!.foreColor = theme.palette.common.black
    options.xaxis = {
        ...options.xaxis,
        type: 'category',
        tickPlacement: 'between',
        categories: [''],
        labels: {
            show: false, // hide the x-axis category labels
        },
    }

    options.stroke = {
        colors: ['transparent'],
        width: 5,
    }
    options.yaxis = yAxisOptions
    options!.tooltip = {
        style: {
            fontSize: '10px',
        },
        intersect: false,
        shared: true,
        x: {
            /**
             * Formatter function for xaxis.
             *
             * @returns {string}.
             */
            formatter(): string {
                return ''
            },
        },
    }
    options.plotOptions = {
        bar: {
            horizontal: false,
            columnWidth: '25%',
        },
    }
    options.responsive = [
        {
            breakpoint: 768, // adjust width at this breakpoint
            options: {
                plotOptions: {
                    bar: {
                        columnWidth: '80%', // adjust column width
                    },
                },
                legend: {
                    horizontalAlign: 'left',
                },
            },
        },
    ]
    return { series: analysisComparisonApexChartSeries, options }
}
