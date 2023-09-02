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

// eslint-disable-next-line jsdoc/require-jsdoc
const mockFormatMessage: any = (input: MessageDescriptor) => input.id
let mockChartType: ApexChart['type'] | '' = '' || 'area' || 'bar'
const mockDatapoints = [[247, 1651406400]]
const totalProductionName = 'Production totale'
// eslint-disable-next-line jsdoc/require-jsdoc
let mockYAxisSeriesConvertedData: ApexAxisChartSeries = [
    {
        name: metricTargetsEnum.consumption,
        data: [mockDatapoints[0][0]],
    },
]

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

// eslint-disable-next-line sonarjs/no-unused-collection
let mockyAxisSeries: ApexAxisChartSeries = [
    {
        data: [mockDatapoints[0][0]],
        // eslint-disable-next-line sonarjs/no-duplicate-string
        name: 'Consommation totale',
        type: mockChartType,
        color: '#FFEECD',
    },
]

// eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/no-unused-vars
const mockOptions: (theme: Theme, period: periodType) => ApexOptions = (theme, period) => ({
    ...defaultApexChartOptions(theme),
    xaxis: {
        ...defaultApexChartOptions(theme)?.xaxis,
        labels: {
            format: 'HH:mm',
            hideOverlappingLabels: false,
            // eslint-disable-next-line jsdoc/require-jsdoc
            formatter(value, _timestamp) {
                return dayjsUTC(new Date(value!)).format(getXAxisLabelFormatFromPeriod(period))
            },
        },
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
            formatter: (_index: number) => {
                return dayjsUTC(mockDatapoints[0][1]).format(getXAxisLabelFormatFromPeriod(period, true))
            },
        },
    },
    chart: {
        stacked: true,
    },
    yaxis: mockYAxis,
})

describe('test pure function', () => {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#FFEECD',
            },
            secondary: {
                main: '#FFEECD',
            },
        },
    })
    test('getApexChartMyConsumptionProps test with valid data', async () => {
        let period = 'daily' as periodType
        // ApexChart Props
        const apexChartProps = getApexChartMyConsumptionProps({
            yAxisSeries: mockYAxisSeriesConvertedData,
            formatMessage: mockFormatMessage,
            theme,
            period,
            isStackedEnabled: false,
            chartType: 'consumption',
            chartLabel: 'Consommation totale',
        })
        const mockOptionsResult = mockOptions(theme, period)
        mockOptionsResult.stroke!.show = true
        // eslint-disable-next-line sonarjs/no-unused-collection
        let emptyApexSeriesType: ApexAxisChartSeries = [
            {
                data: [mockDatapoints[0][0]],
                // eslint-disable-next-line sonarjs/no-duplicate-string
                name: 'Consommation totale',
                type: 'area',
                color: 'rgba(255,255,255, .0)',
            },
        ]
        expect(apexChartProps.series).toStrictEqual([...emptyApexSeriesType])
        // When it's first yAxis Line, it shows rounded value 12 Wh = 720 Watt
        expect((apexChartProps.options.yaxis as ApexYAxis[])[0].labels!.formatter!(12, 0)).toStrictEqual('720 W')
        // When it's tooltip, it shows floated value
        expect((apexChartProps.options.yaxis as ApexYAxis[])[0].labels!.formatter!(12)).toStrictEqual('720.00 W')
        expect(apexChartProps.options.theme?.mode).toBe('dark')
    })
    test('getApexChartMyConsumptionProps with different period and mobile', async () => {
        // ApexChart Props
        let period = 'daily' as periodType
        // GMT: Saturday, 1 January 2022 00:42:00
        const TEST_TIMESTAMP = 1640997720000
        const timestamp = new Date(dayjs.utc(new Date(TEST_TIMESTAMP).toUTCString()).startOf('day').format()).getTime()
        const tooltipTimeStampDays = 'Sat 01 Jan'
        const tooltipTimeStampYear = 'January'
        const xAxisTimeStampDay = `00:00`
        const xAxisFormatDay = `HH:mm`
        const xAxisFormatWeek = 'ddd d'
        const xAxisFormatMonth = 'ddd d'
        const xAxisFormatYear = 'MMM'
        // ApexChart Props
        let apexChartProps = getApexChartMyConsumptionProps({
            yAxisSeries: mockYAxisSeriesConvertedData,
            formatMessage: mockFormatMessage,
            theme,
            period,
            isStackedEnabled: false,
            chartType: 'consumption',
            chartLabel: 'Consommation totale',
        })
        apexChartProps.options!.stroke!.show = false
        expect(apexChartProps.options.tooltip!.x!.formatter!(timestamp)!).toEqual(xAxisTimeStampDay)
        expect(apexChartProps.options.xaxis!.labels!.format!).toEqual(xAxisFormatDay)
        // xAxis tooltip will show day of the week, samedi 1 jan.
        period = 'weekly' as periodType
        // ApexChart Props
        apexChartProps = getApexChartMyConsumptionProps({
            yAxisSeries: mockYAxisSeriesConvertedData,
            formatMessage: mockFormatMessage,
            theme,
            period,
            isStackedEnabled: false,
            chartType: 'consumption',
            chartLabel: 'Consommation totale',
        })
        apexChartProps.options!.stroke!.show = true
        expect(apexChartProps.options.xaxis!.labels!.format!).toEqual(xAxisFormatWeek)
        expect(apexChartProps.options.tooltip!.x!.formatter!(timestamp)!).toEqual(tooltipTimeStampDays)

        // xAxis tooltip will show day of the month, 01 jan.
        period = 'monthly' as periodType
        theme.palette.mode = 'light'
        // ApexChart Props
        apexChartProps = getApexChartMyConsumptionProps({
            yAxisSeries: mockYAxisSeriesConvertedData,
            formatMessage: mockFormatMessage,
            theme,
            period,
            isStackedEnabled: false,
            chartType: 'consumption',
            chartLabel: 'Consommation totale',
        })
        expect(apexChartProps.options.tooltip!.x!.formatter!(timestamp)!).toEqual(tooltipTimeStampDays)
        expect(apexChartProps.options.xaxis!.labels!.format!).toEqual(xAxisFormatMonth)
        expect(apexChartProps.options.theme!.mode).toStrictEqual('dark')

        // xAxis tooltip will show month
        period = 'yearly' as periodType
        theme.palette.mode = 'dark'
        apexChartProps = getApexChartMyConsumptionProps({
            yAxisSeries: mockYAxisSeriesConvertedData,
            formatMessage: mockFormatMessage,
            theme,
            period,
            isStackedEnabled: false,
            chartType: 'consumption',
            chartLabel: 'Consommation totale',
        })
        expect(apexChartProps.options.tooltip!.x!.formatter!(timestamp)!).toEqual(tooltipTimeStampYear)
        expect(apexChartProps.options.xaxis!.labels!.format!).toEqual(xAxisFormatYear)
        expect(apexChartProps.options.theme!.mode).toStrictEqual('light')
    })
    test('getApexChartMyConsumptionProps test empty data', async () => {
        const period = 'weekly' as periodType
        mockYAxisSeriesConvertedData[0].data = []
        theme.palette.mode = 'light'
        // ApexChart Props empty data
        const apexChartProps = getApexChartMyConsumptionProps({
            yAxisSeries: mockYAxisSeriesConvertedData,
            formatMessage: mockFormatMessage,
            theme,
            period,
            isStackedEnabled: false,
            chartType: 'consumption',
            chartLabel: 'Consommation totale',
        })
        expect(apexChartProps.series).toStrictEqual([])
    })
    test('convertMetricsDataToApexChartsProps with additional temperatures yaxis', async () => {
        mockYAxisSeriesConvertedData[0].data = [mockDatapoints[0][0]]

        mockyAxisSeries[0].type = 'area'

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
            color: '#FFC200',
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
            formatMessage: mockFormatMessage,
            theme,
            period,
            isStackedEnabled: false,
            chartType: 'consumption',
            chartLabel: 'Consommation totale',
        })
        // eslint-disable-next-line sonarjs/no-unused-collection
        let emptyApexSeriesType: ApexAxisChartSeries = [
            {
                data: [mockDatapoints[0][0]],
                // eslint-disable-next-line sonarjs/no-duplicate-string
                name: 'Consommation totale',
                type: 'area',
                color: 'rgba(255,255,255, .0)',
            },
        ]
        expect(apexChartProps.series[0]).toStrictEqual(emptyApexSeriesType[0])
        // 12 Wh = 720 Watt
        // When it's first yAxis Line, it shows rounded value 12 Wh = 720 Watt
        expect((apexChartProps.options.yaxis as ApexYAxis[])[0].labels!.formatter!(12, 0)).toStrictEqual('720 W')
        // When it's tooltip, it shows floated value
        expect((apexChartProps.options.yaxis as ApexYAxis[])[0].labels!.formatter!(12)).toStrictEqual('720.00 W')
        expect((apexChartProps.options.yaxis as ApexYAxis[])[1].labels!.formatter!(12)).toStrictEqual('12 °C')
        expect((apexChartProps.options.yaxis as ApexYAxis[])[2].labels!.formatter!(12)).toStrictEqual('12 °C')
        expect((apexChartProps.options.yaxis as ApexYAxis[])[2].show).toBeFalsy()
        expect((apexChartProps.options.yaxis as ApexYAxis[])[3].labels!.formatter!(12000)).toStrictEqual('12.00 kVA')
    })
    test('When injectedProduction datapoint are null, total production is shown', async () => {
        let period = 'weekly' as periodType

        const mockSeriesData: ApexAxisChartSeries = [
            {
                name: metricTargetsEnum.injectedProduction,
                data: [[mockDatapoints[0][1], 0]],
            },
            {
                name: metricTargetsEnum.totalProduction,
                data: [[mockDatapoints[0][1], mockDatapoints[0][0]]],
            },
        ]

        // Test Show Total Production
        const apexChartProps = getApexChartMyConsumptionProps({
            yAxisSeries: mockSeriesData,
            formatMessage: mockFormatMessage,
            theme,
            period,
            isStackedEnabled: false,
            chartType: 'production',
        })
        expect(apexChartProps.series[1].name).toStrictEqual(totalProductionName)
        expect(apexChartProps.series[1].type).toStrictEqual('bar')
    })
    test('When injectedProduction datapoint are not null, total production is hidden', async () => {
        let period = 'weekly' as periodType

        const mockSeriesData: ApexAxisChartSeries = [
            {
                name: metricTargetsEnum.injectedProduction,
                data: mockDatapoints as [number, number][],
            },
            {
                name: metricTargetsEnum.totalProduction,
                data: mockDatapoints as [number, number][],
            },
        ]

        // Test Show Total Production
        const apexChartProps = getApexChartMyConsumptionProps({
            yAxisSeries: mockSeriesData,
            formatMessage: mockFormatMessage,
            theme,
            period,
            isStackedEnabled: false,
            chartType: 'production',
        })
        expect(apexChartProps.series[1].name).toStrictEqual(totalProductionName)
        expect(apexChartProps.series[1].type).toStrictEqual('')
    })
})
