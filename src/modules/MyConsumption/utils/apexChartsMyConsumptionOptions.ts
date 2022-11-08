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
import { metricTargetsEnum, metricTargetType } from 'src/modules/Metrics/Metrics.d'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'
import { getChartType } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'

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
        type: 'datetime',
        tickPlacement: 'on',
    },
    stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: [theme.palette.primary.contrastText],
        width: 0.5,
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
 * Get apexCharts format for xxaxis labels or dayjs format for tooltip label according to the current period selected.
 *
 * Apexcharts format: https://apexcharts.com/docs/datetime/.
 *
 * @param period Current Period.
 * @param isTooltipLabel Indicate if it's format (dayjs) tooltipXAxis label, by default its format apexcharts.
 * @returns Format of xAxis or tooltip labels according to the current period.
 */
const getXAxisLabelFormatFromPeriod = (period: periodType, isTooltipLabel?: boolean) => {
    switch (period) {
        case 'daily':
            return 'HH:mm'
        case 'yearly':
            return isTooltipLabel ? 'MMMM' : 'MMM'
        default:
            return isTooltipLabel ? 'ddd DD MMM' : 'ddd d'
    }
}

/**
 * Function that returns apexCharts Props related to MyConsumptionChart with its different yAxis charts for each target.
 *
 * @param params N/A.
 * @param params.yAxisSeries Represents yAxisSeries that has same format as apexChartsChartSeries, which represents a list of yAxis for each target, that will be customized (color, labels, types ...etc) that suits MyConsumptionChart (for example, when target is consumption it should have theme.palette.primary.light color).
 * @param params.theme Represents the current theme as it is needed to set apexCharts options to fit MyConsumptionChart, for example the colors of the grid should be theme.palette.primary.contrastText.
 * @param params.period Represents the current period ('daily', 'weekly', 'monthly', 'yearly' ...etc), which will be used to handle xAxis values format (for example when yearly we should show values as 'January', 'February', ...etc).
 * @param params.formatMessage Represents the formatMessage from useIntl to handle translation of yAxis names.
 * @param params.chartType Represents the type of the consumption Chart (type has the format of ApexChart['type']).
 * @returns Props of apexCharts in MyConsumptionChart.
 */
export const getApexChartMyConsumptionProps = ({
    yAxisSeries,
    theme,
    period,
    formatMessage,
    chartType,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    yAxisSeries: ApexAxisChartSeries
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
    let maxYValue = 0
    // eslint-disable-next-line sonarjs/cognitive-complexity
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
            type: getChartType(yAxisSerie.name as metricTargetType, period),
        })

        // We compute the consumption chart maximum y value, so that we can indicate the correct unit on the chart, and we do it only one time with this condition.
        // data.length !== 720 is added because there can be case where period is not daily, and yAxisSerie.data didn't updated and still express data of daily.
        // TODO Fix find a better way to reender period and data at same time, instead of doing yAxisSerie.data.length !== 720
        if (period !== 'daily' && (yAxisSerie.data.length !== 48 || 720)) {
            maxYValue = Math.max(
                ...(yAxisSerie.data.map((datapoint) => (datapoint as [number, number])[1]) as Array<number>),
            )
        }

        // maxYValue = Math.max(...(yAxisSerie.data as Array<number>), maxYValue)
        yAxisOptions.push({
            ...restChartSpecifities,
            opposite:
                yAxisSerie.name !== metricTargetsEnum.consumption &&
                yAxisSerie.name !== metricTargetsEnum.eurosConsumption,
            labels: {
                /**
                 * Represent the label shown in the yAxis for each value (this also is take as yAxis label in tooltip).
                 *
                 * @param value Yaxis Value.
                 * @returns Desired label to be shown for values in the yAxis.
                 */
                formatter: (value: number) => {
                    // Consumption unit shown in the chart will be W if its daily, or it'll be the unit of the maximum y value.
                    const consumptionUnit = period === 'daily' ? 'Wh' : consumptionWattUnitConversion(maxYValue).unit
                    return getYPointValueLabel(value, yAxisSerie.name as metricTargetsEnum, consumptionUnit)
                },
            },
            axisBorder: {
                show: true,
            },
            axisTicks: {
                show: true,
            },
        })
        // We don't show marker.
        markerSizeList.push(0)
        // When chart is consumption or eurosConsumption then we show no stroke cause the area chart is enough otherwise it'll be too cumbersome.
        strokeWidthList.push(
            yAxisSerie.name === metricTargetsEnum.consumption ||
                yAxisSerie.name === metricTargetsEnum.eurosConsumption ||
                yAxisSerie.name === metricTargetsEnum.autoconsumption
                ? 0
                : 1.5,
        )
    })

    options.xaxis = {
        ...options.xaxis,
        labels: {
            format: getXAxisLabelFormatFromPeriod(period),
            // Setting this false, because apexChart hides by default overlapping labels, and because we're hiding the labels with css, by letting apexCharts default it gives us unexpected styling behaviour
            // For example when period is monthly we want to show xAxis each 1 out of two days, and thus we can handle this with css only when apex shows all labels, cuz apex will hide some labels when they overlap.
            hideOverlappingLabels: false,
        },
    }

    options.tooltip = {
        x: {
            /**
             * Formatter function for showing label in the tooltip.
             *
             * @param timestamp Represent the timestamp in the xAxisValues.
             * @returns Label concerning the xaxis that's going to be shown in the tooltip.
             */
            formatter: (timestamp: number) => {
                return dayjs.utc(new Date(timestamp).toUTCString()).format(getXAxisLabelFormatFromPeriod(period, true))
            },
        },
    }

    options.chart!.stacked = true
    options!.markers!.size = markerSizeList
    options!.stroke!.width = strokeWidthList
    options.yaxis = yAxisOptions
    return { series: myConsumptionApexChartSeries, options }
}
