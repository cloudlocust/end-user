import { convertMetricsDataToApexChartsAxisValues } from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { IMetrics } from 'src/modules/Metrics/Metrics'

// eslint-disable-next-line jsdoc/require-jsdoc
const mockDatapoints = [[247, 1651406400]]

// eslint-disable-next-line jsdoc/require-jsdoc
const mockMetricsData: IMetrics = [
    {
        target: 'nrlink_consumption_metrics',
        datapoints: mockDatapoints,
    },
]

// eslint-disable-next-line jsdoc/require-jsdoc
describe('test pure function', () => {
    test('convertMetricsDataToApexChartsAxisValues test with valid data', async () => {
        // ApexChart Props
        const apexChartsAxisValues = convertMetricsDataToApexChartsAxisValues(mockMetricsData)
        expect(apexChartsAxisValues.yAxisSeries).toStrictEqual([
            { name: mockMetricsData[0].target, data: [mockDatapoints[0][0]] },
        ])
        expect(apexChartsAxisValues.xAxisValues).toStrictEqual([mockDatapoints[0][1]])
    })
    test('convertMetricsDataToApexChartsAxisValues test empty data', async () => {
        mockMetricsData[0].datapoints = []
        // ApexChart Props empty data
        const apexChartsAxisValues = convertMetricsDataToApexChartsAxisValues(mockMetricsData)
        expect(apexChartsAxisValues.yAxisSeries).toStrictEqual([{ name: mockMetricsData[0].target, data: [] }])
        expect(apexChartsAxisValues.xAxisValues).toStrictEqual([])
    })
})
