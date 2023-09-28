import {
    metricIntervalType,
    metricTargetType,
    metricTargetsEnum,
    targetTimestampsValuesFormat,
} from 'src/modules/Metrics/Metrics.d'
import { EChartsOption, SeriesOption } from 'echarts'
import dayjs from 'dayjs'
import fr from 'dayjs/locale/fr'
import { Theme } from '@mui/material/styles/createTheme'
import utc from 'dayjs/plugin/utc'
import convert from 'convert-units'
import { isNull, mean, capitalize } from 'lodash'
import {
    TRANSPARENT_COLOR,
    getChartColor,
    getYPointValueLabel,
    temperatureOrPmaxTargets,
} from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { convertConsumptionToWatt, getChartSpecifities } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { PeriodEnum, periodType } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import timezone from 'dayjs/plugin/timezone'
import { consumptionWattUnitConversion } from './unitConversionFunction'
dayjs.locale(fr)
dayjs.extend(utc)
dayjs.extend(timezone)

const MaxChartName = 'Max'

/**
 * Get Echarts Consumption CHart Options.
 *
 * @param timestamps Timestamps.
 * @param values Values datapoints.
 * @param theme Theme used for colors, fonts and backgrounds purposes.
 * @param isSolarProductionConsentOff Boolean indicating if solar production consent is off.
 * @returns Echarts Consumption Option.
 */
export const getEchartsConsumptionChartOptions = (
    timestamps: targetTimestampsValuesFormat,
    values: targetTimestampsValuesFormat,
    theme: Theme,
    isSolarProductionConsentOff: boolean,
) => {
    if (!Object.values(timestamps).length || !Object.values(values).length) return {}
    const xAxisTimestamps = Object.values(timestamps).length ? Object.values(timestamps)[0] : []
    const period = getPeriodFromTimestampsLength(xAxisTimestamps.length)

    return {
        ...getDefaultOptionsEchartsConsumptionChart(theme),
        ...getXAxisOptionEchartsConsumptionChart(xAxisTimestamps, period, theme),
        ...getYAxisOptionEchartsConsumptionChart(values, period, theme),
        ...getSeriesOptionEchartsConsumptionChart(values, period, isSolarProductionConsentOff, theme),
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
            // Confine set to true helps for responsive, to avoid overflowing and hiding part of the tooltip on mobile.
            confine: true,
            trigger: 'axis',
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
        // Putting % on the left & bottom & right helps to give space to make visible all the labels on xAxis & yAxis.
        grid: {
            left: '5%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
    } as EChartsOption)

/**
 * Get Xaxis option of Echarts Consumption Option.
 *
 * @param values Datapoint values from the echarts metrics conversion function.
 * @param period Current period.
 * @param isSolarProductionConsentOff Boolean indicating if solar production consent is off.
 * @param theme Theme used for colors, fonts and backgrounds of xAxis.
 * @returns XAxis object option for Echarts Consumption Options.
 */
export const getSeriesOptionEchartsConsumptionChart = (
    values: targetTimestampsValuesFormat,
    period: periodType,
    isSolarProductionConsentOff: boolean,
    theme: Theme,
) => {
    return {
        series: Object.keys(values).map((target) => {
            return {
                ...getTypeTargetSeriesEchartsConsumptionChart(target as metricTargetsEnum, period),
                emphasis: {
                    focus: 'series',
                },
                name: `${getNameTargetSeriesEchartsConsumptionChart(
                    target as metricTargetsEnum,
                    isSolarProductionConsentOff,
                )}`,
                data: values[target as metricTargetType],
                stack: getStackTargetSeriesEchartsConsumptionChart(
                    target as metricTargetsEnum,
                    theme,
                    isSolarProductionConsentOff,
                ),
                itemStyle: {
                    color: getColorTargetSeriesEchartsConsumptionChart(
                        target as metricTargetsEnum,
                        theme,
                        isSolarProductionConsentOff,
                    ),
                },
            }
        }),
    } as EChartsOption
}

/**
 * Get Xaxis option of Echarts Consumption Option.
 *
 * @param xAxisTimestamps Timestamps array.
 * @param period Current period.
 * @param theme Theme used for colors, fonts and backgrounds of xAxis.
 * @returns XAxis object option for Echarts Consumption Options.
 */
export const getXAxisOptionEchartsConsumptionChart = (xAxisTimestamps: number[], period: periodType, theme: Theme) => {
    return {
        xAxis: [
            {
                // Rotate to 40 so that we can show all the hours.
                type: 'category',
                boundaryGap: false,
                data: getXAxisCategoriesData(xAxisTimestamps, period),
                axisLabel: {
                    // rotate: period === PeriodEnum.DAILY ? 30 : undefined,
                    hideOverlap: true,
                    /**
                     * Formatting the labels shown in xAxis.
                     *
                     * @param value Value of xAxis date point.
                     * @param index Index of point.
                     * @returns Label of date point in the xAxis.
                     */
                    // formatter(value: string, index: number) {
                    // When Period is Daily, show only each first hour of the day.
                    // if (period === PeriodEnum.DAILY) {
                    // console.log('🚀 ~ file: echartsConsumptionChartOptions.ts:190 ~ formatter ~ value:', value)
                    // return value.endsWith('00') ? value : ''
                    // }
                    // return value
                    // },
                },
                // AxisLine represents the horizontal line that shows xAxis labels.
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: theme.palette.primary.contrastText,
                        type: 'solid',
                        opacity: 1,
                    },
                },
                axisTick: {
                    alignWithLabel: true,
                },
                // SplitLine represents each vertical line in the grid that show an xAxisLabel value.
                // show set to true makes visible the vertical grid lines.
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
 * Get XAxis categories Data.
 *
 * @description
 * Format the timestamps points data to a date format based on the current periodType.
 * @example
 * @param timestamps Timestamps data points.
 * @param period Current period.
 * @returns XAxis categories data.
 */
const getXAxisCategoriesData = (timestamps: number[], period: periodType) => {
    switch (period) {
        case 'daily':
            return timestamps.map((timestamp) => capitalize(dayjs.utc(timestamp).format('HH:mm')))
        case 'yearly':
            return timestamps.map((timestamp) => capitalize(dayjs.utc(timestamp).format('MMM')))
        default:
            return timestamps.map((timestamp) => capitalize(dayjs.utc(timestamp).format('D MMM')))
    }
}

/**
 * Function that returns the color for each target series of EchartsConsumptionChart.
 *
 * @param target MetricTarget Chart.
 * @param theme Current MUI Theme Applied.
 * @param isSolarProductionConsentOff Indicates if solarProduction consent is off.
 * @returns Color of the given target series in EchartsConsumptionChart.
 */
export const getColorTargetSeriesEchartsConsumptionChart = (
    target: metricTargetsEnum,
    theme: Theme,
    isSolarProductionConsentOff?: boolean,
) => {
    switch (target) {
        case metricTargetsEnum.externalTemperature:
            return '#FFC200'
        case metricTargetsEnum.internalTemperature:
            return '#BA1B1B'
        case metricTargetsEnum.pMax:
            return '#FF7A00'
        case metricTargetsEnum.eurosConsumption:
            return TRANSPARENT_COLOR
        case metricTargetsEnum.baseEuroConsumption:
        case metricTargetsEnum.totalEurosOffIdleConsumption:
        case metricTargetsEnum.onlyEuroConsumption:
            return theme.palette.primary.light
        case metricTargetsEnum.autoconsumption:
            return '#BEECDB'
        case metricTargetsEnum.idleConsumption:
        case metricTargetsEnum.eurosIdleConsumption:
            return '#8191B2'
        case metricTargetsEnum.totalProduction:
            return '#C8D210'
        case metricTargetsEnum.injectedProduction:
            return '#6E9A8B'
        case metricTargetsEnum.subscriptionPrices:
            return '#CCDCDD'
        case metricTargetsEnum.peakHourConsumption:
            return '#CC9121'
        case metricTargetsEnum.offPeakHourConsumption:
            return '#CCAB1D'
        case metricTargetsEnum.totalOffIdleConsumption:
            return theme.palette.secondary.main
        case metricTargetsEnum.consumption:
            return isSolarProductionConsentOff ? TRANSPARENT_COLOR : theme.palette.secondary.main
        case metricTargetsEnum.euroPeakHourConsumption:
            return '#4DD9E4'
        case metricTargetsEnum.euroOffPeakConsumption:
            return '#006970'
        case metricTargetsEnum.onlyConsumption:
            return theme.palette.secondary.main
        default:
            return theme.palette.secondary.main
    }
}

/**
 * Function that returns the name which represents the label for each target series of EchartsConsumptionChart (shown in tooltip and legend).
 *
 * @param target MetricTarget Chart.
 * @param isSolarProductionConsentOff Indicates if solarProduction consent is off.
 * @returns Label of the given target series in EchartsConsumptionChart.
 */
export const getNameTargetSeriesEchartsConsumptionChart = (
    target: metricTargetsEnum,
    isSolarProductionConsentOff?: boolean,
) => {
    const totalConsumptionSeriesLabel = 'Consommation totale'
    const totalEurosConsumptionSeriesLabel = 'Consommation euro totale'

    switch (target) {
        case metricTargetsEnum.onlyConsumption:
            return totalConsumptionSeriesLabel
        case metricTargetsEnum.consumption:
            return isSolarProductionConsentOff ? totalConsumptionSeriesLabel : 'Electricité achetée sur le réseau'
        case metricTargetsEnum.baseConsumption:
            return isSolarProductionConsentOff ? 'Consommation de base' : 'Electricité achetée sur le réseau'
        case metricTargetsEnum.autoconsumption:
            return 'Autoconsommation'
        case metricTargetsEnum.eurosConsumption:
        case metricTargetsEnum.onlyEuroConsumption:
            return totalEurosConsumptionSeriesLabel
        case metricTargetsEnum.baseEuroConsumption:
            return 'Consommation euro de base'
        case metricTargetsEnum.subscriptionPrices:
            return 'Abonnement'
        case metricTargetsEnum.euroPeakHourConsumption:
            return 'Consommation achetée HP'
        case metricTargetsEnum.euroOffPeakConsumption:
            return 'Consommation achetée HC'
        case metricTargetsEnum.eurosIdleConsumption:
            return 'Consommation euro de veille'
        case metricTargetsEnum.externalTemperature:
            return 'Température Extérieure'
        case metricTargetsEnum.internalTemperature:
            return 'Température Intérieure'
        case metricTargetsEnum.pMax:
            return 'Pmax'
        case metricTargetsEnum.idleConsumption:
            return 'Consommation de veille'
        case metricTargetsEnum.totalOffIdleConsumption:
            return 'Consommation Hors-veille'
        case metricTargetsEnum.peakHourConsumption:
            return 'Consommation en HP'
        case metricTargetsEnum.offPeakHourConsumption:
            return 'Consommation en HC'
        default:
            throw Error(`Can't find the label for target ${target}`)
    }
}

/**
 * Function that returns object relative to the type of given target echarts series.
 *
 * @description The return of the function is an object with two property "type" that can be either 'bar' or 'line'.
 * When "type" is 'line', another property "areaStyle" is needed to indicate if it's an area type.
 * @example
 * getTypeTargetSeriesEchartsConsumptionChart(metricTargetsEnum.consumption, PeriodEnum.DAILY)
 * => will give the following {
 *      type: 'line',
 *      areaStyle: {},
 * } This indicates that the series of metricTargetsEnum.consumption will be an area.
 * @param target MetricTarget Chart.
 * @param period Current period.
 * @returns Type of the given target series in EchartsConsumptionChart.
 */
export const getTypeTargetSeriesEchartsConsumptionChart = (
    target: metricTargetsEnum,
    period: periodType,
): EChartsOption['series'] => {
    switch (target) {
        case metricTargetsEnum.consumption:
        case metricTargetsEnum.onlyConsumption:
        case metricTargetsEnum.baseConsumption:
        case metricTargetsEnum.autoconsumption:
        case metricTargetsEnum.peakHourConsumption:
        case metricTargetsEnum.offPeakHourConsumption:
            return period === PeriodEnum.DAILY
                ? {
                      type: 'line',
                      areaStyle: {},
                  }
                : {
                      type: 'bar',
                  }
        case metricTargetsEnum.externalTemperature:
        case metricTargetsEnum.internalTemperature:
        case metricTargetsEnum.pMax:
            return {
                type: 'line',
            }
        default:
            return {
                type: 'bar',
            }
    }
}

/**
 * Function that indicates which stack group of target series (meaning they'll have the same yAxis) the given target series belongs for EchartsConsumptionChart.
 *
 * @description The targets series with the same stack name are shown together.
 * -> There are three stack groups:
 * 1st case: Targets that are not pMax or Temperature.
 * 2st case: Targets that are pMax or Temperature.
 * 3rd case: Targets that has their series color 'TRANSPARENT', it's a workaround so that they will seem invisible and won't conflicts with the others charts even if they have invisible Color.
 * @param target MetricTarget Chart.
 * @param theme Current MUI Theme Applied.
 * @param isSolarProductionConsentOff Indicates if solarProduction consent is off.
 * @returns Stack group name of the given target series in EchartsConsumptionChart.
 */
export const getStackTargetSeriesEchartsConsumptionChart = (
    target: metricTargetsEnum,
    theme: Theme,
    isSolarProductionConsentOff?: boolean,
) => {
    const targetColor = getColorTargetSeriesEchartsConsumptionChart(target, theme, isSolarProductionConsentOff)
    const stackTemperatureOrPmaxTargetsSeries = 'stackTemperatureOrPmaxTargetsSeries'
    const stackHiddenTargetsSeries = 'stackHiddenTargetsSeries'
    const stackConsumptionTargetsSeries = 'stackConsumptionTargetsSeries'
    if (temperatureOrPmaxTargets.includes(target)) return stackTemperatureOrPmaxTargetsSeries
    if (targetColor === TRANSPARENT_COLOR) return stackHiddenTargetsSeries
    return stackConsumptionTargetsSeries
}

/**
 * Get YAxis option of Echarts Consumption Option.
 *
 * @param values Datapoint values from the echarts metrics conversion function.
 * @param period Current period.
 * @param theme Theme used for colors, fonts and backgrounds of xAxis.
 * @returns YAxis object option for Echarts Consumption Options.
 */
export const getYAxisOptionEchartsConsumptionChart = (
    values: targetTimestampsValuesFormat,
    period: periodType,
    theme: Theme,
    // TODO Remove cognitive complexity.
    // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
    console.log('🚀 ~ file: echartsConsumptionChartOptions.ts:439 ~ values:', values)
    // We compute the consumption chart maximum y value, so that we can indicate the correct unit on the chart, and we do it only one time with this condition.
    // data.length !== 1440 is added because there can be case where period is not daily, and yAxisSerie.data didn't updated and still express data of daily.
    let maxConsumptionValue = 0
    let metricsInterval: '1m' | '30m' = '30m'

    if (Object.keys(values).includes(metricTargetsEnum.consumption))
        if (period === PeriodEnum.DAILY) {
            const valuesLength = Object.values(values).length ? Object.values(values)[0].length : 0
            metricsInterval = valuesLength % 60 === 0 ? '1m' : '30m'
        } else
            maxConsumptionValue = Math.max(
                maxConsumptionValue,
                ...Object.keys(values).reduce((cumulatedValues: number[], target) => {
                    const targetValues = values[target as metricTargetsEnum]
                    if (targetValues) return cumulatedValues.concat(targetValues as number[])
                    return cumulatedValues
                }, []),
            )
    const commonYaxisOptions = {
        type: 'value',
        axisLine: {
            show: true,
            lineStyle: {
                color: theme.palette.primary.contrastText,
                type: 'solid',
                opacity: 1,
            },
        },
        splitLine: {
            // interval(index, value) {
            //     console.log('🚀 ~ file: echartsConsumptionChartOptions.ts:149 ~ interval ~ value:', value)
            //     console.log('🚀 ~ file: echartsConsumptionChartOptions.ts:149 ~ interval ~ index:', index)
            //     return 0
            // },

            show: true,
            lineStyle: {
                color: theme.palette.primary.contrastText,
                type: 'dashed',
                opacity: 0.4,
            },
        },
    }
    return {
        yAxis: [
            // First yAxis represent the yAxis for all consumptions.
            {
                ...commonYaxisOptions,
                axisLabel: {
                    /**
                     * Label of the yAxis in the consumption charts.
                     *
                     * @param value Value yAxis.
                     * @returns The yAxis Label.
                     */
                    formatter(value: number) {
                        console.log('🚀 ~ file: echartsConsumptionChartOptions.ts:496 ~ formatter ~ value:', value)
                        if (period === PeriodEnum.DAILY) {
                            return convertConsumptionToWatt(value, true, metricsInterval)
                        }
                        return getYPointValueLabel(
                            value,
                            metricTargetsEnum.consumption,
                            consumptionWattUnitConversion(maxConsumptionValue).unit,
                            true,
                        )
                    },
                },
            },
            // Second yAxis represent the yAxis for temperature.
            {
                ...commonYaxisOptions,
                axisLabel: {
                    /**
                     * Label of the yAxis in the power charts.
                     *
                     * @param value Value yAxis.
                     * @returns The yAxis Label.
                     */
                    formatter(value: number) {
                        return `${value} °C`
                    },
                },
                position: 'right',
            },
            // Third yAxis represent the yAxis for pMax.
            {
                ...commonYaxisOptions,
                axisLabel: {
                    /**
                     * Label of the yAxis in the power charts.
                     *
                     * @param value Value yAxis.
                     * @returns The yAxis Label.
                     */
                    formatter(value: string) {
                        console.log('🚀 ~ file: echartsConsumptionChartOptions.ts:502 ~ formatter ~ value:', value)
                        // console.log('🚀 ~ file: echartsConsumptionChartOptions.ts:502 ~ formatter ~ value:', value)
                        // Value given by backend is in Va and thus convert it to kVA.
                        return `${value === '' ? value : convert(Number(value)).from('VA').to('kVA'!).toFixed(2)} kVA`

                        // return `${k convert(value).from('VA').to('kVA'!).toFixed(2)} kVA`
                    },
                    position: 'right',
                },
            },
            // Fourth yAxis represent the yAxis for eurosConsumptions.
            {
                ...commonYaxisOptions,
                axisLabel: {
                    /**
                     * Label of the yAxis in the power charts.
                     *
                     * @param value Value yAxis.
                     * @returns The yAxis Label.
                     */
                    formatter(value: string) {
                        console.log('🚀 ~ file: echartsConsumptionChartOptions.ts:502 ~ formatter ~ value:', value)
                        // console.log('🚀 ~ file: echartsConsumptionChartOptions.ts:502 ~ formatter ~ value:', value)
                        // Value given by backend is in Va and thus convert it to kVA.
                        return `${value === '' ? value : Number(value).toFixed(3).slice(0, -1)} €`
                        // return `${k convert(value).from('VA').to('kVA'!).toFixed(2)} kVA`
                    },
                },
            },
        ],
    } as EChartsOption
}
