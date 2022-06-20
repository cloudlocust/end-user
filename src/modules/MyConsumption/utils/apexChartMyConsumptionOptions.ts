import { formatMessageType } from 'src/common/react-platform-translation'
import { Theme } from '@mui/material/styles/createTheme'
import { Props } from 'react-apexcharts'
import { periodValueType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { dayjsUTC } from 'src/common/react-platform-components'
import fr from 'apexcharts/dist/locales/fr.json'
import { metricTargetType } from 'src/modules/Metrics/Metrics'

// eslint-disable-next-line jsdoc/require-jsdoc
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
        width: 1.5,
        dashArray: 0,
    },
})

/**
 * Get date dayjs format for xxaxis and tooltip label according to the current period selected.
 *
 * @param period Current Period.
 * @param isTooltipLabel Indicate if it's tooltipXAxis label.
 * @returns Format of xAxis or tooltip labels according to the current period.
 */
const getXAxisLabelFormatFromPeriod = (period: periodValueType, isTooltipLabel?: boolean) => {
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

// eslint-disable-next-line jsdoc/require-jsdoc
export const consumptionTitle = 'Consommation'
// eslint-disable-next-line jsdoc/require-jsdoc
const getMetricTargetYAxisOptions = (
    target: metricTargetType,
    theme: Theme,
    formatMessage: formatMessageType,
    chartType: string,
): // eslint-disable-next-line jsdoc/require-jsdoc
ApexYAxis & { color: string; name: string; type: string; markerSize: number } => {
    return {
        name: formatMessage({
            id: consumptionTitle,
            defaultMessage: consumptionTitle,
        }),
        color: theme.palette.primary.light,
        type: chartType,
        markerSize: 0,
        opposite: false,
        labels: {
            // eslint-disable-next-line jsdoc/require-jsdoc
            formatter: (value: number) => `${value} Kwh`,
        },
    }
}

// eslint-disable-next-line jsdoc/require-jsdoc
export const getApexChartMyConsumptionOptions = ({
    series,
    categories,
    theme,
    period,
    formatMessage,
    chartType,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    series: ApexAxisChartSeries
    // eslint-disable-next-line jsdoc/require-jsdoc
    categories: number[]
    // eslint-disable-next-line jsdoc/require-jsdoc
    theme: Theme
    // eslint-disable-next-line jsdoc/require-jsdoc
    period: periodValueType
    // eslint-disable-next-line jsdoc/require-jsdoc
    formatMessage: formatMessageType
    // eslint-disable-next-line jsdoc/require-jsdoc
    chartType: string
}) => {
    let options: Props['options'] = defaultApexChartOptions(theme)!
    let myConsumptionApexChartSeries: ApexAxisChartSeries = []
    let yAxis: ApexYAxis[] = []
    const markerSizeList: number[] = []
    series.forEach((serie) => {
        if (serie.data.length === 0) return
        // eslint-disable-next-line jsdoc/require-jsdoc
        const { color, name, type, markerSize, ...restYAxisOptions } = getMetricTargetYAxisOptions(
            serie.name as metricTargetType,
            theme,
            formatMessage,
            chartType,
        )

        myConsumptionApexChartSeries!.push({
            ...serie,
            color,
            name,
            type,
        })
        yAxis.push({
            opposite: false,
            ...restYAxisOptions,
            axisBorder: {
                show: true,
            },
            axisTicks: {
                show: true,
            },
        })
        markerSizeList.push(markerSize)
    })

    options.xaxis = {
        ...options.xaxis,
        categories,
        labels: {
            format: 'HH:mm',
            /**
             * Formatter function for showing label in the xAxis.
             *
             * @param value Number.
             * @returns Label that's going to be shown in the xaxis.
             */
            formatter(value) {
                return dayjsUTC(new Date(value)).format(getXAxisLabelFormatFromPeriod(period))
            },
        },
    }

    if (period !== 'daily') {
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
                    return dayjsUTC(new Date(options!.xaxis!.categories[index - 1])).format(
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
    return { series: myConsumptionApexChartSeries, options }
}
