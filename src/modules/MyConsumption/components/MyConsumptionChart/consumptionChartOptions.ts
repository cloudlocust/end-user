import { metricTargetType, metricTargetsEnum, targetTimestampsValuesFormat } from 'src/modules/Metrics/Metrics.d'
import { EChartsOption } from 'echarts'
import dayjs from 'dayjs'
import fr from 'dayjs/locale/fr'
import { Theme } from '@mui/material/styles/createTheme'
import utc from 'dayjs/plugin/utc'
import convert from 'convert-units'
import { capitalize, isNil } from 'lodash'
import { TRANSPARENT_COLOR, getYPointValueLabel } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { convertConsumptionToWatt } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { PeriodEnum, periodType } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import timezone from 'dayjs/plugin/timezone'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'
import {
    targetYAxisIndexEnum,
    getTargetsYAxisValueFormattersType,
} from 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChartTypes.d'
dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * Get Echarts Consumption CHart Options.
 *
 * @param timestamps Timestamps.
 * @param values Values datapoints.
 * @param theme Theme used for colors, fonts and backgrounds purposes.
 * @param isSolarProductionConsentOff Boolean indicating if solar production consent is off.
 * @param isMobile Is Mobile view.
 * @returns Echarts Consumption Option.
 */
export const getEchartsConsumptionChartOptions = (
    timestamps: targetTimestampsValuesFormat,
    values: targetTimestampsValuesFormat,
    theme: Theme,
    isSolarProductionConsentOff: boolean,
    isMobile: boolean,
) => {
    if (!Object.values(timestamps).length || !Object.values(values).length) return {}
    const xAxisTimestamps = Object.values(timestamps).length ? Object.values(timestamps)[0] : []
    const period = getPeriodFromTimestampsLength(xAxisTimestamps.length)

    return {
        ...getDefaultOptionsEchartsConsumptionChart(theme, isMobile),
        ...getXAxisOptionEchartsConsumptionChart(xAxisTimestamps, isSolarProductionConsentOff, period, theme),
        ...getYAxisOptionEchartsConsumptionChart(values, period, theme),
        ...getSeriesOptionEchartsConsumptionChart(values, period, isSolarProductionConsentOff, theme),
    } as EChartsOption
}

/**
 * Echarts ConsumptionChart Default option.
 *
 * @param theme Theme used for colors, fonts and backgrounds.
 * @param isMobile Is Mobile view.
 * @returns Default EchartsConsumptionChart option.
 */
const getDefaultOptionsEchartsConsumptionChart = (theme: Theme, isMobile: boolean) =>
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
    // Targets functions yAxis Value formatter type (label shown in tooltip).
    const targetsYAxisValueFormatters = getTargetsYAxisValueFormatters(values, period)

    const resultSeries = Object.keys(values).map((target) => {
        const targetYAxisIndex = getTargetYAxisIndexFromTargetName(target as metricTargetsEnum)
        const colorTargetSeries = getColorTargetSeriesEchartsConsumptionChart(
            target as metricTargetsEnum,
            theme,
            isSolarProductionConsentOff,
        )
        // When the series is Transparent we hide it through type 'line' and symbole none, so that it won't interject with the already bar and line charts additional to its own stack name.
        const typeTargetSeries: EChartsOption['series'] =
            colorTargetSeries === TRANSPARENT_COLOR
                ? {
                      type: 'line',
                      symbol: 'none',
                  }
                : getTypeTargetSeriesEchartsConsumptionChart(target as metricTargetsEnum, period)
        return {
            ...typeTargetSeries,
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
            yAxisIndex: Number(targetYAxisIndex),
            tooltip: {
                valueFormatter: targetsYAxisValueFormatters[targetYAxisIndex as targetYAxisIndexEnum],
            },
            showSymbol: false,
            smooth: true,
            itemStyle: {
                color: colorTargetSeries,
            },
        }
    })

    // this part is just to put in the bottom of the stack the idleConsumption (tried zlevel does not work)
    let sortedSeries = resultSeries

    // veille only for the week, month, and year
    // will switch graph for idle consumption for euros and watts
    if (period !== 'daily') {
        const index = resultSeries.findIndex(
            (serie) =>
                serie.name ===
                    getNameTargetSeriesEchartsConsumptionChart(
                        metricTargetsEnum.idleConsumption,
                        isSolarProductionConsentOff,
                    ) ||
                serie.name ===
                    getNameTargetSeriesEchartsConsumptionChart(
                        metricTargetsEnum.eurosIdleConsumption,
                        isSolarProductionConsentOff,
                    ) ||
                serie.name ===
                    getNameTargetSeriesEchartsConsumptionChart(
                        metricTargetsEnum.subscriptionPrices,
                        isSolarProductionConsentOff,
                    ),
        )

        // if no index then veille is not activated and we are not showing it in the first place
        if (index !== -1) {
            const IdleSerie = sortedSeries.splice(index, 1)[0]
            sortedSeries.unshift(IdleSerie)
        }
    }

    return {
        series: sortedSeries,
    } as EChartsOption
}

/**
 * Get Xaxis option of Echarts Consumption Option.
 *
 * @param xAxisTimestamps Timestamps array.
 * @param isSolarProductionConsentOff IsSolarProductionConsentOff.
 * @param period Current period.
 * @param theme Theme used for colors, fonts and backgrounds of xAxis.
 * @returns XAxis object option for Echarts Consumption Options.
 */
export const getXAxisOptionEchartsConsumptionChart = (
    xAxisTimestamps: number[],
    isSolarProductionConsentOff: boolean,
    period: periodType,
    theme: Theme,
) =>
    ({
        xAxis: [
            {
                // Rotate to 40 so that we can show all the hours.
                type: 'category',
                data: getXAxisCategoriesData(xAxisTimestamps, period),
                axisLabel: {
                    interval: getXAxisLabelInterval(isSolarProductionConsentOff, period),
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
 * Function that give the index of the time in timestamps that we will get the interval from.
 * For exemple : ['00:30', '01:00', '01:30', '02:00'], if we put the index 1, it will show every 2 timestamps in the axis line.
 *
 * @param isSolarProductionConsentOff Is production on, to know if data is every minute or 30min.
 * @param period Period to know if it's daily or not.
 * @returns Value of the index that will be the reference for the times.
 */
const getXAxisLabelInterval = (isSolarProductionConsentOff: boolean, period: periodType) => {
    if (period === 'daily') {
        return isSolarProductionConsentOff ? 59 : 1
    }
}

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
        case metricTargetsEnum.totalEurosIdleConsumption:
        case metricTargetsEnum.totalIdleConsumption:
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
        case metricTargetsEnum.totalIdleConsumption:
            return totalConsumptionSeriesLabel
        case metricTargetsEnum.consumption:
            return isSolarProductionConsentOff ? totalConsumptionSeriesLabel : 'Electricité achetée sur le réseau'
        case metricTargetsEnum.baseConsumption:
            return isSolarProductionConsentOff ? 'Consommation de base' : 'Electricité achetée sur le réseau'
        case metricTargetsEnum.autoconsumption:
            return 'Autoconsommation'
        case metricTargetsEnum.eurosConsumption:
        case metricTargetsEnum.totalEurosIdleConsumption:
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
        case metricTargetsEnum.totalEurosOffIdleConsumption:
            return 'Consommation euro Hors-veille'
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
 * Function that returns the TargetYAxisIndex from target, indicating this target to which YAxis Line its values are represented.
 *
 * @param target MetricTarget Chart.
 * @returns YAxisIndex of target.
 */
export const getTargetYAxisIndexFromTargetName = (target: metricTargetsEnum): targetYAxisIndexEnum => {
    switch (target) {
        case metricTargetsEnum.onlyConsumption:
        case metricTargetsEnum.consumption:
        case metricTargetsEnum.baseConsumption:
        case metricTargetsEnum.autoconsumption:
        case metricTargetsEnum.idleConsumption:
        case metricTargetsEnum.totalOffIdleConsumption:
        case metricTargetsEnum.totalIdleConsumption:
        case metricTargetsEnum.peakHourConsumption:
        case metricTargetsEnum.offPeakHourConsumption:
            return targetYAxisIndexEnum.CONSUMPTION
        case metricTargetsEnum.eurosConsumption:
        case metricTargetsEnum.onlyEuroConsumption:
        case metricTargetsEnum.baseEuroConsumption:
        case metricTargetsEnum.subscriptionPrices:
        case metricTargetsEnum.euroPeakHourConsumption:
        case metricTargetsEnum.totalEurosIdleConsumption:
        case metricTargetsEnum.totalEurosOffIdleConsumption:
        case metricTargetsEnum.eurosIdleConsumption:
        case metricTargetsEnum.euroOffPeakConsumption:
            return targetYAxisIndexEnum.EUROS
        case metricTargetsEnum.externalTemperature:
        case metricTargetsEnum.internalTemperature:
            return targetYAxisIndexEnum.TEMPERATURE
        case metricTargetsEnum.pMax:
            return targetYAxisIndexEnum.PMAX
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
    const stackHiddenTargetsSeries = 'stackHiddenTargetsSeries'
    const stackConsumptionTargetsSeries = 'stackConsumptionTargetsSeries'
    if (target === metricTargetsEnum.pMax) return 'stackPmaxTargetSeries'
    if (target === metricTargetsEnum.internalTemperature) return 'stackInternalTemperatureTargetSeries'
    if (target === metricTargetsEnum.externalTemperature) return 'stackExternalTemperatureTargetSeries'
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
) => {
    // Not showing the yAxis that don't have their targets in the values.
    // For example if euros_consumption target is not in values and there's no euro targets, then yAxis of euros will have show: false.
    const YAxisShowList: targetYAxisIndexEnum[] = []
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
            show: YAxisShowList.includes(targetYAxisIndex as targetYAxisIndexEnum),
            position: [targetYAxisIndexEnum.PMAX, targetYAxisIndexEnum.TEMPERATURE].includes(
                targetYAxisIndex as targetYAxisIndexEnum,
            )
                ? 'right'
                : 'left',
            splitLine: {
                show: true,
                lineStyle: {
                    color: theme.palette.primary.contrastText,
                    type: 'dashed',
                    opacity: [targetYAxisIndexEnum.PMAX, targetYAxisIndexEnum.TEMPERATURE].includes(
                        targetYAxisIndex as targetYAxisIndexEnum,
                    )
                        ? 0
                        : 0.4,
                },
            },
            axisLabel: {
                formatter: targetsYAxisValueFormatters[targetYAxisIndex as targetYAxisIndexEnum],
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
    // We compute the consumption chart maximum y value, so that we can indicate the correct unit on the Consumption yAxis tooltip and axisLine according to the unit of the maximum value
    // Because there's a conversion function used to format consumption y values which gives different units to the maximum and other lower values.
    // Doing this allow us to show the yValues with the same unit., also for optimization we do it one time here.
    let maxConsumptionValue = 0
    let metricsInterval: '1m' | '30m' = '30m'
    if (Object.keys(values).includes(metricTargetsEnum.consumption))
        if (period === PeriodEnum.DAILY) {
            // Computing the metricsInterval is used in period DAILY to convert consumption to WATT according to the metricsInterval.
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
    return {
        /**
         * Value formatter Label for Consumption targets yAxis.
         *
         * @param value Value yAxis.
         * @returns The yAxis Label.
         */
        [targetYAxisIndexEnum.CONSUMPTION]: ConsumptionValueFormatter(
            period,
            maxConsumptionValue,
            metricsInterval,
            isYAxisValueFormatter,
        ),
        /**
         * Value formatter Label for Temperature targets yAxis.
         *
         * @param value Value yAxis.
         * @returns The yAxis Label.
         */
        [targetYAxisIndexEnum.TEMPERATURE]: function (value) {
            return `${isNil(value) ? '-' : value} °C`
        },
        /**
         * Value formatter Label Label for Pmax targets yAxis.
         *
         * @param value Value yAxis.
         * @returns The yAxis Label.
         */
        [targetYAxisIndexEnum.PMAX]: function (value) {
            return `${isNil(value) ? '-' : convert(Number(value)).from('VA').to('kVA'!).toFixed(2)} kVA`

            // return `${k convert(value).from('VA').to('kVA'!).toFixed(2)} kVA`
        },
        /**
         * Value formatter Label Label for EUROS targets yAxis.
         *
         * @param value Value yAxis.
         * @returns The yAxis Label.
         */
        [targetYAxisIndexEnum.EUROS]:
            /**
             * Label of the yAxis in the power charts.
             *
             * @param value Value yAxis.
             * @returns The yAxis Label.
             */
            function (value) {
                return `${isNil(value) ? '-' : Number(value).toFixed(3).slice(0, -1)} €`
            },
    }
}

/**
 * Function that returns values formatter functions (which is the label shown whether in tooltip or yAxisLine).
 *
 * @param period Current period.
 * @param maxConsumptionValue Consumption chart maximum y value.
 * @param metricsInterval Computing the metricsInterval is used in period DAILY to convert consumption to WATT according to the metricsInterval.
 * @param isYAxisValueFormatter Indicate if it's value formatter for yAxisLine so that we round the value and handle duplicates.
 * @returns Value function value formatters for Consumption YAxis.
 */
const ConsumptionValueFormatter = (
    period: periodType,
    maxConsumptionValue: number,
    metricsInterval: '1m' | '30m',
    isYAxisValueFormatter?: boolean,
) => {
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
            newValue = convertConsumptionToWatt(value, Boolean(isYAxisValueFormatter), metricsInterval)
        } else {
            // Rounding the value when it's value formatter of yAxisLine.
            newValue = getYPointValueLabel(
                value,
                metricTargetsEnum.consumption,
                consumptionWattUnitConversion(maxConsumptionValue).unit,
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
