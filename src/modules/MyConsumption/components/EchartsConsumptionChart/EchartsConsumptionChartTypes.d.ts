import { targetTimestampsValuesFormat } from 'src/modules/Metrics/Metrics'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes.d'

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
export type axisValueFormatterType = (value: number | undefined) => string

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
 * @returns Value formatters to group yAxisLine and tooltip labels.
 */
export type getTargetsYAxisValueFormattersType = (
    values: targetTimestampsValuesFormat,
    period: periodType,
) => targetsYAxisValueFormattersType

/**
 * EchartsConsumptionChartContainer Props.
 */
export interface EchartsConsumptionChartContainerProps {
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
}

/**
 * EchartsConsumptionChart Props.
 */
export interface EchartsConsumptionChartProps {
    // eslint-disable-next-line jsdoc/require-jsdoc
    data: IMetric[]
    // eslint-disable-next-line jsdoc/require-jsdoc
    period: periodType
    // eslint-disable-next-line jsdoc/require-jsdoc
    isSolarProductionConsentOff: boolean
}
