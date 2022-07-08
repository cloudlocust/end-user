import {
    defaultApexChartOptions,
    getApexChartMyConsumptionProps,
} from 'src/modules/MyConsumption/utils/apexChartsMyConsumptionOptions'
import { Theme } from '@mui/material/styles/createTheme'
import { createTheme } from '@mui/material/styles'
import { ApexOptions } from 'apexcharts'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { dayjsUTC } from 'src/common/react-platform-components'
import { MessageDescriptor } from 'react-intl'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import dayjs from 'dayjs'

const nrlinkConsumptionMetricsText = 'Consommation'
// eslint-disable-next-line jsdoc/require-jsdoc
const mockFormatMessage: any = (input: MessageDescriptor) => input.id
let mockChartType = 'bar' as ApexChart['type']
const mockDatapoints = [[247, 1651406400]]

// eslint-disable-next-line jsdoc/require-jsdoc
const mockYAxisSeriesConvertedData: ApexAxisChartSeries = [
    {
        name: metricTargetsEnum.consumption,
        data: [mockDatapoints[0][0]],
    },
]

// eslint-disable-next-line jsdoc/require-jsdoc
const mockXAxisValuesConvertedData = [mockDatapoints[0][1]]

// eslint-disable-next-line jsdoc/require-jsdoc
const getXAxisLabelFormatFromPeriod = (period: periodType, isTooltipLabel?: boolean) => {
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
            formatter: (value: number) => `${value} W`,
        },
        axisBorder: {
            show: true,
        },
        axisTicks: {
            show: true,
        },
    },
]

const mockyAxisSeries: ApexAxisChartSeries = [
    {
        data: [mockDatapoints[0][0]],
        name: nrlinkConsumptionMetricsText,
        type: mockChartType,
        color: 'rgb(255, 241, 215)',
    },
]

// eslint-disable-next-line jsdoc/require-jsdoc
const mockOptions: (theme: Theme, period: periodType) => ApexOptions = (theme, period) => ({
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
    markers: {
        ...defaultApexChartOptions(theme)?.markers,
        size: [0],
    },
    stroke: {
        ...defaultApexChartOptions(theme)?.stroke,
        width: [0],
    },
    tooltip: {
        x: {
            // eslint-disable-next-line jsdoc/require-jsdoc
            formatter: (index: number) => {
                return dayjsUTC(mockDatapoints[0][1]).format(getXAxisLabelFormatFromPeriod(period, true))
            },
        },
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
    mockyAxisSeries[0].color = theme.palette.primary.light
    test('getApexChartMyConsumptionProps test with valid data', async () => {
        let period = 'daily' as periodType
        // ApexChart Props
        const apexChartProps = getApexChartMyConsumptionProps({
            yAxisSeries: mockYAxisSeriesConvertedData,
            xAxisValues: mockXAxisValuesConvertedData,
            chartType: 'bar',
            formatMessage: mockFormatMessage,
            theme,
            period,
        })
        const mockOptionsResult = mockOptions(theme, period)
        mockOptionsResult.stroke!.show = true
        expect(JSON.stringify(apexChartProps.options)).toStrictEqual(JSON.stringify(mockOptionsResult))
        expect(apexChartProps.series).toStrictEqual(mockyAxisSeries)
        expect((apexChartProps.options.yaxis as ApexYAxis[])[0].labels!.formatter!(12)).toStrictEqual('12.00 Wh')
        expect(apexChartProps.options.theme?.mode).toBe('dark')
    })
    test('getApexChartMyConsumptionProps with different period and mobile', async () => {
        // ApexChart Props
        let period = 'daily' as periodType
        // GMT: Saturday, 1 January 2022 00:42:00
        const TEST_TIMESTAMP = 1640997720000
        const timestamp = new Date(dayjs.utc(new Date(TEST_TIMESTAMP).toUTCString()).startOf('day').format()).getTime()
        mockXAxisValuesConvertedData[0] = timestamp
        const tooltipTimeStampDays = 'Sat 01 Jan'
        const tooltipTimeStampYear = 'January'
        const xAxisTimeStampDay = `00:00`
        const xAxisTimeStampWeek = 'Sat'
        const xAxisTimeStampMonth = '1 Jan'
        const xAxisTimeStampYear = 'Jan'
        // ApexChart Props
        let apexChartProps = getApexChartMyConsumptionProps({
            yAxisSeries: mockYAxisSeriesConvertedData,
            xAxisValues: mockXAxisValuesConvertedData,
            chartType: 'bar',
            formatMessage: mockFormatMessage,
            theme,
            period,
        })
        apexChartProps.options!.stroke!.show = false
        expect(apexChartProps.options.tooltip!.x!.formatter!(1)!).toEqual(xAxisTimeStampDay)
        expect(apexChartProps.options.xaxis!.labels!.formatter!(new Date(timestamp).toString())).toEqual(
            xAxisTimeStampDay,
        )
        // xAxis tooltip will show day of the week, samedi 1 jan.
        period = 'weekly' as periodType
        // ApexChart Props
        apexChartProps = getApexChartMyConsumptionProps({
            yAxisSeries: mockYAxisSeriesConvertedData,
            xAxisValues: mockXAxisValuesConvertedData,
            chartType: 'bar',
            formatMessage: mockFormatMessage,
            theme,
            period,
        })
        apexChartProps.options!.stroke!.show = true
        expect(apexChartProps.options.xaxis!.labels!.formatter!(new Date(timestamp).toString())).toEqual(
            xAxisTimeStampWeek,
        )
        expect(apexChartProps.options.tooltip!.x!.formatter!(1)!).toEqual(tooltipTimeStampDays)

        // xAxis tooltip will show day of the month, 01 jan.
        period = 'monthly' as periodType
        theme.palette.mode = 'light'
        // ApexChart Props
        apexChartProps = getApexChartMyConsumptionProps({
            yAxisSeries: mockYAxisSeriesConvertedData,
            xAxisValues: mockXAxisValuesConvertedData,
            chartType: 'bar',
            formatMessage: mockFormatMessage,
            theme,
            period,
        })
        expect(apexChartProps.options.tooltip!.x!.formatter!(1)!).toEqual(tooltipTimeStampDays)
        expect(apexChartProps.options.xaxis!.labels!.formatter!(new Date(timestamp).toString())).toEqual(
            xAxisTimeStampMonth,
        )
        expect(apexChartProps.options.theme!.mode).toStrictEqual('dark')

        // xAxis tooltip will show month
        period = 'yearly' as periodType
        theme.palette.mode = 'dark'
        apexChartProps = getApexChartMyConsumptionProps({
            yAxisSeries: mockYAxisSeriesConvertedData,
            xAxisValues: mockXAxisValuesConvertedData,
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
    })
    test('getApexChartMyConsumptionProps test empty data', async () => {
        const period = 'weekly' as periodType
        mockYAxisSeriesConvertedData[0].data = []
        theme.palette.mode = 'light'
        // ApexChart Props empty data
        const apexChartProps = getApexChartMyConsumptionProps({
            yAxisSeries: mockYAxisSeriesConvertedData,
            xAxisValues: [],
            chartType: 'bar',
            formatMessage: mockFormatMessage,
            theme,
            period,
        })
        expect(apexChartProps.series).toStrictEqual([])
        expect(apexChartProps.options.xaxis!.categories).toStrictEqual([])
    })
    test('convertMetricsDataToApexChartsProps with additional temperatures yaxis', async () => {
        mockYAxisSeriesConvertedData[0].data = [mockDatapoints[0][0]]

        let period = 'daily' as periodType
        // External Temperature
        mockYAxisSeriesConvertedData.push({
            name: metricTargetsEnum.externalTemperature,
            data: mockYAxisSeriesConvertedData[0].data,
        })
        mockyAxisSeries.push({
            data: mockYAxisSeriesConvertedData[0].data,
            name: 'Température Extérieure',
            type: 'line',
            color: theme.palette.secondary.main,
        })

        // Internal Temperature
        mockYAxisSeriesConvertedData.push({
            name: metricTargetsEnum.internalTemperature,
            data: mockYAxisSeriesConvertedData[0].data,
        })
        mockyAxisSeries.push({
            data: mockYAxisSeriesConvertedData[0].data,
            name: 'Température Intérieure',
            type: 'line',
            color: '#BA1B1B',
        })

        // Pmax
        mockYAxisSeriesConvertedData.push({
            name: metricTargetsEnum.pMax,
            data: mockYAxisSeriesConvertedData[0].data,
        })
        mockyAxisSeries.push({
            data: mockYAxisSeriesConvertedData[0].data,
            name: 'Pmax',
            type: 'line',
            color: '#FF7A00',
        })

        // ApexChart Props
        const apexChartProps = getApexChartMyConsumptionProps({
            yAxisSeries: mockYAxisSeriesConvertedData,
            xAxisValues: mockXAxisValuesConvertedData,
            chartType: 'bar',
            formatMessage: mockFormatMessage,
            theme,
            period,
        })
        expect(apexChartProps.series).toStrictEqual(mockyAxisSeries)
        expect((apexChartProps.options.yaxis as ApexYAxis[])[0].labels!.formatter!(12)).toStrictEqual('12.00 Wh')
        expect((apexChartProps.options.yaxis as ApexYAxis[])[1].labels!.formatter!(12)).toStrictEqual('12 °C')
        expect((apexChartProps.options.yaxis as ApexYAxis[])[2].labels!.formatter!(12)).toStrictEqual('12 °C')
        expect((apexChartProps.options.yaxis as ApexYAxis[])[2].show).toBeFalsy()
        expect((apexChartProps.options.yaxis as ApexYAxis[])[3].labels!.formatter!(12000)).toStrictEqual('12.00 kVA')
    })
})
