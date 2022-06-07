import { IMetrics, metricTarget } from 'src/modules/Metrics/Metrics'
import { formatMessageType } from 'src/common/react-platform-translation'
import { Props } from 'react-apexcharts'
import fr from 'apexcharts/dist/locales/fr.json'
import { Theme } from '@mui/material/styles/createTheme'
// eslint-disable-next-line jsdoc/require-jsdoc
export const defaultApexChartOptions = (theme: Theme): Props['options'] => ({
    chart: {
        fontFamily: theme.typography.fontFamily,
        stacked: true,
        locales: [fr],
        defaultLocale: 'fr',
        background: theme.palette.primary.main,
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
    markers: {
        size: 3,
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
        strokeDashArray: 3,
        position: 'back',
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
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
    },
    xaxis: {
        type: 'datetime',
        tooltip: {
            enabled: false,
        },
        axisBorder: {
            show: true,
        },
    },
    stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        width: 1.5,
        dashArray: 0,
    },
})

// eslint-disable-next-line jsdoc/require-jsdoc
const targetNameOptions = (
    theme: Theme,
    // eslint-disable-next-line jsdoc/require-jsdoc
): { [key in metricTarget]: { label: string; type?: string; color?: string } } => ({
    nrlink_consumption_metrics: {
        label: 'Consommation Nrlink',
        color: theme.palette.primary.light,
    },
    enedis_consumption_metrics: {
        label: 'Consommation Enedis',
        type: 'line',
    },
    enphase_consumption_metrics: {
        label: 'Consommation Enphase',
        type: 'line',
    },
    enphase_production_metrics: {
        label: 'Production Enphase',
        type: 'line',
    },
    external_temperature_metrics: {
        label: 'Température Extérieure',
        type: 'line',
    },
    nrlink_internal_temperature_metrics: {
        label: 'Température Intérieure',
        type: 'line',
    },
})

// Typing the return to [number, number][], because it is the type of ApexChart series data (otherwise we'll have typing error with number[][]).
/**
 * Convert dataPoints array that has the format [Yaxis, Xaxis][] where Yaxis and Xaxis are numbers, to apexChart format which is [Xaxis, Yaxis][].
 *
 * @param dataPoints Array of datapoints in format [Yaxis, Xaxis][].
 * @returns Array of data in format [Xaxis, Yaxis][] supported by apexCharts series data.
 */
const getApexSerieDataFromDatapoint = (dataPoints: IMetrics[0]['datapoints']): [number, number][] => {
    // dataPoints are represented with [Y, X] values and in apexCharts it takes series values as [X,Y].
    return dataPoints.map((dataPoint) => [dataPoint[1], dataPoint[0]])
}

/**
 * Pure Function to convertMetrics Data to ApexCharts Props.
 *
 * @param data Data of format IMetrics that will be converted to IMetrics.
 * @param chartType Type of the main chart which represents nrlink_consumption_metrics.
 * @param formatMessage Format Message for translation of yAxis titles and names.
 * @param theme Current Theme applied.
 * @returns ApexCharts Props.
 */
export const convertMetricsDataToApexChartsProps = (
    data: IMetrics,
    chartType: string,
    formatMessage: formatMessageType,
    theme: Theme,
) => {
    let options: Props['options'] = defaultApexChartOptions(theme)!
    let series: ApexAxisChartSeries = []
    let yAxis: ApexYAxis[] = []

    data.forEach((metric: IMetrics[0]) => {
        let apexChartSerieData: [number, number][] = []
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
            title: {
                text: formatMessage({
                    id: targetNameOptions(theme)[metric.target].label,
                    defaultMessage: targetNameOptions(theme)[metric.target].label,
                }),
            },
            opposite: !!targetNameOptions(theme)[metric.target].type,
            axisBorder: {
                show: true,
                offsetX: 0,
                offsetY: 0,
            },
        })
    })
    options.yaxis = yAxis
    return { series, options }
}
