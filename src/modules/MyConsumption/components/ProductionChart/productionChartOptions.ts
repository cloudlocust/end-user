import { metricTargetType, metricTargetsEnum, targetTimestampsValuesFormat } from 'src/modules/Metrics/Metrics.d'
import { EChartsOption } from 'echarts'
import dayjs from 'dayjs'
import fr from 'dayjs/locale/fr'
import { Theme } from '@mui/material/styles/createTheme'
import utc from 'dayjs/plugin/utc'
import { capitalize } from 'lodash'
import { TRANSPARENT_COLOR, getYPointValueLabel } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { convertConsumptionToWatt } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { PeriodEnum, periodType } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import timezone from 'dayjs/plugin/timezone'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'
import {
    productionTargetYAxisIndexEnum,
    getTargetsYAxisValueFormattersType,
} from 'src/modules/MyConsumption/components/ProductionChart/ProductionChartTypes.d'
dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * Get Echarts Production CHart Options.
 *
 * @param timestamps Timestamps.
 * @param values Values datapoints.
 * @param theme Theme used for colors, fonts and backgrounds purposes.
 * @param isMobile Is Mobile view.
 * @returns Echarts Production Option.
 */
export const getEchartsProductionChartOptions = (
    timestamps: targetTimestampsValuesFormat,
    values: targetTimestampsValuesFormat,
    theme: Theme,
    isMobile: boolean,
) => {
    if (!Object.values(timestamps).length || !Object.values(values).length) return {}
    const xAxisTimestamps = Object.values(timestamps).length ? Object.values(timestamps)[0] : []
    const period = getPeriodFromTimestampsLength(xAxisTimestamps.length)

    return {
        ...getDefaultOptionsEchartsProductionChart(theme, isMobile),
        ...getXAxisOptionEchartsProductionChart(xAxisTimestamps, period, theme),
        ...getYAxisOptionEchartsProductionChart(values, period, theme),
        ...getSeriesOptionEchartsProductionChart(values, period, theme),
    } as EChartsOption
}

/**
 * Echarts ProductionChart Default option.
 *
 * @param theme Theme used for colors, fonts and backgrounds.
 * @param isMobile Is mobile view.
 * @returns Default EchartsProductionChart option.
 */
const getDefaultOptionsEchartsProductionChart = (theme: Theme, isMobile: boolean) =>
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
            show: !isMobile,
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
 * Get Xaxis option of Echarts Production Option.
 *
 * @param values Datapoint values from the echarts metrics conversion function.
 * @param period Current period.
 * @param theme Theme used for colors, fonts and backgrounds of xAxis.
 * @returns XAxis object option for Echarts Production Options.
 */
export const getSeriesOptionEchartsProductionChart = (
    values: targetTimestampsValuesFormat,
    period: periodType,
    theme: Theme,
) => {
    // Targets functions yAxis Value formatter type (label shown in tooltip).
    const targetsYAxisValueFormatters = getTargetsYAxisValueFormatters(values, period)

    return {
        series: Object.keys(values).map((target) => {
            const targetYAxisIndex = getTargetYAxisIndexFromTargetName(target as metricTargetsEnum)
            const colorTargetSeries = getColorTargetSeriesEchartsProductionChart(
                target as metricTargetsEnum,
                theme,
                values,
            )
            // When the series is Transparent we hide it through type 'line' and symbole none, so that it won't interject with the already bar and line charts additional to its own stack name.
            const typeTargetSeries: EChartsOption['series'] =
                colorTargetSeries === TRANSPARENT_COLOR
                    ? {
                          type: 'line',
                          symbol: 'none',
                      }
                    : getTypeTargetSeriesEchartsProductionChart(target as metricTargetsEnum, period)
            return {
                ...typeTargetSeries,
                emphasis: {
                    focus: 'series',
                },
                name: `${getNameTargetSeriesEchartsProductionChart(target as metricTargetsEnum)}`,
                data: values[target as metricTargetType],
                stack: getStackTargetSeriesEchartsProductionChart(),
                yAxisIndex: Number(targetYAxisIndex),
                tooltip: {
                    valueFormatter: targetsYAxisValueFormatters[targetYAxisIndex as productionTargetYAxisIndexEnum],
                },
                showSymbol: false,
                smooth: true,
                itemStyle: {
                    color: colorTargetSeries,
                },
            }
        }),
    } as EChartsOption
}

/**
 * Get Xaxis option of Echarts Production Option.
 *
 * @param xAxisTimestamps Timestamps array.
 * @param period Current period.
 * @param theme Theme used for colors, fonts and backgrounds of xAxis.
 * @returns XAxis object option for Echarts Production Options.
 */
export const getXAxisOptionEchartsProductionChart = (xAxisTimestamps: number[], period: periodType, theme: Theme) =>
    ({
        xAxis: [
            {
                // Rotate to 40 so that we can show all the hours.
                type: 'category',
                data: getXAxisCategoriesData(xAxisTimestamps, period),
                axisLabel: {
                    interval: period === 'yearly' || period === 'weekly' ? 0 : 1,
                    hideOverlap: true,
                    rotate: 30,
                    /**
                     * Formatting the labels shown in xAxis, which are the already formatted categories data according to the period.
                     *
                     * @param value Value of xAxis date point.
                     * @returns Label of date point in the xAxis.
                     */
                    formatter(value: string) {
                        if (period === PeriodEnum.MONTHLY || period === PeriodEnum.WEEKLY)
                            // When period is weekly or Monthly, we remove the weekday from the value category.
                            return capitalize(value.split(' ').splice(1).join(' '))
                        return value
                    },
                },
                // AxisLine represents the horizontal line that shows xAxis labels.
                axisLine: {
                    show: true,
                    // Important to put onZero so that bar charts don't overflow with yAxis.
                    onZero: true,
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
    } as EChartsOption)

/**
 * Get Period From timestamps length.
 *
 * @param length Length of timestamps.
 * @returns Get the periodType from the length of timestamps.
 */
export const getPeriodFromTimestampsLength = (length: number): periodType => {
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
            return timestamps.map((timestamp) => capitalize(dayjs.utc(timestamp).locale(fr).format('HH:mm')))
        case 'yearly':
            return timestamps.map((timestamp) => capitalize(dayjs.utc(timestamp).locale(fr).format('MMM')))
        default:
            return timestamps.map((timestamp) => capitalize(dayjs.utc(timestamp).locale(fr).format('ddd D MMM')))
    }
}

/**
 * Function that returns the color for each target series of EchartsProductionChart.
 *
 * @param target MetricTarget Chart.
 * @param theme Current MUI Theme Applied.
 * @param values Data values to be able to know if we show production or not.
 * @returns Color of the given target series in EchartsProductionChart.
 */
export const getColorTargetSeriesEchartsProductionChart = (
    target: metricTargetsEnum,
    theme: Theme,
    values: targetTimestampsValuesFormat,
) => {
    // by default we show the production (it's not transparent)
    let isTotalProductionTransparent = false

    // map target values, and see if we find data in autoconsmption or injected
    // if so then we don't show the total production
    Object.entries(values).map(([target, targetValues]) => {
        // !isTotalProductionTransparent is to know if we already found data in one of the two metrics
        // if so then we already know that we don't show the total and made it to transparent, no need to continue
        if (
            !isTotalProductionTransparent &&
            (target === metricTargetsEnum.injectedProduction || target === metricTargetsEnum.autoconsumption)
        ) {
            isTotalProductionTransparent = targetValues.some((value) => value !== null)
        }
        // just for eslint does not scream at us
        return undefined
    })

    switch (target) {
        case metricTargetsEnum.autoconsumption:
            return '#BEECDB'
        case metricTargetsEnum.totalProduction:
            return isTotalProductionTransparent ? TRANSPARENT_COLOR : '#C8D210'
        case metricTargetsEnum.injectedProduction:
            return '#6E9A8B'
        default:
            return theme.palette.secondary.main
    }
}

/**
 * Function that returns the name which represents the label for each target series of EchartsProductionChart (shown in tooltip and legend).
 *
 * @param target MetricTarget Chart.
 * @returns Label of the given target series in EchartsProductionChart.
 */
export const getNameTargetSeriesEchartsProductionChart = (target: metricTargetsEnum) => {
    switch (target) {
        case metricTargetsEnum.totalProduction:
            return 'Production totale'
        case metricTargetsEnum.injectedProduction:
            return 'Electricité redistribuée sur le réseau'
        case metricTargetsEnum.autoconsumption:
            return 'Autoconsommation'
        default:
            throw Error(`Can't find the label for target ${target}`)
    }
}

/**
 * Function that returns the TargetYAxisIndex from target, indicating this target to which YAxis Line its values are represented.
 *
 * @param target MetricTarget Chart.
 * @returns YAxisIndex of target.
 */
export const getTargetYAxisIndexFromTargetName = (target: metricTargetsEnum): productionTargetYAxisIndexEnum => {
    switch (target) {
        case metricTargetsEnum.totalProduction:
        case metricTargetsEnum.injectedProduction:
        case metricTargetsEnum.autoconsumption:
            return productionTargetYAxisIndexEnum.PRODUCTION
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
 * getTypeTargetSeriesEchartsProductionChart(metricTargetsEnum.consumption, PeriodEnum.DAILY)
 * => will give the following {
 *      type: 'line',
 *      areaStyle: {},
 * } This indicates that the series of metricTargetsEnum.consumption will be an area.
 * @param target MetricTarget Chart.
 * @param period Current period.
 * @returns Type of the given target series in EchartsProductionChart.
 */
export const getTypeTargetSeriesEchartsProductionChart = (
    target: metricTargetsEnum,
    period: periodType,
): EChartsOption['series'] => {
    switch (target) {
        case metricTargetsEnum.autoconsumption:
        case metricTargetsEnum.injectedProduction:
        case metricTargetsEnum.totalProduction:
            return period === PeriodEnum.DAILY
                ? {
                      type: 'line',
                      areaStyle: {},
                  }
                : {
                      type: 'bar',
                  }
        default:
            return {
                type: 'bar',
            }
    }
}

/**
 * Function that indicates which stack group of target series (meaning they'll have the same yAxis) the given target series belongs for EchartsProductionChart.
 *
 * @description The targets series with the same stack name are shown together.
 * -> Here their is only one stack groups, you can see the example in echartsConsumptionChartOptions.ts to see multiple stacks example.
 * -> takes as param (target, theme).
 * @returns Stack group name of the given target series in EchartsProductionChart.
 */
export const getStackTargetSeriesEchartsProductionChart = () => {
    return 'stackProductionTargetsSeries'
}

/**
 * Get YAxis option of Echarts Production Option.
 *
 * @param values Datapoint values from the echarts metrics conversion function.
 * @param period Current period.
 * @param theme Theme used for colors, fonts and backgrounds of xAxis.
 * @returns YAxis object option for Echarts Production Options.
 */
export const getYAxisOptionEchartsProductionChart = (
    values: targetTimestampsValuesFormat,
    period: periodType,
    theme: Theme,
) => {
    // Not showing the yAxis that don't have their targets in the values
    // For know we don't need it in production, but we keep the same architecture as consumption may be for later
    const YAxisShowList: productionTargetYAxisIndexEnum[] = []
    Object.keys(values).forEach((target) => {
        const targetYAxisIndex = getTargetYAxisIndexFromTargetName(target as metricTargetsEnum)
        if (!YAxisShowList.includes(targetYAxisIndex)) YAxisShowList.push(targetYAxisIndex)
    })
    // Targets functions yAxis Value formatter type (label shown in yAxisLine).
    const targetsYAxisValueFormatters = getTargetsYAxisValueFormatters(values, period, true)

    return {
        yAxis: Object.keys(targetsYAxisValueFormatters).map((targetYAxisIndex) => ({
            type: 'value',
            axisLine: {
                onZero: true,
                show: true,
                lineStyle: {
                    color: theme.palette.primary.contrastText,
                    type: 'solid',
                    opacity: 1,
                },
            },
            show: YAxisShowList.includes(targetYAxisIndex as productionTargetYAxisIndexEnum),
            // label position
            position: 'left',
            splitLine: {
                // TODO Remove once reponsive of daily period.
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
            axisLabel: {
                formatter: targetsYAxisValueFormatters[targetYAxisIndex as productionTargetYAxisIndexEnum],
            },
        })),
    } as EChartsOption
}

/**
 * Function that returns values formatter functions (which is the label shown whether in tooltip or yAxisLine).
 *
 * @param values Datapoint values from the echarts metrics conversion function.
 * @param period Current period.
 * @param isYAxisValueFormatter Indicate if it's value formatter for yAxisLine so that we round the value and handle duplicates.
 * @returns Value formatters to group yAxisLine and tooltip labels.
 */
// TODO Remove disable cognitive-complexity
export const getTargetsYAxisValueFormatters: getTargetsYAxisValueFormattersType = (
    values,
    period,
    isYAxisValueFormatter,
    // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
    // max Production value, is to convert Wh to Kwh or Mwh in week and month period in tooltip (since values are too big)
    // Note : we don't use metricsInterval like we did in the consumptionChart because Production uses only 30m interval
    let maxProductionValue = 0
    maxProductionValue = Math.max(
        maxProductionValue,
        ...Object.keys(values).reduce((cumulatedValues: number[], target) => {
            const targetValues = values[target as metricTargetsEnum]
            if (targetValues) return cumulatedValues.concat(targetValues as number[])
            return cumulatedValues
        }, []),
    )
    return {
        /**
         * Value formatter Label for Production targets yAxis.
         *
         * @param value Value yAxis.
         * @returns The yAxis Label.
         */
        [productionTargetYAxisIndexEnum.PRODUCTION]: ProductionValueFormatter(
            period,
            maxProductionValue,
            isYAxisValueFormatter,
        ),
    }
}

/**
 * Function that returns values formatter functions (which is the label shown whether in tooltip or yAxisLine).
 *
 * @param period Current period.
 * @param maxProductionValue Production chart maximum y value.
 * @param isYAxisValueFormatter Indicate if it's value formatter for yAxisLine so that we round the value and handle duplicates.
 * @returns Value function value formatters for Consumption YAxis.
 */
const ProductionValueFormatter = (period: periodType, maxProductionValue: number, isYAxisValueFormatter?: boolean) => {
    // Removing duplicates from yAxisLine because when rounding values it creates duplicates.
    // Inspired by Reference: https://github.com/apache/echarts/issues/9896#issuecomment-463113642
    // https://jsfiddle.net/ovilia/k1bsuteo/6/
    const yAxisLineVisibleValuesList: string[] = []
    // This variables helps to detect when it's the final process to remove duplicated values from yAxisLine when, because yAxisLine calls valuesFormat have two processes for the values and it's the final and second process that it handles the draw of values
    let isYAxisLineFinalValueFormatProcess = false
    let tempYAxisValue = '0'
    return function (value: undefined | number) {
        let newValue: string = ''
        if (period === PeriodEnum.DAILY) {
            // Rounding the value when it's value formatter of yAxisLine.
            newValue = convertConsumptionToWatt(value, Boolean(isYAxisValueFormatter), '30m')
        } else {
            // Rounding the value when it's value formatter of yAxisLine.
            newValue = getYPointValueLabel(
                value,
                metricTargetsEnum.consumption,
                consumptionWattUnitConversion(maxProductionValue).unit,
                Boolean(isYAxisValueFormatter),
            )
        }
        if (isYAxisValueFormatter) {
            // When it's the final valueFormat Process it's time to handle the duplicated values.
            // To know if we are on the second final process we need to have gone through the first process by tempYAxisValue which indicates that it's not 0, and we go back again to 0 indicated by newValue.
            if (parseInt(newValue) !== 0) tempYAxisValue = newValue
            if (parseInt(tempYAxisValue) !== 0 && parseInt(newValue) === 0 && !isYAxisLineFinalValueFormatProcess)
                isYAxisLineFinalValueFormatProcess = true
            if (isYAxisLineFinalValueFormatProcess) {
                if (yAxisLineVisibleValuesList.includes(newValue)) return null
                yAxisLineVisibleValuesList.push(newValue)
            }
        }
        return newValue
    }
}
