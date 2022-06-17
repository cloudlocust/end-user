import {
    convertMetricsDataToApexChartsProps,
    defaultApexChartOptions,
    externalTemperaturTitle,
    internalTemperaturTitle,
    pMaxTitle,
} from 'src/modules/MyConsumption/utils/apexChartsDataConverter'
import { IMetrics } from 'src/modules/Metrics/Metrics'
import { Theme } from '@mui/material/styles/createTheme'
import { createTheme } from '@mui/material/styles'
import { ApexOptions } from 'apexcharts'
import { periodValue } from 'src/modules/MyConsumption/myConsumptionTypes'
import { dayjsUTC } from 'src/common/react-platform-components'
import { MessageDescriptor } from 'react-intl'

const nrlinkConsumptionMetricsText = 'Consommation'
const nrlinkConsumptionMetricValueText = '12 KWh'
const nrlinkTemperaturMetricValueText = '12 °C'
const nrlinkPMaxMetricValueText = '12 kVA'
// eslint-disable-next-line jsdoc/require-jsdoc
const mockFormatMessage: any = (input: MessageDescriptor) => input.id
let mockChartType = 'bar'
const mockDatapoints = [[247, 1651406400]]

const xaxisCategoryType = 'category'
const xaxisDatetimeType = 'datetime'
// eslint-disable-next-line jsdoc/require-jsdoc
const mockMetricsData: IMetrics = [
    {
        target: 'nrlink_consumption_metrics',
        datapoints: mockDatapoints,
    },
]

// eslint-disable-next-line jsdoc/require-jsdoc
const getXAxisLabelFormatFromPeriod = (period: periodValue, isTooltipLabel?: boolean) => {
    switch (period) {
        case 1:
            return 'HH:mm'
        case 7:
            return isTooltipLabel ? 'dddd' : 'ddd'
        case 365:
            return isTooltipLabel ? 'MMMM' : 'MMM'
        default:
            return isTooltipLabel ? 'ddd DD MMM' : 'D MMM'
    }
}

const mockYAxis: ApexYAxis[] = [
    {
        axisBorder: {
            show: true,
        },
        axisTicks: {
            show: true,
        },
        opposite: false,
        labels: {
            // eslint-disable-next-line jsdoc/require-jsdoc
            formatter: (value: number) => `${value} KWh`,
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
const mockOptions: (theme: Theme, period: periodValue) => ApexOptions = (theme, period) => ({
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
        const mockOptionsResult = mockOptions(theme, period)
        expect(JSON.stringify(apexChartProps.options)).toStrictEqual(JSON.stringify(mockOptionsResult))
        expect(apexChartProps.series).toStrictEqual(mockSeries)
        expect((apexChartProps.options.yaxis as ApexYAxis[])[0].labels!.formatter!(12)).toStrictEqual(
            nrlinkConsumptionMetricValueText,
        )
        expect(apexChartProps.options.theme?.mode).toBe('dark')
    })
    test('convertMetricsDataToApexChartsProps with different period and mobile', async () => {
        // ApexChart Props
        let period = 1 as periodValue
        const timestamp = 1640997720000
        mockDatapoints[0][1] = timestamp
        const tooltipTimeStampWeek = 'Saturday'
        const tooltipTimeStampMonth = 'Sat 01 Jan'
        const tooltipTimeStampYear = 'January'
        const xAxisTimeStampDay = `0${new Date(1640997720000).getHours()}:${new Date(1640997720000).getMinutes()}`
        const xAxisTimeStampWeek = 'Sat'
        const xAxisTimeStampMonth = '1 Jan'
        const xAxisTimeStampYear = 'Jan'
        // xAxis tooltip will show hours:minutes
        let apexChartProps = convertMetricsDataToApexChartsProps({
            data: mockMetricsData,
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
        period = 7 as periodValue
        apexChartProps = convertMetricsDataToApexChartsProps({
            data: mockMetricsData,
            chartType: 'bar',
            formatMessage: mockFormatMessage,
            theme,
            period,
        })
        expect(apexChartProps.options.xaxis!.labels!.formatter!(new Date(timestamp).toString())).toEqual(
            xAxisTimeStampWeek,
        )
        expect(apexChartProps.options.tooltip!.x!.formatter!(1)!).toEqual(tooltipTimeStampWeek)
        expect(apexChartProps.options.xaxis!.type).toEqual(xaxisCategoryType)

        // xAxis tooltip will show day of the month, 01 jan.
        period = 30 as periodValue
        apexChartProps = convertMetricsDataToApexChartsProps({
            data: mockMetricsData,
            chartType: 'bar',
            formatMessage: mockFormatMessage,
            theme,
            period,
        })
        expect(apexChartProps.options.tooltip!.x!.formatter!(1)!).toEqual(tooltipTimeStampMonth)
        expect(apexChartProps.options.xaxis!.labels!.formatter!(new Date(timestamp).toString())).toEqual(
            xAxisTimeStampMonth,
        )
        expect(apexChartProps.options.xaxis!.type).toEqual(xaxisCategoryType)

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
        expect(apexChartProps.options.tooltip!.x!.formatter!(1)!).toEqual(tooltipTimeStampYear)
        expect(apexChartProps.options.xaxis!.labels!.formatter!(new Date(timestamp).toString())).toEqual(
            xAxisTimeStampYear,
        )
        expect(apexChartProps.options.xaxis!.type).toEqual(xaxisCategoryType)
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
    test('convertMetricsDataToApexChartsProps with additional temperatures yaxis', async () => {
        let period = 7 as periodValue
        // External Temperature
        mockMetricsData.push({
            target: 'external_temperature_metrics',
            datapoints: mockDatapoints,
        })
        mockSeries.push({
            data: [mockDatapoints[0][0]],
            name: externalTemperaturTitle,
            type: 'line',
            color: theme.palette.secondary.main,
        })

        // Internal Temperature
        mockMetricsData.push({
            target: 'nrlink_internal_temperature_metrics',
            datapoints: mockDatapoints,
        })
        mockSeries.push({
            data: [mockDatapoints[0][0]],
            name: internalTemperaturTitle,
            type: 'line',
            color: '#BA1B1B',
        })
        // PMax
        mockMetricsData.push({
            target: 'enedis_max_power',
            datapoints: mockDatapoints,
        })
        mockSeries.push({
            data: [mockDatapoints[0][0]],
            name: pMaxTitle,
            type: 'line',
            color: '#FF7A00',
        })
        // ApexChart Props
        const apexChartProps = convertMetricsDataToApexChartsProps({
            data: mockMetricsData,
            chartType: 'bar',
            formatMessage: mockFormatMessage,
            theme,
            period,
        })
        expect(apexChartProps.series).toStrictEqual(mockSeries)
        expect((apexChartProps.options.yaxis as ApexYAxis[])[0].labels!.formatter!(12)).toStrictEqual(
            nrlinkConsumptionMetricValueText,
        )
        expect((apexChartProps.options.yaxis as ApexYAxis[])[1].labels!.formatter!(12)).toStrictEqual(
            nrlinkTemperaturMetricValueText,
        )
        expect((apexChartProps.options.yaxis as ApexYAxis[])[2].labels!.formatter!(12)).toStrictEqual(
            nrlinkTemperaturMetricValueText,
        )
        // Only the first temperature YAxis is shown
        expect((apexChartProps.options.yaxis as ApexYAxis[])[2].show).toBeFalsy()

        expect((apexChartProps.options.yaxis as ApexYAxis[])[3].labels!.formatter!(12)).toStrictEqual(
            nrlinkPMaxMetricValueText,
        )
    })
})
