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
            stacked: true,
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
                    show: true,
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
const targetNameOptions = (
    theme: Theme,
    // eslint-disable-next-line jsdoc/require-jsdoc
): {
    // eslint-disable-next-line jsdoc/require-jsdoc
    [key in metricTarget]: { label: string; type?: string; color?: string; formatter: (value: number) => string }
} => ({
    nrlink_consumption_metrics: {
        label: 'Consommation',
        color: theme.palette.primary.light,
        // eslint-disable-next-line jsdoc/require-jsdoc
        formatter: (value: number) => `${value} Kwh`,
    },
    enedis_consumption_metrics: {
        label: 'Consommation',
        type: 'line',
        formatter: defaultYAxisLabelsFormatter,
    },
    enphase_consumption_metrics: {
        label: 'Consommation Enphase',
        type: 'line',
        formatter: defaultYAxisLabelsFormatter,
    },
    enphase_production_metrics: {
        label: 'Production Enphase',
        type: 'line',
        formatter: defaultYAxisLabelsFormatter,
    },
    external_temperature_metrics: {
        label: 'Température Extérieure',
        type: 'line',
        formatter: defaultYAxisLabelsFormatter,
    },
    nrlink_internal_temperature_metrics: {
        label: 'Température Intérieure',
        type: 'line',
        formatter: defaultYAxisLabelsFormatter,
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

    data.forEach((metric: IMetrics[0]) => {
        // eslint-disable-next-line jsdoc/require-jsdoc
        let apexChartSerieData: ApexAxisChartSeries[0]['data'] = []
        if (metric.datapoints.length > 0) apexChartSerieData = getApexSerieDataFromDatapoint(metric.datapoints)

        series!.push({
            data: apexChartSerieData,
            name: formatMessage({
                id: targetNameOptions(theme)[metric.target].label,
                defaultMessage: targetNameOptions(theme)[metric.target].label,
            }),
            color: targetNameOptions(theme)[metric.target].color || undefined,
            type: targetNameOptions(theme)[metric.target].type || chartType,
        })
        yAxis.push({
            // TODO uncomment when having multiple yAxis curves.
            // title: {
            //     text: formatMessage({
            //         id: targetNameOptions(theme)[metric.target].label,
            //         defaultMessage: targetNameOptions(theme)[metric.target].label,
            //     }),
            // },
            opposite: !!targetNameOptions(theme)[metric.target].type,
            axisBorder: {
                show: true,
            },
            labels: {
                // eslint-disable-next-line jsdoc/require-jsdoc
                formatter: targetNameOptions(theme)[metric.target].formatter,
            },
        })
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
