import { targetTimestampsValuesFormat } from 'src/modules/Metrics/Metrics'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes.d'

/**
 * Enum Indicating the different yAxisIndex, so that each yAxis has its own value formatting.
 */
export enum productionTargetYAxisIndexEnum {
    /**
     * Production yAxis index.
     */
    PRODUCTION = '0',
}

/**
 * Axis Value Formatter.
 */
export type axisValueFormatterType = (value: number | undefined) => string | null

/**
 * Targets functions yAxis Value formatters type (label shown in tooltip and yAxisLine).
 *
 */
export type targetsYAxisValueFormattersType = { [x in productionTargetYAxisIndexEnum]: axisValueFormatterType }

/**
 * Function that returns targets yAxis values formatter functions (which is the label shown whether in tooltip or yAxisLine), for all yAxis targets.
 *
 * @param values Datapoint values from the echarts metrics conversion function.
 * @param period Current period.
 * @param isYAxisValueFormatter Indicate if it's value formatter for yAxisLine so that we round the value and handle duplicates.
 * @returns Value formatters to group yAxisLine and tooltip labels.
 */
export type getTargetsYAxisValueFormattersType = (
    values: targetTimestampsValuesFormat,
    period: periodType,
    isProductionYValueRounded?: boolean,
) => targetsYAxisValueFormattersType

/**
 * ProductionChart Props.
 */
export interface ProductionChartProps {
    /**
     * Data as array of metrics to be shown in chart.
     */
    data: IMetric[]
}
