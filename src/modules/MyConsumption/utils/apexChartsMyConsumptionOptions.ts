import { formatMessageType } from 'src/common/react-platform-translation'
import { Theme } from '@mui/material/styles/createTheme'
import { Props } from 'react-apexcharts'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import dayjs from 'dayjs'
import fr from 'apexcharts/dist/locales/fr.json'
import {
    chartSpecifities,
    getChartColor,
    getYPointValueLabel,
} from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'

/**
 * Default ApexChart Options, represent the general options related to the overall look of the MyConsumptionChart.
 *
 * @param theme Current Theme so that we set the grid colors, background of chart, font of chart related to the theme.
 * @returns Default ApexChart Options for MyConsumptionChart.
 */
export const defaultApexChartOptions: (theme: Theme) => Props['options'] = (theme) => ({
    chart: {
        fontFamily: theme.typography.fontFamily,
        background: theme.palette.primary.main,
        stacked: false,
        locales: [fr],
        defaultLocale: 'fr',
        height: '100%',
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false,
        },
        animations: {
            enabled: false,
        },
    },
    theme: {
        // We set the theme so that the text in the chart and stuffs is updated.
        mode: theme.palette.mode === 'light' ? 'dark' : 'light',
    },
    legend: {
        show: false,
    },

    dataLabels: {
        enabled: false,
    },
    fill: {
        type: 'solid',
        opacity: 0.7,
        gradient: {
            shadeIntensity: 0.4,
            opacityFrom: 1,
            opacityTo: 0.5,
            stops: [30, 100, 100],
        },
    },
    grid: {
        show: true,
        strokeDashArray: 4,
        position: 'back',
        borderColor: theme.palette.primary.contrastText,
        xaxis: {
            lines: {
                show: true,
                offsetY: 0,
                offsetX: 0,
            },
        },
    },
    xaxis: {
        tooltip: {
            enabled: false,
        },
        axisBorder: {
            show: true,
            strokeWidth: 3,
        },
        type: 'category',
        tickPlacement: 'on',
    },
    stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: [theme.palette.primary.contrastText],
        width: 1.5,
        dashArray: 0,
    },
    markers: {
        strokeWidth: 1.5,
        strokeOpacity: 1,
        strokeDashArray: 0,
        fillOpacity: 1,
        shape: 'circle',
        radius: 2,
        hover: {
            size: 5,
        },
    },
})

/**
 * Get date dayjs format for xxaxis and tooltip label according to the current period selected.
 *
 * @param period Current Period.
 * @param isTooltipLabel Indicate if it's tooltipXAxis label.
 * @returns Format of xAxis or tooltip labels according to the current period.
 */
const getXAxisLabelFormatFromPeriod = (period: periodType, isTooltipLabel?: boolean) => {
    switch (period) {
        case 'daily':
            return 'HH:mm'
        case 'weekly':
            return isTooltipLabel ? 'ddd DD MMM' : 'ddd'
        case 'yearly':
            return isTooltipLabel ? 'MMMM' : 'MMM'
        default:
            return isTooltipLabel ? 'ddd DD MMM' : 'D MMM'
    }
}

/**
 * Function that returns apexCharts Props related to MyConsumptionChart with its different yAxis charts for each target.
 *
 * @param params N/A.
 * @param params.yAxisSeries Represents yAxisSeries that has same format as apexChartsChartSeries, which represents a list of yAxis for each target, that will be customized (color, labels, types ...etc) that suits MyConsumptionChart (for example, when target is consumption it should have theme.palette.primary.light color).
 * @param params.xAxisValues Represents the xAxisValues for all apexCharts that will be the same in myConsumptionChart, xAxisValues are going to be categories of apexCharts.
 * @param params.theme Represents the current theme as it is needed to set apexCharts options to fit MyConsumptionChart, for example the colors of the grid should be theme.palette.primary.contrastText.
 * @param params.period Represents the current period ('daily', 'weekly', 'monthly', 'yearly' ...etc), which will be used to handle xAxis values format (for example when yearly we should show values as 'January', 'February', ...etc).
 * @param params.formatMessage Represents the formatMessage from useIntl to handle translation of yAxis names.
 * @param params.chartType Represents the type of the consumption Chart (type has the format of ApexChart['type']).
 * @returns Props of apexCharts in MyConsumptionChart.
 */
export const getApexChartMyConsumptionProps = ({
    yAxisSeries,
    xAxisValues,
    theme,
    period,
    formatMessage,
    chartType,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    yAxisSeries: ApexAxisChartSeries
    // eslint-disable-next-line jsdoc/require-jsdoc
    xAxisValues: ApexXAxis['categories']
    // eslint-disable-next-line jsdoc/require-jsdoc
    theme: Theme
    // eslint-disable-next-line jsdoc/require-jsdoc
    period: periodType
    // eslint-disable-next-line jsdoc/require-jsdoc
    formatMessage: formatMessageType
    // eslint-disable-next-line jsdoc/require-jsdoc
    chartType: ApexChart['type']
}) => {
    let options: Props['options'] = defaultApexChartOptions(theme)!
    let myConsumptionApexChartSeries: ApexAxisChartSeries = []
    let yAxisOptions: ApexYAxis[] = []
    // For each chart we'll indicate what size his marker is.
    let markerSizeList: number[] = []
    // Stroke represent the line that joins all points of a chart (Stroke should be shown only for line charts, drawing the stroke in the consumption chart makes it too cumbersome).
    let strokeWidthList: number[] = []

    // We save the maximum value, so that it'll indicate the unit of the chart, For Consumption (W, kWh or MWh will be indicated according to the max value unit).
    let consumptionMaxYValue = 0
    yAxisSeries.forEach((yAxisSerie) => {
        // If this Serie doesn't have any data we don't show it on the chart thus we do return, and if this is true for all series then we'll show an empty chart.
        if (yAxisSerie.data.length === 0) return
        const { label, ...restChartSpecifities } = chartSpecifities[yAxisSerie.name as metricTargetsEnum]
        myConsumptionApexChartSeries!.push({
            ...yAxisSerie,
            color: getChartColor(yAxisSerie.name as metricTargetsEnum, theme),
            name: formatMessage({
                id: label,
                defaultMessage: label,
            }),
            type: yAxisSerie.name === metricTargetsEnum.consumption ? chartType : 'line',
        })

        // We compute the consumption chart maximum y value, so that we can indicate the correct unit on the chart, and we do it only one time with this condition.
        if (yAxisSerie.name === metricTargetsEnum.consumption && period !== 'daily')
            consumptionMaxYValue = Math.max(...(yAxisSerie.data as Array<number>))

        yAxisOptions.push({
            ...restChartSpecifities,
            opposite: yAxisSerie.name !== metricTargetsEnum.consumption,
            labels: {
                /**
                 * Represent the label shown in the yAxis for each value (this also is take as yAxis label in tooltip).
                 *
                 * @param value Yaxis Value.
                 * @returns Desired label to be shown for values in the yAxis.
                 */
                formatter: (value: number) => {
                    if (yAxisSerie.name === metricTargetsEnum.consumption) {
                        // Consumption unit shown in the chart will be W if its daily, or it'll be the unit of the maximum y value.
                        const consumptionUnit =
                            period === 'daily' ? 'W' : consumptionWattUnitConversion(consumptionMaxYValue).unit
                        return getYPointValueLabel(value, yAxisSerie.name as metricTargetsEnum, consumptionUnit)
                    }
                    return getYPointValueLabel(value, yAxisSerie.name as metricTargetsEnum)
                },
            },
            axisBorder: {
                show: true,
            },
            axisTicks: {
                show: true,
            },
        })
        // When period is daily and chart is consumption then we show no marker, otherwise if period is not daily we don't show consumption marker.
        markerSizeList.push(yAxisSerie.name === metricTargetsEnum.consumption || period === 'daily' ? 0 : 2)
        // When chart is consumption then we show no stroke cause the area chart is enough otherwise it'll be too cumbersome.
        strokeWidthList.push(yAxisSerie.name === metricTargetsEnum.consumption ? 0 : 1.5)
    })

    options.xaxis = {
        ...options.xaxis,
        categories: xAxisValues,
        labels: {
            format: 'HH:mm',
            /**
             * Formatter function for showing label in the xAxis.
             *
             * @param value Number.
             * @returns Label that's going to be shown in the xaxis.
             */
            formatter(value) {
                // If period === daily, on the xAxis label we'll show only by hours [1:00, 2:00, ... 23:00], and thus we take only the timestamps that has minutes and second to 00 (HH:00:00 represent the first hour).
                if (period === 'daily' && dayjs.utc(new Date(value).toUTCString()).format('mm:ss') !== '00:00')
                    return ''
                return dayjs.utc(new Date(value).toUTCString()).format(getXAxisLabelFormatFromPeriod(period))
            },
        },
    }

    options.tooltip = {
        x: {
            /**
             * Formatter function for showing label in the tooltip.
             *
             * @param index Represent the index in the xAxisValues.
             * @returns Label concerning the xaxis that's going to be shown in the tooltip.
             */
            formatter: (index: number) => {
                return dayjs
                    .utc(new Date(xAxisValues[index - 1]).toUTCString())
                    .format(getXAxisLabelFormatFromPeriod(period, true))
            },
        },
    }
    options!.markers!.size = markerSizeList
    options!.stroke!.width = strokeWidthList
    options.yaxis = yAxisOptions
    return { series: myConsumptionApexChartSeries, options }
}
