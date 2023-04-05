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

    yAxisOptions.push({
        axisBorder: {
            show: true,
        },
        axisTicks: {
            show: true,
        },
    })

    analysisComparisonApexChartSeries.push(
        {
            data: [convert(sum(consumptionValuesWithoutTimestamps[0])).from('Wh').to('kWh')],
            name: 'Ma Consommation',
            type: 'bar',
            color: theme.palette.secondary.main,
        },
        {
            data: [round(4792 / 12)],
            name: "Consommation moyenne globale d'un foyer selon l'ADEME",
            type: 'bar',
            color: theme.palette.secondary.light,
        },
    )

    options.legend! = {
        show: true,
        onItemClick: {
            toggleDataSeries: false,
        },
    }
    options.chart!.background = theme.palette.common.white
    options.chart!.foreColor = theme.palette.common.black
    options.xaxis = {
        ...options.xaxis,
        type: 'category',
        labels: {
            show: false,
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
        categories: ['Ma Consommation', "Consommation moyenne globale d'un foyer selon l'ADEME"],
    }

    options.yaxis = {
        show: false,
        axisTicks: {
            show: false,
        },
        axisBorder: {
            show: false,
        },
        labels: {
            show: false,
        },
    }
    options!.stroke!.width = 0
    options.yaxis = yAxisOptions
    return { series: analysisComparisonApexChartSeries, options }
}
