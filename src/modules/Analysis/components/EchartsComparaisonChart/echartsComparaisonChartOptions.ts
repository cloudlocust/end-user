import { metricTargetsEnum, IMetric } from 'src/modules/Metrics/Metrics.d'
import { EChartsOption } from 'echarts'
import { round } from 'lodash'
import dayjs from 'dayjs'
import { Theme } from '@mui/material/styles/createTheme'
import utc from 'dayjs/plugin/utc'
import { EnphaseOffConsumptionChartTargets } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import timezone from 'dayjs/plugin/timezone'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'
import {
    comparaisonTargetYAxisIndexEnum,
    CustomTargetsForComparaisonEnum,
    metricTargetExtendedWithComparaisonType,
    targetValuesFormatForComparaison,
} from './EchartsComparaisonChartTypes.d'
dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * Get Echarts Comparaison CHart Options.
 *
 * @param data Raw data.
 * @param theme Theme used for colors, fonts and backgrounds purposes.
 * @returns Echarts Comparaison Option.
 */
export const getEchartsComparaisonChartOptions = (data: IMetric[], theme: Theme) => {
    let values = getValuesWithTargetForComparaison(data)

    return {
        ...getDefaultOptionsEchartsComparaisonChart(theme),
        ...getXAxisOptionEchartsComparaisonChart(),
        ...getYAxisOptionEchartsComparaisonChart(theme),
        ...getSeriesOptionEchartsComparaisonChart(values, theme),
    } as EChartsOption
}

/**
 * This function returns an object with target: number[], with the comparaison data, and the ADEME value.
 * We do this because ADEME is not a target from backend but a data used in the front with a fixed value.
 *
 * @param data Data IMetric[].
 * @returns Formated data to be used.
 */
export const getValuesWithTargetForComparaison = (data: IMetric[]) => {
    return {
        [data[0].target]: [data[0].datapoints[0][0]],
        [CustomTargetsForComparaisonEnum.averageAdemeConsumption]: [round(4792 / 12) * 1000],
    }
}

/**
 * Echarts ComparaisonChart Default option.
 *
 * @param theme Theme used for colors, fonts and backgrounds.
 * @returns Default EchartsComparaisonChart option.
 */
const getDefaultOptionsEchartsComparaisonChart = (theme: Theme) =>
    ({
        color: 'transparent',
        textStyle: {
            fontFamily: theme.typography.fontFamily,
        },
        tooltip: {},
        legend: {
            show: true,
            top: 0,
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
 * Get Xaxis option of Echarts Comparaison Option.
 *
 * @param values Datapoint values from the echarts metrics conversion function.
 * @param theme Theme used for colors, fonts and backgrounds of xAxis.
 * @returns XAxis object option for Echarts Comparaison Options.
 */
export const getSeriesOptionEchartsComparaisonChart = (values: targetValuesFormatForComparaison, theme: Theme) => {
    return {
        series: Object.keys(values).map((target) => {
            const colorTargetSeries = getColorTargetSeriesEchartsComparaisonChart(
                target as metricTargetExtendedWithComparaisonType,
                theme,
            )
            return {
                type: 'bar',
                emphasis: {
                    focus: 'series',
                },
                name: `${getNameTargetSeriesEchartsComparaisonChart(
                    target as metricTargetExtendedWithComparaisonType,
                )}`,
                data: values[target as metricTargetExtendedWithComparaisonType],
                stack: getStackTargetSeriesEchartsComparaisonChart(target as metricTargetExtendedWithComparaisonType),
                tooltip: {
                    valueFormatter: consumptionUnitFormatter,
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
 * Get Xaxis option of Echarts Comparaison Option.
 *
 * @returns XAxis object option for Echarts Comparaison Options.
 */
export const getXAxisOptionEchartsComparaisonChart = () =>
    ({
        xAxis: [
            {
                type: 'category',
                // AxisLine represents the horizontal line that shows xAxis labels.
                axisLine: {
                    show: true,
                    onZero: true,
                },
                axisLabel: {
                    hideOverlap: true,
                    show: false,
                },
                axisTick: {
                    alignWithLabel: false,
                },
            },
        ],
    } as EChartsOption)

/**
 * Function that returns the color for each target series of EchartsComparaisonChart.
 *
 * @param target MetricTarget Chart.
 * @param theme Current MUI Theme Applied.
 * @returns Color of the given target series in EchartsComparaisonChart.
 */
export const getColorTargetSeriesEchartsComparaisonChart = (
    target: metricTargetExtendedWithComparaisonType,
    theme: Theme,
) => {
    if (target === metricTargetsEnum.consumption) {
        return theme.palette.secondary.main
    } else {
        return theme.palette.secondary.light
    }
}

/**
 * Function that returns the name which represents the label for each target series of EchartsComparaisonChart (shown in tooltip and legend).
 *
 * @param target MetricTarget Chart.
 * @returns Label of the given target series in EchartsComparaisonChart.
 */
export const getNameTargetSeriesEchartsComparaisonChart = (target: metricTargetExtendedWithComparaisonType) => {
    if (target === metricTargetsEnum.consumption) {
        return 'Ma consommation'
    }
    if (target === CustomTargetsForComparaisonEnum.averageAdemeConsumption) {
        return 'Consommation moyenne ADEME'
    }

    throw Error(`Can't find the label for target ${target}`)
}

/**
 * Function that returns the TargetYAxisIndex from target, indicating this target to which YAxis Line its values are represented.
 *
 * @param target MetricTarget Chart.
 * @returns YAxisIndex of target.
 */
export const getTargetYAxisIndexFromTargetName = (
    target: metricTargetExtendedWithComparaisonType,
): comparaisonTargetYAxisIndexEnum => {
    if (
        target === metricTargetsEnum.consumption ||
        target === CustomTargetsForComparaisonEnum.averageAdemeConsumption
    ) {
        return comparaisonTargetYAxisIndexEnum.COMPARAISON
    } else {
        throw Error(`Can't find the label for target ${target}`)
    }
}

/**
 * Function that indicates which stack group of target series (meaning they'll have the same yAxis) the given target series belongs for EchartsProductionChart.
 *
 * @description The targets series with the same stack name are shown together.
 * -> Here their is only one stack groups, you can see the example in echartsConsumptionChartOptions.ts to see multiple stacks example.
 * -> takes as param (target, theme).
 * @param target MetricTarget Chart.
 * @returns Stack group name of the given target series in EchartsComparaisonChart.
 */
export const getStackTargetSeriesEchartsComparaisonChart = (target: metricTargetExtendedWithComparaisonType) => {
    if (EnphaseOffConsumptionChartTargets.includes(target)) return 'stackConsumptionTargetsSeries'
    else return 'stackADEMETargetsSeries'
}

/**
 * Get YAxis option of Echarts Comparaison Option.
 *
 * @param theme Theme used for colors, fonts and backgrounds of xAxis.
 * @returns YAxis object option for Echarts Comparaison Options.
 */
export const getYAxisOptionEchartsComparaisonChart = (theme: Theme) => {
    return {
        yAxis: {
            type: 'value',
            axisLine: {
                onZero: true,
                show: true,
                lineStyle: {
                    color: theme.palette.common.black,
                    type: 'solid',
                    opacity: 1,
                },
            },
            // label position
            position: 'left',
            splitLine: {
                show: true,
                lineStyle: {
                    color: theme.palette.common.black,
                    type: 'dashed',
                    opacity: 0.3,
                },
            },
            axisLabel: {
                formatter: consumptionUnitFormatter,
            },
        },
    } as EChartsOption
}

/**
 * ConsumptionUnitFormatter.
 *
 * @param value Value to convert.
 * @returns Formated value.
 */
const consumptionUnitFormatter = (value: number) => {
    let convertedValue = consumptionWattUnitConversion(value)
    return `${convertedValue.value} ${convertedValue.unit}`
}
