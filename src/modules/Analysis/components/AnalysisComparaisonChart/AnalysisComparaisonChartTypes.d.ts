import { metricTargetType, IMetric } from 'src/modules/Metrics/Metrics'

/**
 * Enum Indicating the different yAxisIndex, so that each yAxis has its own value formatting.
 */
export enum comparaisonTargetYAxisIndexEnum {
    /**
     * Comparaison yAxis index.
     */
    COMPARAISON = '0',
}

/**
 * EchartsComparaisonChart Props.
 */
export interface EchartsComparaisonChartProps {
    /**
     * Data as array of metrics to be shown in chart.
     */
    data: IMetric[]
}

/**
 * Custom targets for comparaison.
 */
export enum CustomTargetsForComparaisonEnum {
    /**
     * ADEME average consumption.
     */
    averageAdemeConsumption = 'average_ademe_consumption',
}

/**
 * Metric Target with added average ademe consumption (witch is an added target that does not exist in the back).
 */
export type metricTargetExtendedWithComparaisonType = metricTargetType &
    CustomTargetsForComparaisonEnum.averageAdemeConsumption

/**
 * .
 */
export type targetValuesFormatForComparaison =
    /**
     * Metric Target Type.
     */
    {
        [key in metricTargetExtendedWithComparaison]?: number[]
    }

/**
 * AnalysisComparisonChartProps.
 */
export interface AnalysisComparisonChartProps {
    /**
     * Metrics data.
     */
    data: IMetric[]
}
