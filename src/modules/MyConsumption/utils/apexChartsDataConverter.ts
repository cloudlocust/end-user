import { IMetrics, metricTarget } from 'src/modules/Metrics/Metrics'
import { formatMessageType } from 'src/common/react-platform-translation'
import { Props } from 'react-apexcharts'
import fr from 'apexcharts/dist/locales/fr.json'
import { Theme } from '@mui/material/styles/createTheme'
import { periodValue } from 'src/modules/MyConsumption/myConsumptionTypes'
import { dayjsUTC } from 'src/common/react-platform-components'

// eslint-disable-next-line jsdoc/require-jsdoc
export const defaultApexChartOptions = (theme: Theme): Props['options'] => {
    return {
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
        },
        legend: {
            show: false,
        },
        theme: {
            // We set the theme so that the text in the chart and stuffs is updated.
            mode: theme.palette.mode === 'light' ? 'dark' : 'light',
        },
        dataLabels: {
            enabled: false,
        },
        fill: {
            type: 'solid',
            opacity: 0.7,
            colors: [theme.palette.primary.light],
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
            colors: [theme.palette.primary.contrastText],
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            width: 1.5,
            dashArray: 0,
        },
    }
}

// eslint-disable-next-line jsdoc/require-jsdoc
const defaultYAxisLabelsFormatter =
    // eslint-disable-next-line jsdoc/require-jsdoc
    (value: number) => `${value}`

// eslint-disable-next-line jsdoc/require-jsdoc
export const temperatureTitle = 'Température'
// eslint-disable-next-line jsdoc/require-jsdoc
export const consumptionTitle = 'Consommation'
// eslint-disable-next-line jsdoc/require-jsdoc
export const externalTemperaturTitle = 'Température Extérieure'
// eslint-disable-next-line jsdoc/require-jsdoc
export const internalTemperaturTitle = 'Température Intérieure'
// eslint-disable-next-line jsdoc/require-jsdoc
// eslint-disable-next-line jsdoc/require-jsdoc
export const enphaseProductionTitle = 'Production Enphase'
// eslint-disable-next-line jsdoc/require-jsdoc
export const enphaseConsumptionTitle = 'Consommation Enphase'
// eslint-disable-next-line jsdoc/require-jsdoc
export const enedisConsumptionTitle = 'Consommation Enedis'
// eslint-disable-next-line jsdoc/require-jsdoc
const targetNameOptions = (
    theme: Theme,
    formatMessage: formatMessageType,
    chartType: string,
    period: periodValue,
): {
    // eslint-disable-next-line jsdoc/require-jsdoc
    [key in metricTarget]: ApexYAxis & { seriesOptions: ApexAxisChartSeries[0]; markerSize: number }
} => ({
    nrlink_consumption_metrics: {
        seriesOptions: {
            name: formatMessage({
                id: 'Consommation',
                defaultMessage: 'Consommation',
            }),
            color: theme.palette.primary.light,
            data: [],
            type: chartType,
        },
        markerSize: 0,
        axisBorder: {
            show: true,
        },
        axisTicks: {
            show: true,
        },
        opposite: false,
        labels: {
            // eslint-disable-next-line jsdoc/require-jsdoc
            formatter: (value: number) => `${value} Kwh`,
        },
    },
    enedis_consumption_metrics: {
        seriesOptions: {
            name: formatMessage({
                id: enedisConsumptionTitle,
                defaultMessage: enedisConsumptionTitle,
            }),
            data: [],
            type: 'line',
        },
        markerSize: period === 1 ? 0 : 2,
        axisBorder: {
            show: true,
        },
        axisTicks: {
            show: true,
        },
        opposite: true,
        labels: {
            // eslint-disable-next-line jsdoc/require-jsdoc
            formatter: defaultYAxisLabelsFormatter,
        },
    },
    enphase_consumption_metrics: {
        seriesOptions: {
            name: formatMessage({
                id: enphaseConsumptionTitle,
                defaultMessage: enphaseConsumptionTitle,
            }),
            data: [],
            type: 'line',
        },
        markerSize: period === 1 ? 0 : 2,
        axisBorder: {
            show: true,
        },
        opposite: true,
        labels: {
            // eslint-disable-next-line jsdoc/require-jsdoc
            formatter: defaultYAxisLabelsFormatter,
        },
        axisTicks: {
            show: true,
        },
    },
    enphase_production_metrics: {
        seriesOptions: {
            name: formatMessage({
                id: enphaseProductionTitle,
                defaultMessage: enphaseProductionTitle,
            }),
            data: [],
            type: 'line',
        },
        markerSize: period === 1 ? 0 : 2,
        axisBorder: {
            show: true,
        },
        axisTicks: {
            show: true,
        },
        opposite: true,
        labels: {
            // eslint-disable-next-line jsdoc/require-jsdoc
            formatter: defaultYAxisLabelsFormatter,
        },
    },
    external_temperature_metrics: {
        seriesOptions: {
            name: formatMessage({
                id: externalTemperaturTitle,
                defaultMessage: externalTemperaturTitle,
            }),
            data: [],
            color: theme.palette.secondary.main,
            type: 'line',
        },
        markerSize: period === 1 ? 0 : 2,
        axisTicks: {
            show: true,
        },
        seriesName: formatMessage({
            id: internalTemperaturTitle,
            defaultMessage: internalTemperaturTitle,
        }),
        axisBorder: {
            show: true,
        },
        opposite: true,
        labels: {
            // eslint-disable-next-line jsdoc/require-jsdoc
            formatter: (value: number) => `${value} °C`,
        },
    },
    nrlink_internal_temperature_metrics: {
        seriesOptions: {
            name: formatMessage({
                id: internalTemperaturTitle,
                defaultMessage: internalTemperaturTitle,
            }),
            color: '#BA1B1B',
            data: [],
            type: 'line',
        },
        markerSize: period === 1 ? 0 : 2,
        seriesName: formatMessage({
            id: externalTemperaturTitle,
            defaultMessage: externalTemperaturTitle,
        }),
        axisTicks: {
            show: true,
        },
        axisBorder: {
            show: true,
        },
        crosshairs: {
            show: true,
        },
        forceNiceScale: true,
        opposite: true,
        labels: {
            // eslint-disable-next-line jsdoc/require-jsdoc
            formatter: (value: number) => `${value} °C`,
        },
    },
    enedis_max_power: {
        seriesOptions: {
            name: 'Pmax',
            color: '#BA1B1B',
            data: [],
            type: 'line',
        },
        markerSize: 1,
    },
})

/**
 * Convert dataPoints array that has the format [Yaxis, Xaxis][] where Yaxis and Xaxis are numbers, to Object {data, categories} for more controllable apexChart format which is {x: date, y: number}[].
 *
 * @param dataPoints Array of datapoints in format [Yaxis, Xaxis][].
 * @returns Object {data, categories}, data is in format number[] supported by apexCharts series data, categories in format string[] for options.xaxis.categories, to have a more flexible, beautiful chart.
 */
const getApexSerieDataFromDatapoint = (
    dataPoints: IMetrics[0]['datapoints'],
): // eslint-disable-next-line jsdoc/require-jsdoc
{ data: ApexAxisChartSeries[0]['data']; categories: number[] } => {
    let categories: number[] = []

    const data = dataPoints.map((dataPoint) => {
        categories.push(dataPoint[1])
        return dataPoint[0]
    })
    return { data, categories }
}

/**
 * Get date dayjs format for xxaxis and tooltip label according to the current period selected.
 *
 * @param period Current Period.
 * @param isTooltipLabel Indicate if it's tooltipXAxis label.
 * @returns Format of xAxis or tooltip labels according to the current period.
 */
const getXAxisLabelFormatFromPeriod = (period: periodValue, isTooltipLabel?: boolean) => {
    switch (period) {
        case 1:
            return 'HH:mm'
        case 7:
            return isTooltipLabel ? 'dddd' : 'ddd'
        case 365:
            return isTooltipLabel ? 'MMMM' : 'MMM'
        default:
            return isTooltipLabel ? 'ddd DD MMM' : 'D MMM'
    }
}

/**
 * Pure Function to convertMetrics Data to ApexCharts Props.
 *
 * @param params N/A.
 * @param params.data Data of format IMetrics that will be converted to IMetrics.
 * @param params.chartType Type of the main chart which represents nrlink_consumption_metrics.
 * @param params.formatMessage Format Message for translation of yAxis titles and names.
 * @param params.theme Current Theme applied.
 * @param params.period Period value of the current chart.
 * @param params.isMobile Boolean indicating if it's mobile mode or not.
 * @returns ApexCharts Props.
 */
export const convertMetricsDataToApexChartsProps = ({
    data,
    chartType,
    formatMessage,
    theme,
    period,
    isMobile,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    data: IMetrics
    // eslint-disable-next-line jsdoc/require-jsdoc
    chartType: string
    // eslint-disable-next-line jsdoc/require-jsdoc
    formatMessage: formatMessageType
    // eslint-disable-next-line jsdoc/require-jsdoc
    theme: Theme
    // eslint-disable-next-line jsdoc/require-jsdoc
    period: periodValue
    // eslint-disable-next-line jsdoc/require-jsdoc
    isMobile?: boolean
    // eslint-disable-next-line jsdoc/require-jsdoc
}) => {
    let options: Props['options'] = defaultApexChartOptions(theme)!
    let series: ApexAxisChartSeries = []
    let yAxis: ApexYAxis[] = []
    // We'll handle the case where we have same YAxis for multiple charts, for example: (external and internal temperature) we should have only one YAxis displaying values for 2 charts.
    const apexYAxisSeriesNames: string[] = []
    const markerSizeList: number[] = []
    // eslint-disable-next-line jsdoc/require-jsdoc
    let categoriesList: number[] = []

    data.forEach((metric: IMetrics[0]) => {
        // eslint-disable-next-line jsdoc/require-jsdoc
        let apexChartSerieData: { data: ApexAxisChartSeries[0]['data']; categories: number[] } = {
            data: [],
            categories: [],
        }
        if (metric.datapoints.length > 0) apexChartSerieData = getApexSerieDataFromDatapoint(metric.datapoints)
        const { seriesOptions, markerSize, ...yAxisOptions } = targetNameOptions(
            theme,
            formatMessage,
            chartType,
            period,
        )[metric.target]
        if (yAxisOptions.seriesName && apexYAxisSeriesNames.includes(yAxisOptions.seriesName!)) {
            yAxisOptions.show = false
            yAxisOptions.floating = true
        }
        apexYAxisSeriesNames.push(seriesOptions.name!)

        series!.push({
            ...seriesOptions,
            data: apexChartSerieData.data,
        })
        yAxis.push(yAxisOptions)
        markerSizeList.push(markerSize)
        categoriesList = apexChartSerieData.categories
    })

    options.xaxis = {
        ...options.xaxis,
        categories: categoriesList,
        labels: {
            format: 'HH:mm',
            /**
             * Formatter function for showing label in the xAxis.
             *
             * @param value Number.
             * @param timestamp Represent the value in the categories.
             * @returns Label that's going to be shown in the xaxis.
             */
            formatter(value, timestamp) {
                return dayjsUTC(new Date(value!)).format(getXAxisLabelFormatFromPeriod(period))
            },
        },
    }
    if (period !== 1) {
        options.xaxis.type = 'category'
        options.tooltip = {
            x: {
                /**
                 * Formatter function for showing label in the tooltip.
                 *
                 * @param index Represent the index in the options.xaxis.categories.
                 * @returns Label concerning the xaxis that's going to be shown in the tooltip.
                 */
                formatter: (index: number) => {
                    return dayjsUTC(new Date(options!.xaxis!.categories![index - 1])).format(
                        getXAxisLabelFormatFromPeriod(period, true),
                    )
                },
            },
        }
    }
    options.markers = {
        ...options.markers,
        size: markerSizeList,
    }

    options.yaxis = yAxis

    return { series, options }
}
