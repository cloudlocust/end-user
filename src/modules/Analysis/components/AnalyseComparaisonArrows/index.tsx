import React from 'react'
import { getMetricType, metricFiltersType, metricRangeType, metricTargetsEnum } from 'src/modules/Metrics/Metrics'
import { useMetrics } from 'src/modules/Metrics/metricsHook'

const AnalysisComparaisonArrows = ({ range, filters }: { range: metricRangeType; filters: metricFiltersType }) => {
    const { data, isMetricsLoading } = useMetrics({
        range,
        filters,
        targets: [
            {
                target: metricTargetsEnum.consumption,
                type: 'timeserie',
            },
        ],
        interval: '1 month',
    } as getMetricType)

    console.log(data)
    return <div>analyse comparaison</div>
}

export default AnalysisComparaisonArrows
