import { IMetrics, metricTarget } from 'src/modules/Metrics/Metrics'
import { formatMessageType } from 'src/common/react-platform-translation'
import { Props } from 'react-apexcharts'
import fr from 'apexcharts/dist/locales/fr.json'
import { Theme } from '@mui/material/styles/createTheme'
import dayjs from 'dayjs'
import { periodValue } from 'src/modules/MyConsumption/myConsumptionTypes'

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
            padding: {
                right: 8,
                left: 8,
            },
            show: true,
            strokeDashArray: 4,
            position: 'back',
            borderColor: theme.palette.primary.contrastText,
            xaxis: {
                lines: {
                    show: true,
                },
            },
            yaxis: {
                lines: {
                    offsetX: 0,
                    offsetY: 0,
                    show: false,
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
        markers: {
            colors: [theme.palette.primary.light],
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
export const externalTemperaturTitle = `${temperatureTitle} Extérieure`
// eslint-disable-next-line jsdoc/require-jsdoc
export const internalTemperaturTitle = `${temperatureTitle} Intérieure`
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
): {
    // eslint-disable-next-line jsdoc/require-jsdoc
    [key in metricTarget]: ApexYAxis & { seriesOptions: ApexAxisChartSeries[0] }
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
        title: {
            text: formatMessage({
                id: 'Consommation',
                defaultMessage: 'Consommation',
            }),
        },
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
        title: {
            text: formatMessage({
                id: enedisConsumptionTitle,
                defaultMessage: enedisConsumptionTitle,
            }),
        },
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
        title: {
            text: formatMessage({
                id: enphaseConsumptionTitle,
                defaultMessage: enphaseConsumptionTitle,
            }),
        },
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
        title: {
            text: formatMessage({
                id: enphaseProductionTitle,
                defaultMessage: enphaseProductionTitle,
            }),
        },
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
            color: '#0000FF',
            type: 'line',
        },
        title: {
            text: formatMessage({
                id: temperatureTitle,
                defaultMessage: temperatureTitle,
            }),
        },
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
            color: '#FF0000',
            data: [],
            type: 'line',
        },
        title: {
            text: formatMessage({
                id: temperatureTitle,
                defaultMessage: temperatureTitle,
            }),
        },
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
        opposite: true,
        labels: {
            // eslint-disable-next-line jsdoc/require-jsdoc
            formatter: (value: number) => `${value} °C`,
        },
    },
})

/**
 * Convert dataPoints array that has the format [Yaxis, Xaxis][] where Yaxis and Xaxis are numbers, to more readable apexChart format which is {x: date, y: number}[].
 *
 * @param dataPoints Array of datapoints in format [Yaxis, Xaxis][].
 * @returns Array of data in format {x: Xaxis, y: Yaxis}[] supported by apexCharts series data.
 */
const getApexSerieDataFromDatapoint = (
    dataPoints: IMetrics[0]['datapoints'],
): // eslint-disable-next-line jsdoc/require-jsdoc
ApexAxisChartSeries[0]['data'] => {
    return dataPoints.map((dataPoint) => ({
        x: new Date(dataPoint[1]),
        y: dataPoint[0],
    }))
}

/**
 * Get date (apexcharts or dayjs) format for xaxis labels according to the current period selected, by default it follows the apexcharts format.
 * ApexCharts format: https://apexcharts.com/docs/datetime/ .
 *
 * @param period Current Period.
 * @param dayjsFormat Indicate if the desired format follows dayjs format.
 * @returns Format of xAxis labels according to the current format.
 */
const getXAxisLabelFormatFromPeriod = (period: periodValue, dayjsFormat?: boolean) => {
    switch (period) {
        case 1:
            return 'HH:mm'
        case 7:
            return dayjsFormat ? 'dddd D MMM' : 'ddd'
        case 365:
            return 'MMMM'
        default:
            return dayjsFormat ? 'DD MMMM' : 'dd MMM'
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
    // eslint-disable-next-line
}) => {
    let options: Props['options'] = defaultApexChartOptions(theme)!
    let series: ApexAxisChartSeries = []
    let yAxis: ApexYAxis[] = []
    // We'll handle the case where we have same YAxis for multiple charts, for example: (external and internal temperature) we should have only one YAxis displaying values for 2 charts.
    const apexYAxisTitles: string[] = []

    data.forEach((metric: IMetrics[0]) => {
        // eslint-disable-next-line jsdoc/require-jsdoc
        let apexChartSerieData: ApexAxisChartSeries[0]['data'] = []
        if (metric.datapoints.length > 0) apexChartSerieData = getApexSerieDataFromDatapoint(metric.datapoints)

        const { seriesOptions, ...yAxisOptions } = targetNameOptions(theme, formatMessage, chartType)[metric.target]
        if (apexYAxisTitles.includes(yAxisOptions.title!.text!!)) {
            yAxisOptions.show = false
        } else {
            apexYAxisTitles.push(yAxisOptions.title!.text!)
        }

        series!.push({
            ...seriesOptions,
            data: apexChartSerieData,
        })
        yAxis.push(yAxisOptions)
    })

    options.xaxis = {
        ...options.xaxis,
        labels: {
            format: getXAxisLabelFormatFromPeriod(period),
        },
    }
    options.yaxis = yAxis
    options.tooltip = {
        x: {
            // eslint-disable-next-line jsdoc/require-jsdoc
            formatter: (timestamp, opts) =>
                dayjs(new Date(timestamp)!).format(getXAxisLabelFormatFromPeriod(period, true)),
        },
    }

    return { series, options }
}
