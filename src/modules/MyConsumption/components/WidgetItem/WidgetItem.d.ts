import { metricTargetType } from 'src/modules/Metrics/Metrics'

/**
 * Interface WidgetItem Props.
 */
export interface IWidgetItemProps {
    /**
     * Target of the Widget.
     */
    target: metricTargetType
    /**
     * Title of the Item Widget.
     */
    title: string
    /**
     * Info Icon for the Item Widget.
     */
    infoIcon?: JSX.Element | null
    /**
     * Value.
     */
    value: string | number
    /**
     * Unit.
     */
    unit: string
    /**
     * Percentage.
     */
    percentageChange: number
}
