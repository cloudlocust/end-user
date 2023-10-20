import { convertMetricsDataToChartsAxisValues } from 'src/modules/MyConsumption/utils/chartsDataConverter'
import { IMetric } from 'src/modules/Metrics/Metrics'

// eslint-disable-next-line jsdoc/require-jsdoc
const mockDatapoints = [[247, 1651406400]]

// eslint-disable-next-line jsdoc/require-jsdoc
const mockMetricsData: IMetric[] = [
    {
        target: 'consumption_metrics',
        datapoints: mockDatapoints,
    },
]

// eslint-disable-next-line jsdoc/require-jsdoc
describe('test pure function', () => {
    describe('convertMetricsDataToChartsAxisValues', () => {
        test('convertMetricsDataToChartsAxisValues test with valid data', async () => {
            // chart Props
            const chartsAxisValues = convertMetricsDataToChartsAxisValues(mockMetricsData)
            expect(chartsAxisValues.yAxisSeries).toStrictEqual([
                { name: mockMetricsData[0].target, data: [mockDatapoints[0][0]] },
            ])
            expect(chartsAxisValues.xAxisSeries).toStrictEqual([[mockDatapoints[0][1]]])
        })
        test('convertMetricsDataToChartsAxisValues test empty data', async () => {
            mockMetricsData[0].datapoints = []
            // chart Props empty data
            const chartsAxisValues = convertMetricsDataToChartsAxisValues(mockMetricsData)
            expect(chartsAxisValues.yAxisSeries).toStrictEqual([{ name: mockMetricsData[0].target, data: [] }])
            expect(chartsAxisValues.xAxisSeries).toStrictEqual([[]])
        })
    })
})
