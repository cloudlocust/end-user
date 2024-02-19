import { RefObject } from 'react'
import { IPeriodTime } from 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChartTypes.d'
import { ReactECharts } from 'echarts-for-react'
import { metricRangeType } from 'src/modules/Metrics/Metrics'

/**
 * Props of the AddLabelButtonForm component.
 */
interface AddLabelButtonFormProps {
    /**
     * Ref of the chart.
     */
    chartRef: RefObject<ReactECharts>
    /**
     * Input Period Time.
     */
    inputPeriodTime: IPeriodTime
    /**
     * Set the input period time.
     */
    setInputPeriodTime: (inputPeriodTime: IPeriodTime) => void
    /**
     * The equipments list.
     */
    equipments: /**
     */
    {
        /**
         * Id of the equipment.
         */
        id?: number
        /**
         * Name of the equipment.
         */
        name: string
    }[]
    /**
     * Weather the creation of labels is disabled.
     */
    addingLabelsIsDisabled: boolean
    /**
     * The current range of the metrics.
     */
    range: metricRangeType
}
