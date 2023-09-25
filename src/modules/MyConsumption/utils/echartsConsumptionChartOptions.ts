import { metricTargetType, metricTargetsEnum, targetTimestampsValuesFormat } from 'src/modules/Metrics/Metrics.d'
import { EChartsOption, SeriesOption } from 'echarts'
import dayjs from 'dayjs'
import fr from 'dayjs/locale/fr'
import { Theme } from '@mui/material/styles/createTheme'
import utc from 'dayjs/plugin/utc'
import convert from 'convert-units'
import { isNull, mean, capitalize } from 'lodash'
import { getChartColor } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { getChartSpecifities } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { PeriodEnum, periodType } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import timezone from 'dayjs/plugin/timezone'
dayjs.locale(fr)
dayjs.extend(utc)
dayjs.extend(timezone)

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
    return {
        ...getDefaultOptionsEchartsConsumptionChart(theme),
        ...getXAxisOptionEchartsConsumptionChart(timestamps, theme),
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

/**
 * Echarts ConsumptionChart Default option.
 */
const getDefaultOptionsEchartsConsumptionChart = (theme: Theme) =>
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
                    interval(index, value) {
                        console.log('🚀 ~ file: echartsConsumptionChartOptions.ts:149 ~ interval ~ value:', value)
                        console.log('🚀 ~ file: echartsConsumptionChartOptions.ts:149 ~ interval ~ index:', index)
                        return 0
                    },
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
 * Get Xaxis option of Echarts Consumption Option.
 *
 * @param timestamps Timestamps.
 * @param theme Theme used for colors, fonts and backgrounds of xAxis.
 * @returns XAxis object option for Echarts Consumption Options.
 */
export const getXAxisOptionEchartsConsumptionChart = (timestamps: targetTimestampsValuesFormat, theme: Theme) => {
    const xAxisTimestamps = Object.values(timestamps).length ? Object.values(timestamps)[0] : []
    const period = getPeriodFromTimestampsLength(xAxisTimestamps.length)
    return {
        xAxis: [
            {
                // Rotate to 40 so that we can show all the hours.
                type: 'category',
                boundaryGap: false,
                data: getXAxisData(xAxisTimestamps, period),
                axisLabel: {
                    rotate: period === PeriodEnum.DAILY ? 30 : undefined,
                    hideOverlap: true,
                    /**
                     * Formatting the labels shown in xAxis.
                     *
                     * @param value Value of xAxis date point.
                     * @param index Index of point.
                     * @returns Label of date point in the xAxis.
                     */
                    formatter(value: string, index: number) {
                        // When Period is Daily, show only each first hour of the day.
                        // if (period === PeriodEnum.DAILY) {
                        // console.log('🚀 ~ file: echartsConsumptionChartOptions.ts:190 ~ formatter ~ value:', value)
                        // return value.endsWith('00') ? value : ''
                        // }
                        return value
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
    } as EChartsOption
}

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
 * Get XAxis points Data.
 *
 * @description
 * Format the timestamps points data to a date format based on the current periodType.
 * @example
 * @param timestamps Timestamps data points.
 * @param period Current period.
 * @returns XAxis points data.
 */
const getXAxisData = (timestamps: number[], period: periodType) => {
    switch (period) {
        case 'daily':
            return timestamps.map((timestamp) => capitalize(dayjs.utc(timestamp).format('HH:mm')))
        case 'yearly':
            return timestamps.map((timestamp) => capitalize(dayjs.utc(timestamp).format('MMM')))
        default:
            return timestamps.map((timestamp) => capitalize(dayjs.utc(timestamp).format('D MMM')))
    }
}
