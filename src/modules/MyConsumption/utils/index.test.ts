import { convertMetricsDataToApexChartsProps, defaultApexChartOptions } from 'src/modules/MyConsumption/utils'
import { IMetrics } from 'src/modules/Metrics/Metrics'
import { createTheme } from '@mui/material/styles'

const nrlinkConsumptionMetricsText = 'Consommation Nrlink'
// eslint-disable-next-line jsdoc/require-jsdoc
const mockFormatMessage = () => nrlinkConsumptionMetricsText
let mockChartType = 'bar'
const mockDatapoints = [[247, 1651406400]]

// eslint-disable-next-line jsdoc/require-jsdoc
const mockMetricsData: IMetrics = [
    {
        target: 'nrlink_consumption_metrics',
        datapoints: mockDatapoints,
        enedisConsent: true,
        nrlinkConsent: true,
    },
]

const mockYAxis: ApexYAxis[] = [
    {
        title: {
            text: nrlinkConsumptionMetricsText,
        },
        opposite: false,
        axisBorder: {
            show: true,
            offsetX: 0,
            offsetY: 0,
        },
    },
]

const mockSeries: ApexAxisChartSeries = [
    {
        data: [[mockDatapoints[0][1], mockDatapoints[0][0]]],
        name: nrlinkConsumptionMetricsText,
        type: mockChartType,
        color: '',
    },
]

describe('test pure function', () => {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#FFEECD',
            },
        },
    })
    mockSeries[0].color = theme.palette.primary.light
    test('convertMetricsDataToApexChartsProps test with valid data', async () => {
        // ApexChart Props
        const apexChartProps = convertMetricsDataToApexChartsProps(mockMetricsData, 'bar', mockFormatMessage, theme)
        expect(apexChartProps.options).toStrictEqual({
            ...defaultApexChartOptions(theme),
            xaxis: { ...defaultApexChartOptions(theme)?.xaxis, labels: expect.anything() },
            yaxis: mockYAxis,
        })
        expect(apexChartProps.series).toStrictEqual(mockSeries)
    })
    test('convertMetricsDataToApexChartsProps test empty data', async () => {
        mockMetricsData[0].datapoints = []
        mockSeries[0].data = []
        // ApexChart Props empty data
        const apexChartProps = convertMetricsDataToApexChartsProps(mockMetricsData, 'bar', mockFormatMessage, theme)
        expect(apexChartProps.options).toStrictEqual({
            ...defaultApexChartOptions(theme),
            xaxis: { ...defaultApexChartOptions(theme)?.xaxis, labels: expect.anything() },
            yaxis: mockYAxis,
        })
        expect(apexChartProps.series).toStrictEqual(mockSeries)
    })
})
