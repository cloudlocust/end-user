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
     * Weither the add label is in progress.
     */
    isAddingLabelInProgress: boolean
    /**
     * The current range of the metrics.
     */
    range: metricRangeType
    /**
     * The chart data.
     */
    chartData: IMetric[]
}
