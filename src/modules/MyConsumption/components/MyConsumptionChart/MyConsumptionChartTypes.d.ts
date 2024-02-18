import { RefObject } from 'react'
import { metricIntervalType, targetTimestampsValuesFormat } from 'src/modules/Metrics/Metrics'
import { Dispatch, SetStateAction } from 'react'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import ReactECharts from 'echarts-for-react'

/**
 * Period of time type, with start and end time.
 */
export type IPeriodTime = /**
 *
 */ {
    /**
     * Start time.
     */
    startTime: string | undefined
    /**
     * End time.
     */
    endTime: string | undefined
}

/**
 * Period of time type, with start and end time, but with indexes.
 */
export type IPeriodTimeIndexs = /**
 *
 */ {
    /**
     * Start time.
     */
    startTime: number | undefined
    /**
     * End time.
     */
    endTime: number | undefined
}

/**
 * Enum Indicating the different yAxisIndex, so that each yAxis has its own value formatting.
 */
export enum targetYAxisIndexEnum {
    /**
     * Consumption yAxis index.
     */
    CONSUMPTION = '0',
    /**
     * Temperature yAxis index.
     */
    TEMPERATURE = '1',
    /**
     * Pmax yAxis index.
     */
    PMAX = '2',
    /**
     * Euros yAxis index.
     */
    EUROS = '3',
}

/**
 * Axis Value Formatter.
 */
export type axisValueFormatterType = (value: number | undefined) => string | null

/**
 * Targets functions yAxis Value formatters type (label shown in tooltip and yAxisLine).
 *
 */
export type targetsYAxisValueFormattersType = { [x in targetYAxisIndexEnum]: axisValueFormatterType }

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
    isConsumptionYValueRounded?: boolean,
) => targetsYAxisValueFormattersType

/**
 * ConsumptionChartContainer Props.
 */
export interface ConsumptionChartContainerProps {
    // eslint-disable-next-line jsdoc/require-jsdoc
    period: periodType
    // eslint-disable-next-line jsdoc/require-jsdoc
    range: metricRangeType
    // eslint-disable-next-line jsdoc/require-jsdoc
    metricsInterval: metricIntervalType
    // eslint-disable-next-line jsdoc/require-jsdoc
    filters: metricFiltersType
    // eslint-disable-next-line jsdoc/require-jsdoc
    hasMissingHousingContracts: boolean | null
    // eslint-disable-next-line jsdoc/require-jsdoc
    enedisSgeConsent?: IEnedisSgeConsent
    // eslint-disable-next-line jsdoc/require-jsdoc
    isSolarProductionConsentOff: boolean
    // eslint-disable-next-line jsdoc/require-jsdoc
    setMetricsInterval: Dispatch<SetStateAction<metricIntervalType>>
}

/**
 * ConsumptionChart Props.
 */
export interface ConsumptionChartProps {
    /**
     * Data.
     */
    data: IMetric[]
    /**
     * Period Type.
     */
    period: periodType
    /**
     * Color used for axis (labels, lines, etc.).
     */
    axisColor: string
    /**
     * The time interval in the label selected by the user.
     */
    selectedLabelPeriod?: IPeriodTime
    /**
     * ChartRef.
     */
    chartRef?: RefObject<ReactECharts>
    /**
     * Set Input period Time.
     */
    setInputPeriodTime?: (periodTime: IPeriodTime) => void
}
