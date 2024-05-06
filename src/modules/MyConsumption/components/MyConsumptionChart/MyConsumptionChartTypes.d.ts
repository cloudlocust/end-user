import { RefObject } from 'react'
import { metricIntervalType, targetTimestampsValuesFormat } from 'src/modules/Metrics/Metrics'
import { Dispatch, SetStateAction } from 'react'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import ReactECharts from 'echarts-for-react'
import { TooltipFormatter } from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartTooltip/ConsumptionChartTooltip.types'

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
    /**
     * Production yAxis index.
     */
    PRODUCTION = '4',
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
    consumptionValues: targetTimestampsValuesFormat,
    productionValues: targetTimestampsValuesFormat,
    period: periodType,
    isConsumptionYValueRounded?: boolean,
) => targetsYAxisValueFormattersType

/**
 * ConsumptionChartContainer Props.
 */
export interface ConsumptionChartContainerProps {
    /**
     * Indicates the current selected Period if it's monthly or daily or yearly or weekly so that we format tooltip and xAxis of chart according to the period.
     */
    period: PeriodEnum
    /**
     * Current range so that we handle the xAxis values according to period and range selected.
     */
    range: metricRangeType
    /**
     * Boolean state to know whether the stacked option is true or false.
     */
    metricsInterval: metricIntervalType
    /**
     * Consumption or production chart type.
     */
    filters: metricFiltersType
    /**
     * Boolean indicating if there are missing housing contracts.
     */
    hasMissingHousingContracts: boolean | null
    /**
     * Enedis SGE consent.
     */
    enedisSgeConsent?: IEnedisSgeConsent
    /**
     * Boolean indicating if solar production consent is off.
     */
    isSolarProductionConsentOff: boolean
    /**
     * Boolean indicating whether the idle chart is shown or not.
     */
    isIdleShown: boolean
    /**
     * Set metrics interval.
     */
    setMetricsInterval: Dispatch<SetStateAction<metricIntervalType>>

    /**
     * Callback function for period change.
     *
     * @param period The new period value.
     */
    onPeriodChange: (period: PeriodEnum) => void

    /**
     * Callback function for range change.
     *
     * @param range The new range value.
     */
    onRangeChange: (range: metricRangeType) => void

    /**
     * Indicates whether the production chart is shown or not.
     */
    isProductionChartShown: boolean
}

/**
 * Represents the total measurement value and unit.
 */
type TotalMeasurement =
    /**
     * TotalMeasurement.
     */
    {
        /**
         * The numeric value of the measurement.
         */
        value: number
        /**
         * The unit of the measurement.
         */
        unit: string
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
    /**
     * Formatter function for override the tooltip.
     */
    tooltipFormatter?: TooltipFormatter
    /**
     * Indicates if the chart is for the labelization.
     */
    isLabelizationChart?: boolean
}
