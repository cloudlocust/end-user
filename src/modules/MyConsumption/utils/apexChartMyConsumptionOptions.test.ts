import {
    defaultApexChartOptions,
    getApexChartMyConsumptionOptions,
} from 'src/modules/MyConsumption/utils/apexChartMyConsumptionOptions'
import { Theme } from '@mui/material/styles/createTheme'
import { createTheme } from '@mui/material/styles'
import { ApexOptions } from 'apexcharts'
import { periodValueType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { dayjsUTC } from 'src/common/react-platform-components'
import { MessageDescriptor } from 'react-intl'

const nrlinkConsumptionMetricsText = 'Consommation'
// eslint-disable-next-line jsdoc/require-jsdoc
const mockFormatMessage: any = (input: MessageDescriptor) => input.id
let mockChartType = 'bar'
const mockDatapoints = [[247, 1651406400]]

const xaxisCategoryType = 'category'
const xaxisDatetimeType = 'datetime'
// eslint-disable-next-line jsdoc/require-jsdoc
const mockSeriesConvertedData: ApexAxisChartSeries = [
    {
        name: 'nrlink_consumption_metrics',
        data: [mockDatapoints[0][0]],
    },
]

// eslint-disable-next-line jsdoc/require-jsdoc
const mockCategoriesConvertedData = [mockDatapoints[0][1]]

// eslint-disable-next-line jsdoc/require-jsdoc
const getXAxisLabelFormatFromPeriod = (period: periodValueType, isTooltipLabel?: boolean) => {
    switch (period) {
        case 'daily':
            return 'HH:mm'
        case 'weekly':
            return isTooltipLabel ? 'ddd DD MMM' : 'ddd'
        case 'yearly':
            return isTooltipLabel ? 'MMMM' : 'MMM'
        default:
            return isTooltipLabel ? 'ddd DD MMM' : 'D MMM'
    }
}

const mockYAxis: ApexYAxis[] = [
    {
        opposite: false,
        labels: {
            // eslint-disable-next-line jsdoc/require-jsdoc
            formatter: (value: number) => `${value} Kwh`,
        },
        axisBorder: {
            show: true,
        },
        axisTicks: {
            show: true,
        },
    },
]

const mockSeries: ApexAxisChartSeries = [
    {
        data: [mockDatapoints[0][0]],
        name: nrlinkConsumptionMetricsText,
        type: mockChartType,
        color: 'rgb(255, 241, 215)',
    },
]

// eslint-disable-next-line jsdoc/require-jsdoc
const mockOptions: (theme: Theme, period: periodValueType) => ApexOptions = (theme, period) => ({
    ...defaultApexChartOptions(theme),
    xaxis: {
        ...defaultApexChartOptions(theme)?.xaxis,
        categories: [mockDatapoints[0][1]],
        labels: {
            format: 'HH:mm',
            // eslint-disable-next-line jsdoc/require-jsdoc
            formatter(value, timestamp) {
                return dayjsUTC(new Date(value!)).format(getXAxisLabelFormatFromPeriod(period))
            },
        },
        type: 'category',
    },
    tooltip: {
        x: {
            // eslint-disable-next-line jsdoc/require-jsdoc
            formatter: (index: number) => {
                return dayjsUTC(mockDatapoints[0][1]).format(getXAxisLabelFormatFromPeriod(period, true))
            },
        },
    },
    markers: {
        ...defaultApexChartOptions(theme)!.markers,
        size: [0],
    },
    yaxis: mockYAxis,
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
    test('getApexChartMyConsumptionOptions test with valid data', async () => {
        let period = 'weekly' as periodValueType
        // ApexChart Props
        const apexChartProps = getApexChartMyConsumptionOptions({
            series: mockSeriesConvertedData,
            categories: mockCategoriesConvertedData,
            chartType: 'bar',
            formatMessage: mockFormatMessage,
            theme,
            period,
        })
        const mockOptionsResult = mockOptions(theme, period)
        expect(JSON.stringify(apexChartProps.options)).toStrictEqual(JSON.stringify(mockOptionsResult))
        expect(apexChartProps.series).toStrictEqual(mockSeries)
        expect((apexChartProps.options.yaxis as ApexYAxis[])[0].labels!.formatter!(12)).toStrictEqual('12 Kwh')
        expect(apexChartProps.options.theme?.mode).toBe('dark')
    })
    test('getApexChartMyConsumptionOptions with different period and mobile', async () => {
        // ApexChart Props
        let period = 'daily' as periodValueType
        const timestamp = 1640997720000
        mockCategoriesConvertedData[0] = timestamp
        const tooltipTimeStampDays = 'Sat 01 Jan'
        const tooltipTimeStampYear = 'January'
        const xAxisTimeStampDay = `0${new Date(timestamp).getHours()}:${new Date(timestamp).getMinutes()}`
        const xAxisTimeStampWeek = 'Sat'
        const xAxisTimeStampMonth = '1 Jan'
        const xAxisTimeStampYear = 'Jan'
        // ApexChart Props
        let apexChartProps = getApexChartMyConsumptionOptions({
            series: mockSeriesConvertedData,
            categories: mockCategoriesConvertedData,
            chartType: 'bar',
            formatMessage: mockFormatMessage,
            theme,
            period,
        })
        expect(apexChartProps.options.tooltip!).toBeUndefined()
        expect(apexChartProps.options.xaxis!.labels!.formatter!(new Date(timestamp).toString())).toEqual(
            xAxisTimeStampDay,
        )
        expect(apexChartProps.options.xaxis!.type).toEqual(xaxisDatetimeType)
        // xAxis tooltip will show day of the week, samedi 1 jan.
        period = 'weekly' as periodValueType
        // ApexChart Props
        apexChartProps = getApexChartMyConsumptionOptions({
            series: mockSeriesConvertedData,
            categories: mockCategoriesConvertedData,
            chartType: 'bar',
            formatMessage: mockFormatMessage,
            theme,
            period,
        })
        expect(apexChartProps.options.xaxis!.labels!.formatter!(new Date(timestamp).toString())).toEqual(
            xAxisTimeStampWeek,
        )
        expect(apexChartProps.options.tooltip!.x!.formatter!(1)!).toEqual(tooltipTimeStampDays)
        expect(apexChartProps.options.xaxis!.type).toEqual(xaxisCategoryType)

        // xAxis tooltip will show day of the month, 01 jan.
        period = 'monthly' as periodValueType
        theme.palette.mode = 'light'
        // ApexChart Props
        apexChartProps = getApexChartMyConsumptionOptions({
            series: mockSeriesConvertedData,
            categories: mockCategoriesConvertedData,
            chartType: 'bar',
            formatMessage: mockFormatMessage,
            theme,
            period,
        })
        expect(apexChartProps.options.tooltip!.x!.formatter!(1)!).toEqual(tooltipTimeStampDays)
        expect(apexChartProps.options.xaxis!.labels!.formatter!(new Date(timestamp).toString())).toEqual(
            xAxisTimeStampMonth,
        )
        expect(apexChartProps.options.xaxis!.type).toEqual(xaxisCategoryType)
        expect(apexChartProps.options.theme!.mode).toStrictEqual('dark')

        // xAxis tooltip will show month
        period = 'yearly' as periodValueType
        theme.palette.mode = 'dark'
        apexChartProps = getApexChartMyConsumptionOptions({
            series: mockSeriesConvertedData,
            categories: mockCategoriesConvertedData,
            chartType: 'bar',
            formatMessage: mockFormatMessage,
            theme,
            period,
        })
        expect(apexChartProps.options.tooltip!.x!.formatter!(1)!).toEqual(tooltipTimeStampYear)
        expect(apexChartProps.options.xaxis!.labels!.formatter!(new Date(timestamp).toString())).toEqual(
            xAxisTimeStampYear,
        )
        expect(apexChartProps.options.theme!.mode).toStrictEqual('light')
        expect(apexChartProps.options.xaxis!.type).toEqual(xaxisCategoryType)
    })
    test('getApexChartMyConsumptionOptions test empty data', async () => {
        const period = 'weekly' as periodValueType
        mockSeriesConvertedData[0].data = []
        theme.palette.mode = 'light'
        // ApexChart Props empty data
        const apexChartProps = getApexChartMyConsumptionOptions({
            series: mockSeriesConvertedData,
            categories: [],
            chartType: 'bar',
            formatMessage: mockFormatMessage,
            theme,
            period,
        })
        expect(apexChartProps.series).toStrictEqual([])
        expect(apexChartProps.options.xaxis!.categories).toStrictEqual([])
    })
})
