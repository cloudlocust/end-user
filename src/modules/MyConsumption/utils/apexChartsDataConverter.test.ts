import {
    convertMetricsDataToApexChartsProps,
    defaultApexChartOptions,
} from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
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

const hourFormat = 'HH:mm'
const apexWeekFormat = 'ddd'
const yearFormat = 'MMMM'
const apexMonthFormat = 'dd MMM'
// eslint-disable-next-line jsdoc/require-jsdoc
const mockMetricsData: IMetrics = [
    {
        target: 'nrlink_consumption_metrics',
        datapoints: mockDatapoints,
    },
]

// eslint-disable-next-line jsdoc/require-jsdoc
const getXAxisLabelFormatFromPeriod = (period: periodValue, dayjsFormat?: boolean) => {
    switch (period) {
        case 1:
            return 'HH:mm'
        case 7:
            return dayjsFormat ? 'dddd D MMM' : 'ddd'
        case 365:
            return 'MMMM'
        default:
            return dayjsFormat ? 'DD MMMM' : 'dd MMM'
    }
}

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
const mockOptions: (theme: Theme, period: periodValue) => ApexOptions = (theme, period) => ({
    ...defaultApexChartOptions(theme),
    xaxis: {
        ...defaultApexChartOptions(theme)?.xaxis,
        labels: {
            format: getXAxisLabelFormatFromPeriod(period),
        },
    },
    yaxis: mockYAxis,
    tooltip: {
        x: {
            // eslint-disable-next-line jsdoc/require-jsdoc
            formatter: (timestamp, opts) =>
                dayjs(new Date(timestamp)!).format(getXAxisLabelFormatFromPeriod(period, true)),
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
        expect(apexChartProps.options.xaxis?.labels?.format).toEqual(apexWeekFormat)
        expect((apexChartProps.options.yaxis as ApexYAxis[])[0].labels!.formatter!(12)).toStrictEqual('12 Kwh')
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
            period: 7,
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
        const timeStampMonth = '01 January'
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
        expect(apexChartProps.options.xaxis!.labels!.format).toEqual(hourFormat)

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
        expect(apexChartProps.options.xaxis!.labels!.format).toEqual(apexWeekFormat)

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
        expect(apexChartProps.options.xaxis!.labels!.format).toEqual(apexMonthFormat)

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
        expect(apexChartProps.options.xaxis!.labels!.format).toEqual(yearFormat)
    })
})
