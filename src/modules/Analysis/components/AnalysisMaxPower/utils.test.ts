import { computePMaxWithTimestamp } from 'src/modules/Analysis/components/AnalysisMaxPower/utils'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'

describe('conputePMaxWithTimestamp', () => {
    const data = [
        {
            target: metricTargetsEnum.pMax,
            datapoints: [
                [100, 1612617600],
                [200, 1612617700],
                [300, 1612617800],
            ],
        },
    ]

    it('returns the correct max value and timestamp when maxValue is less than 999', () => {
        const result = computePMaxWithTimestamp(data)
        expect(result.pmaxValue).toBe(300)
        expect(result.pmaxValueTimestamp).toBe(1612617800)
        expect(result.pmaxUnit).toBe('VA')
    })

    it('returns the correct max value and timestamp in kVA when maxValue is greater than 999', () => {
        const dataWithMaxValueGreaterThan999 = [
            {
                target: metricTargetsEnum.pMax,
                datapoints: [
                    [1000, 1612617600],
                    [2000, 1612617700],
                    [3000, 1612617800],
                ],
            },
        ]
        const result = computePMaxWithTimestamp(dataWithMaxValueGreaterThan999)
        expect(result.maxValue).toBe(3)
        expect(result.pmaxValueTimestamp).toBe(1612617800)
        expect(result.unit).toBe('kVa')
    })
})
