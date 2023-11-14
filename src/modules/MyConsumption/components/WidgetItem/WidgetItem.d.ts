import { metricTargetType } from 'src/modules/Metrics/Metrics'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'

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
    /**
     * Period of the Widget.
     */
    period?: periodType
    /**
     * Message when there is no value.
     */
    noValueMessage?: JSX.Element
}
