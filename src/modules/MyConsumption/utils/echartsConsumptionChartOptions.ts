import { metricTargetType, metricTargetsEnum, targetTimestampsValuesFormat } from 'src/modules/Metrics/Metrics.d'
import { EChartsOption, SeriesOption } from 'echarts'
import dayjs from 'dayjs'
import fr from 'dayjs/locale/fr'
import { Theme } from '@mui/material/styles/createTheme'
import utc from 'dayjs/plugin/utc'
import convert from 'convert-units'
import { isNull, mean } from 'lodash'
import { getChartColor } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { getChartSpecifities } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { PeriodEnum, periodType } from 'src/modules/MyConsumption/myConsumptionTypes.d'
dayjs.locale(fr)
dayjs.extend(utc)

/**
 * Get Period From timestamps length.
 *
 * @param length Length of timestamps.
 * @returns Get the periodType from the length of timestamps.
 */
const getPeriodFromTimestampsLength = (length: number): periodType => {
    if (length <= 7) {
        return PeriodEnum.WEEKLY
    } else if (length <= 12) {
        return PeriodEnum.YEARLY
    } else if (length <= 31) {
        return PeriodEnum.MONTHLY
    } else return PeriodEnum.DAILY
}

/**
 * Object mapping the metricTarget with its slice line chart name.
 */
const targetChartNames: { [key in metricTargetType]?: string } = {
    [metricTargetsEnum.idleConsumption]: 'Consommation Totale',
    [metricTargetsEnum.consumption]: 'Consommation Hors-Veille',
    [metricTargetsEnum.peakHourConsumption]: 'Consommation en HP',
    [metricTargetsEnum.baseConsumption]: 'Electricité achetée sur le réseau',
    [metricTargetsEnum.offPeakHourConsumption]: 'Consommation en HC',
    [metricTargetsEnum.totalOffIdleConsumption]: 'Consommation de veille',
}

/**
 * Object mapping the chartName with its chart color.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
const targetChartColors: { [key: string]: string } = {
    [metricTargetsEnum.peakHourConsumption]: '#FAC858',
    [metricTargetsEnum.offPeakHourConsumption]: '#91CC75',
    [metricTargetsEnum.baseConsumption]: '#5470C6',
    [metricTargetsEnum.consumption]: '#EE6666',
    [metricTargetsEnum.totalOffIdleConsumption]: '#FF00FF',
    // Talon: '#91CC75',
    // 'Puissance souscrites': '#5470C6',
    Max: '#EE6666',
}

const MaxChartName = 'Max'
/**
 * Echarts ConsumptionChart Default option.
 */
const getEchartsConsumptionChartDefaultOptions = (theme: Theme) =>
    ({
        color: 'transparent',
        textStyle: {
            fontFamily: theme.typography.fontFamily,
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985',
                },
            },
            /**
             * Tooltip custom value label (it represents the text that's in the bottom side of the tooltip).
             *
             * @param value Value of the slice hovered over.
             * @returns Tooltip custom value label.
             */
            valueFormatter: (value) => `${isNaN(Number(value)) ? '' : Number(value).toFixed(2)} kVA`,
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'all',
                    xAxisIndex: 'all',
                },
            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    /**
                     * Label of the yAxis in the power charts.
                     *
                     * @param value Value yAxis.
                     * @returns The yAxis Label.
                     */
                    formatter(value: number) {
                        return `${value} kVA`
                    },
                },
                axisLine: {
                    show: true,
                    onZero: true,
                    lineStyle: {
                        color: theme.palette.primary.contrastText,
                        type: 'solid',
                        opacity: 1,
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: theme.palette.primary.contrastText,
                        type: 'dashed',
                        opacity: 0.4,
                    },
                },
            },
        ],
    } as EChartsOption)

/**
 * Get Echarts Consumption CHart Options.
 *
 * @param timestamps Timestamps.
 * @param values Values.
 * @param theme Theme used for colors, fonts and backgrounds purposes.
 * @returns Echarts Consumption Option.
 */
export const getEchartsConsumptionChartOptions = (
    timestamps: targetTimestampsValuesFormat,
    values: targetTimestampsValuesFormat,
    theme: Theme,
) => {
    console.log('🚀 ~ file: echartsConsumptionChartOptions.ts:94 ~ values:', values)
    if (!Object.values(timestamps).length || !Object.values(values).length) return {}
    const xAxisTimestamps = Object.values(timestamps).length ? Object.values(timestamps)[0] : []
    const period = getPeriodFromTimestampsLength(xAxisTimestamps.length)
    return {
        ...getEchartsConsumptionChartDefaultOptions(theme),
        xAxis: [
            {
                rotate: 40,
                type: 'category',
                boundaryGap: false,
                data: xAxisTimestamps.map((timestamp) => dayjs(timestamp).format('D MMM')),
                /**
                 * Formatting the labels show in xAxis, show only the first minute of each hour.
                 *
                 * @param value Value of xAxis.
                 * @param index Index of the value in xAxis data.
                 * @returns Label of value in the xAxis.
                 */
                formatter(value: string, index: number) {
                    // If it's the first minute of the hour, show it otherwise hide it.
                    if (index % 6 === 0) return value
                    return ''
                },
                axisLine: {
                    show: true,
                    onZero: true,
                    lineStyle: {
                        color: theme.palette.primary.contrastText,
                        type: 'solid',
                        opacity: 1,
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: theme.palette.primary.contrastText,
                        type: 'dashed',
                        opacity: 0.4,
                    },
                },
            },
        ],
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        series: Object.keys(values).map((target) => {
            const data = values[target as metricTargetType]
            console.log('🚀 ~ file: echartsConsumptionChartOptions.ts:122 ~ series:Object.keys ~ data:', data)
            return {
                type: 'line',
                emphasis: {
                    focus: 'series',
                },
                name: `${getChartSpecifities(target as metricTargetsEnum, 'Consommation totale').label}`,
                data,
                stack: 'stack',
                itemStyle: {
                    color: getChartColor(target as metricTargetsEnum, theme),
                },
            }
        }),
    } as EChartsOption
}
