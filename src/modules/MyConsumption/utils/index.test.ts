import { convertMetricsDataToApexChartsProps, defaultApexChartOptions } from 'src/modules/MyConsumption/utils'
import { IMetrics } from 'src/modules/Metrics/Metrics'
import { Theme } from '@mui/material/styles/createTheme'
import { createTheme } from '@mui/material/styles'
import dayjs from 'dayjs'
import { ApexOptions } from 'apexcharts'
import { periodValue } from 'src/modules/MyConsumption/myConsumptionTypes'

const nrlinkConsumptionMetricsText = 'Consommation'
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
        // TODO Reset when we'll have multiple graphs
        // title: {
        //     text: nrlinkConsumptionMetricsText,
        // },
        opposite: false,
        axisBorder: {
            show: true,
        },
        labels: {
            // eslint-disable-next-line jsdoc/require-jsdoc
            formatter: (value: number) => `${value} Kwh`,
        },
    },
]

const mockSeries: ApexAxisChartSeries = [
    {
        data: [{ x: new Date(mockDatapoints[0][1]), y: mockDatapoints[0][0] }],
        name: nrlinkConsumptionMetricsText,
        type: mockChartType,
        color: 'rgb(255, 241, 215)',
    },
]

// eslint-disable-next-line jsdoc/require-jsdoc
const mockOptions: (theme: Theme, period?: periodValue) => ApexOptions = (theme, period) => ({
    ...defaultApexChartOptions(theme),
    xaxis: {
        ...defaultApexChartOptions(theme)?.xaxis,
        labels: {
            datetimeFormatter: {
                year: 'yyyy',
                month: 'MMMM',
                day: period === 7 ? 'ddd' : 'dd MMM',
                hour: 'HH:mm',
            },
            // eslint-disable-next-line jsdoc/require-jsdoc
            formatter: period === 1 ? (value, timestamp) => dayjs(new Date(timestamp!)!).format('HH:mm') : undefined,
        },
    },
    yaxis: mockYAxis,
    tooltip: {
        x: {
            // eslint-disable-next-line jsdoc/require-jsdoc
            formatter: (timestamp, opts) => {
                if (period === 1) return dayjs(new Date(timestamp)!).format('HH:mm')
                if (period === 7) return dayjs(new Date(timestamp)!).format('dddd D MMM')
                if (period === 365) return dayjs(new Date(timestamp)!).format('MMMM')
                return dayjs(new Date(timestamp)!).format('DD MMM')
            },
        },
    },
})

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
        let period = 7 as periodValue
        // ApexChart Props
        const apexChartProps = convertMetricsDataToApexChartsProps({
            data: mockMetricsData,
            chartType: 'bar',
            formatMessage: mockFormatMessage,
            theme,
            period,
        })

        expect(JSON.stringify(apexChartProps.options)).toStrictEqual(JSON.stringify(mockOptions(theme, period)))
        expect(apexChartProps.series).toStrictEqual(mockSeries)
        expect(apexChartProps.options.xaxis?.labels?.datetimeFormatter?.month).toEqual('MMMM')
        expect((apexChartProps.options.yaxis as ApexYAxis[])[0].labels!.formatter!(12)).toStrictEqual('12 Kwh')
        expect(apexChartProps.options.xaxis?.labels?.formatter).toBeUndefined()
    })
    test('convertMetricsDataToApexChartsProps test empty data', async () => {
        mockMetricsData[0].datapoints = []
        mockSeries[0].data = []
        // ApexChart Props empty data
        const apexChartProps = convertMetricsDataToApexChartsProps({
            data: mockMetricsData,
            chartType: 'bar',
            formatMessage: mockFormatMessage,
            theme,
        })
        // expect(JSON.stringify(apexChartProps.options)).toStrictEqual(JSON.stringify(mockOptions(theme)))
        expect(apexChartProps.series).toStrictEqual(mockSeries)
    })
    test('convertMetricsDataToApexChartsProps with different period and mobile', async () => {
        // ApexChart Props
        let period = 1 as periodValue
        const timestamp = 1640997720000
        const timeStampDay = `0${new Date(1640997720000).getHours()}:${new Date(1640997720000).getMinutes()}`
        const timeStampWeek = 'Saturday 1 Jan'
        const timeStampMonth = '01 Jan'
        const timeStampYear = 'January'

        // xAxis tooltip will show hours:minutes
        let apexChartProps = convertMetricsDataToApexChartsProps({
            data: mockMetricsData,
            chartType: 'bar',
            formatMessage: mockFormatMessage,
            theme,
            period,
        })
        expect(apexChartProps.options.tooltip!.x!.formatter!(timestamp)!).toEqual(timeStampDay)
        expect(apexChartProps.options.xaxis!.labels!.formatter!('', timestamp)!).toEqual(timeStampDay)

        // xAxis tooltip will show day of the week, samedi 1 jan.
        period = 7 as periodValue
        apexChartProps = convertMetricsDataToApexChartsProps({
            data: mockMetricsData,
            chartType: 'bar',
            formatMessage: mockFormatMessage,
            theme,
            period,
        })
        expect(apexChartProps.options.tooltip!.x!.formatter!(timestamp)!).toEqual(timeStampWeek)
        expect(apexChartProps.options.xaxis!.labels!.formatter).toBeUndefined()

        // xAxis tooltip will show day of the month, 01 jan.
        period = 30 as periodValue
        apexChartProps = convertMetricsDataToApexChartsProps({
            data: mockMetricsData,
            chartType: 'bar',
            formatMessage: mockFormatMessage,
            theme,
            period,
        })
        expect(apexChartProps.options.tooltip!.x!.formatter!(timestamp)!).toEqual(timeStampMonth)
        expect(apexChartProps.options.xaxis!.labels!.formatter).toBeUndefined()

        // xAxis tooltip will show month
        period = 365 as periodValue
        apexChartProps = convertMetricsDataToApexChartsProps({
            data: mockMetricsData,
            chartType: 'bar',
            formatMessage: mockFormatMessage,
            theme,
            period,
            isMobile: true,
        })
        expect(apexChartProps.options.tooltip!.x!.formatter!(timestamp)!).toEqual(timeStampYear)
        expect(apexChartProps.options.xaxis?.labels?.datetimeFormatter?.month).toEqual('MMM')
        expect(apexChartProps.options.xaxis!.labels!.formatter).toBeUndefined()
    })
})
