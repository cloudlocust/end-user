import { Dispatch, SetStateAction } from 'react'
import { metricRangeType } from 'src/modules/Metrics/Metrics'

/**
 * Analysis header props.
 */
export interface AnalysisHeaderProps {
    // eslint-disable-next-line jsdoc/require-jsdoc
    setRange: Dispatch<SetStateAction<metricRangeType>>
    // eslint-disable-next-line jsdoc/require-jsdoc
    range: metricRangeType
    // eslint-disable-next-line jsdoc/require-jsdoc
    enedisSgeOff: boolean
}
