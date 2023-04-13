import { Dispatch, SetStateAction } from 'react'
import { metricRangeType } from 'src/modules/Metrics/Metrics'

/**
 * Analysis header props.
 */
export interface AnalysisHeaderProps {
    /**
     * Set range setter function.
     */
    setRange: Dispatch<SetStateAction<metricRangeType>>
    /**
     * Metric range.
     */
    range: metricRangeType
    /**
     * Endis off state.
     */
    enedisSgeOff: boolean
}
