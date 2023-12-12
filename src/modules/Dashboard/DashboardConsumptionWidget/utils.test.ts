import {
    createDataForConsumptionWidgetGraph,
    calculateTotalConsumptionAndPrice,
    getApexChartOptions,
} from 'src/modules/Dashboard/DashboardConsumptionWidget/utils'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'

/**
 * Mock the metric data.
 */
export const mockMetricConsumptionData: IMetric[] = [
    {
        target: metricTargetsEnum.consumption,
        datapoints: [
            [135.0, 1701045000000],
            [131.0, 1701046800000],
            [124.0, 1701048600000],
            [160.0, 1701050400000],
            [146.0, 1701052200000],
            [132.0, 1701054000000],
            [125.0, 1701055800000],
            [140.0, 1701057600000],
            [131.0, 1701059400000],
            [141.0, 1701061200000],
            [129.0, 1701063000000],
            [139.0, 1701064800000],
            [130.0, 1701066600000],
            [139.0, 1701068400000],
            [138.0, 1701070200000],
            [209.0, 1701072000000],
            [246.0, 1701073800000],
            [353.0, 1701075600000],
        ],
    },
]

/**
 * Expected labels for the mocked metric data.
 */
export const mockConsumptionLabels = [
    '00:30',
    '01:00',
    '01:30',
    '02:00',
    '02:30',
    '03:00',
    '03:30',
    '04:00',
    '04:30',
    '05:00',
    '05:30',
    '06:00',
    '06:30',
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
]

/**
 * Expected serieValues for the mocked metric data.
 */
export const mockConsumptionSerieValues = [
    135.0, 131.0, 124.0, 160.0, 146.0, 132.0, 125.0, 140.0, 131.0, 141.0, 129.0, 139.0, 130.0, 139.0, 138.0, 209.0,
    246.0, 353.0,
]

describe('createDataForConsumptionWidgetGraph', () => {
    test('returns labels and serieValues based on metric data', () => {
        const result = createDataForConsumptionWidgetGraph(mockMetricConsumptionData)

        expect(result.labels).toStrictEqual(mockConsumptionLabels)
        expect(result.serieValues).toStrictEqual(mockConsumptionSerieValues)
    })
})

describe('calculateTotalConsumptionAndPrice', () => {
    test('should calculate total daily consumption and price with valid inputs', () => {
        const serieValues = [100, 200, 300]
        const pricePerKwh = 2
        const result = calculateTotalConsumptionAndPrice(serieValues, pricePerKwh)

        expect(result.totalDailyConsumption).toEqual(600)
        expect(result.consumptionUnit).toEqual('Wh')
        expect(result.totalDailyPrice).toEqual(1.2)
    })

    test('should handle zero consumption values', () => {
        const serieValues = [0, 0, 0]
        const pricePerKwh = 2
        const result = calculateTotalConsumptionAndPrice(serieValues, pricePerKwh)

        expect(result.totalDailyConsumption).toEqual(0)
        expect(result.consumptionUnit).toEqual('Wh')
        expect(result.totalDailyPrice).toEqual(0)
    })

    test('should handle null pricePerKwh', () => {
        const serieValues = [390, 440, 500]
        const pricePerKwh = null
        const result = calculateTotalConsumptionAndPrice(serieValues, pricePerKwh)

        expect(result.totalDailyConsumption).toEqual(1.33)
        expect(result.consumptionUnit).toEqual('kWh')
        expect(result.totalDailyPrice).toEqual(0)
    })
})

const LINE_COLOR = '#000000'
const FILL_COLOR = '#ffffff'
const METRIC_INTERVAL = '30m'
const expectedApexChartOptions = {
    chart: {
        animations: {
            enabled: false,
        },
        fontFamily: 'inherit',
        foreColor: 'inherit',
        height: '100%',
        type: 'area',
        sparkline: {
            enabled: true,
        },
    },
    colors: [LINE_COLOR],
    fill: {
        colors: [FILL_COLOR],
        opacity: 0.5,
    },
    stroke: {
        curve: 'smooth',
    },
    tooltip: {
        followCursor: true,
        theme: 'dark',
    },
    xaxis: {
        type: 'category',
        categories: mockConsumptionLabels,
    },
}

describe('getApexChartOptions', () => {
    test('returns ApexChart options object based on lineColor, fillColor and categories parameters', () => {
        const result = getApexChartOptions(LINE_COLOR, FILL_COLOR, mockConsumptionLabels, METRIC_INTERVAL)

        expect(result).toEqual(
            expect.objectContaining({
                ...expectedApexChartOptions,
                yaxis: {
                    show: false,
                    labels: expect.objectContaining({
                        formatter: expect.any(Function),
                    }),
                },
            }),
        )
    })
})
