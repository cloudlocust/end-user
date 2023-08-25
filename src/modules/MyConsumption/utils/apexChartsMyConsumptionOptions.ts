import { formatMessageType } from 'src/common/react-platform-translation'
import { Theme } from '@mui/material/styles/createTheme'
import { Props } from 'react-apexcharts'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import dayjs from 'dayjs'
import fr from 'apexcharts/dist/locales/fr.json'
import { getChartColor, getYPointValueLabel } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { metricTargetsEnum, metricTargetType } from 'src/modules/Metrics/Metrics.d'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'
import {
    convertConsumptionToWatt,
    getChartSpecifities,
    getChartType,
} from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import timezone from 'dayjs/plugin/timezone'
import { sum } from 'lodash'
dayjs.extend(timezone)

/**
 * Default ApexChart Options, represent the general options related to the overall look of the MyConsumptionChart.
 *
 * @param theme Current Theme so that we set the grid colors, background of chart, font of chart related to the theme.
 * @returns Default ApexChart Options for MyConsumptionChart.
 */
export const defaultApexChartOptions: (theme: Theme) => Props['options'] = (theme) => ({
    chart: {
        fontFamily: theme.typography.fontFamily,
        background: theme.palette.primary.dark,
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
        yaxis: {
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
 * @param params.isStackedEnabled Boolean state to know whether the stacked option is true or false.
 * @param params.chartType Consumption or production type.
 * @param params.chartLabel Chart label according to enphase state.
 * @param params.metricsInterval Active metrics interval.
 * @returns Props of apexCharts in MyConsumptionChart.
 */
export const getApexChartMyConsumptionProps = ({
    yAxisSeries,
    theme,
    period,
    formatMessage,
    isStackedEnabled,
    chartType,
    chartLabel,
    metricsInterval,
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
    isStackedEnabled?: boolean
    // eslint-disable-next-line jsdoc/require-jsdoc
    chartType: 'consumption' | 'production'
    // eslint-disable-next-line jsdoc/require-jsdoc
    chartLabel?: 'Consommation totale' | 'Electricité achetée sur le réseau'
    // eslint-disable-next-line jsdoc/require-jsdoc
    metricsInterval?: '1m' | '30m'
    // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
    let options: Props['options'] = defaultApexChartOptions(theme)!
    let myConsumptionApexChartSeries: ApexAxisChartSeries = []
    let yAxisOptions: ApexYAxis[] = []
    let xAxisType: ApexXAxis['type'] = undefined
    // For each chart we'll indicate what size his marker is.
    let markerSizeList: number[] = []
    // Stroke represent the line that joins all points of a chart (Stroke should be shown only for line charts, drawing the stroke in the consumption chart makes it too cumbersome).
    let strokeWidthList: number[] = []

    // We save the maximum value, so that it'll indicate the unit of the chart, For Consumption (W, kWh or MWh will be indicated according to the max value unit).
    let maxYValue = 0
    // This variable is used to determine if we should show the Total Production, only when injected is 0.
    // TODO Refactor to a simpler way split getApexChartMyConsumptionProps to production & consumption props maybe, and have Chart component for each chartType.
    let showTotalProduction = false
    // eslint-disable-next-line sonarjs/cognitive-complexity

    yAxisSeries.forEach((yAxisSerie) => {
        // Keep track of the labels that have already been rendered (for consumption and production charts, values are rounded and this causes duplication).
        let labelsRendered: string[] = []
        // If this Serie doesn't have any data we don't show it on the chart thus we do return, and if this is true for all series then we'll show an empty chart.
        if (yAxisSerie.data.length === 0) return
        // Get specifity of each chart.
        const { label, ...restChartSpecifities } = getChartSpecifities(yAxisSerie.name as metricTargetsEnum, chartLabel)

        // Changing type to category instead of datetime, because apexcharts when period monthly which has at least 30 elements, it takes control of showing the xaxis labels, which the visual is not according to our need.
        // That's why change in it to category makes apexcharts gives us the full control for xaxis labels, and thus we can have xaxis visual according to our need
        if (period === 'monthly' || period === 'weekly') xAxisType = 'category'

        // Showing the total production only if the injected production have null or 0 values, To check that injectedProduction have null values happens when sum of injectedProduction is 0.
        // TODO Refactor to a simpler way split getApexChartMyConsumptionProps to production & consumption props maybe, and have Chart component for each chartType.
        if (yAxisSerie.name === metricTargetsEnum.injectedProduction) {
            const totalInjectedProduction = sum(
                yAxisSerie.data.map((datapoint) => Number((datapoint as [number, number])[1])),
            )
            showTotalProduction = totalInjectedProduction === 0
        }

        myConsumptionApexChartSeries!.push({
            ...yAxisSerie,
            color: getChartColor(yAxisSerie.name as metricTargetsEnum, theme),
            name: formatMessage({
                id: label,
                defaultMessage: label,
            }),
            type:
                yAxisSerie.name === metricTargetsEnum.totalProduction && !showTotalProduction
                    ? ''
                    : getChartType(yAxisSerie.name as metricTargetType, period),
        })

        // We compute the consumption chart maximum y value, so that we can indicate the correct unit on the chart, and we do it only one time with this condition.
        // data.length !== 1440 is added because there can be case where period is not daily, and yAxisSerie.data didn't updated and still express data of daily.
        // TODO Fix find a better way to reender period and data at same time, instead of doing yAxisSerie.data.length !== 1440
        // TODO Clean this in a function.
        if (
            (yAxisSerie.name === metricTargetsEnum.consumption ||
                yAxisSerie.name === metricTargetsEnum.autoconsumption ||
                yAxisSerie.name === metricTargetsEnum.injectedProduction ||
                yAxisSerie.name === metricTargetsEnum.totalProduction) &&
            period !== 'daily' &&
            (yAxisSerie.data.length !== 48 || 1440)
        ) {
            maxYValue = Math.max(
                maxYValue,
                ...(yAxisSerie.data.map((datapoint) => (datapoint as [number, number])[1]) as Array<number>),
            )
        }

        yAxisOptions.push({
            ...restChartSpecifities,
            opposite:
                yAxisSerie.name !== metricTargetsEnum.consumption &&
                yAxisSerie.name !== metricTargetsEnum.eurosConsumption &&
                yAxisSerie.name !== metricTargetsEnum.totalProduction &&
                yAxisSerie.name !== metricTargetsEnum.injectedProduction,

            labels: {
                /**
                 * Represent the label shown in the yAxis for each value (this also is take as yAxis label in tooltip).
                 *
                 * @param value Yaxis Value.
                 * @param isTooltipOrYaxisLineIndex Whether this values is number representing the index of yAxis Line, Or the chart context when we selecting Tooltip.
                 * @returns Desired label to be shown for values in the yAxis.
                 */
                formatter: (value, isTooltipOrYaxisLineIndex) => {
                    const isTooltipValue = typeof isTooltipOrYaxisLineIndex !== 'number'
                    if (
                        yAxisSerie.name === metricTargetsEnum.consumption ||
                        yAxisSerie.name === metricTargetsEnum.autoconsumption ||
                        yAxisSerie.name === metricTargetsEnum.totalProduction ||
                        yAxisSerie.name === metricTargetsEnum.injectedProduction
                    ) {
                        // Consumption unit shown in the chart will be W if its daily, or it'll be the unit of the maximum y value.
                        const label =
                            period === 'daily'
                                ? convertConsumptionToWatt(value, !isTooltipValue, metricsInterval)
                                : getYPointValueLabel(
                                      value,
                                      yAxisSerie.name as metricTargetsEnum,
                                      consumptionWattUnitConversion(maxYValue).unit,
                                      !isTooltipValue,
                                  )

                        // Keep track of the labels that have already been rendered
                        // If the type is number means it is printing the y-axis labels.
                        if (!isTooltipValue) {
                            // Case: When there are multiple values rounded to 0, we keep only the one shown at the bottom of the y-axis.
                            if (parseInt(label) === 0 && isTooltipOrYaxisLineIndex !== 0) return ''
                            // If it's not rendered hide the value.
                            if (labelsRendered.includes(label)) return ''
                            // Add the current label to the list of rendered labels
                            labelsRendered.push(label)
                        }
                        // Reset labelsRendered for next yAxis labels filling
                        else labelsRendered = []

                        return label
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
        // We don't show marker.
        markerSizeList.push(0)
        // When chart is consumption or eurosConsumption then we show no stroke cause the area chart is enough otherwise it'll be too cumbersome.
        strokeWidthList.push(
            yAxisSerie.name === metricTargetsEnum.consumption ||
                yAxisSerie.name === metricTargetsEnum.eurosConsumption ||
                yAxisSerie.name === metricTargetsEnum.autoconsumption ||
                yAxisSerie.name === metricTargetsEnum.totalProduction ||
                yAxisSerie.name === metricTargetsEnum.injectedProduction
                ? 0
                : 1.5,
        )
    })

    options.xaxis = {
        ...options.xaxis,
        type: xAxisType || 'datetime',
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
                // !! The condition format the yearly tooltip value to Paris timing to avoid a visual bug due to summer time (GMT+1 / GMT+2)
                if (period === 'yearly') {
                    return dayjs(new Date(timestamp).toUTCString())
                        .tz('Europe/Paris')
                        .format(getXAxisLabelFormatFromPeriod('yearly', true))
                } else {
                    return dayjs
                        .utc(new Date(timestamp).toUTCString())
                        .format(getXAxisLabelFormatFromPeriod(period, true))
                }
            },
        },
    }

    if (xAxisType === 'category') {
        /**
         * Formatter function for showing label in the xAxis when period is monthly because datetime hides as he pleasès xaxis labels and it gives us unwanted visuals and there is nothing to do about it.
         *
         * @param value Represent the timestamp in the xAxisValues.
         * @param _timestamp Represent the timestamp in the xAxisValues.
         * @returns Label xaxis.
         */
        options.xaxis!.labels!.formatter = (value, _timestamp) =>
            dayjs.utc(new Date(value!).toUTCString()).format('ddd D')
        options.xaxis!.labels!.rotate = 0
    }

    if (period === 'daily') {
        options.chart = {
            ...options.chart,
            toolbar: {
                show: true,
                tools: {
                    download: false,
                    pan: false,
                },
            },
            zoom: {
                enabled: true,
            },
        }
    }

    options.chart!.stacked = chartType === 'consumption' ? isStackedEnabled : true
    options!.markers!.size = markerSizeList
    options!.stroke!.width = strokeWidthList
    options.yaxis = yAxisOptions
    return { series: myConsumptionApexChartSeries, options }
}
