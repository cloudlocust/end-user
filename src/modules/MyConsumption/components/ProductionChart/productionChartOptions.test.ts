import {
    getColorTargetSeriesEchartsProductionChart,
    getNameTargetSeriesEchartsProductionChart,
    getStackTargetSeriesEchartsProductionChart,
    getTypeTargetSeriesEchartsProductionChart,
    getTargetsYAxisValueFormatters,
    getTargetYAxisIndexFromTargetName,
    getXAxisOptionEchartsProductionChart,
    getYAxisOptionEchartsProductionChart,
} from 'src/modules/MyConsumption/components/ProductionChart/productionChartOptions'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { createTheme } from '@mui/material/styles'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { productionTargetYAxisIndexEnum } from 'src/modules/MyConsumption/components/ProductionChart/ProductionChartTypes.d'
import { EChartsOption } from 'echarts-for-react'
import { TRANSPARENT_COLOR } from 'src/modules/MyConsumption/utils/myConsumptionVariables'

describe('Test echartsProductionOptions', () => {
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

    test('getColorTargetSeriesEchartsConsumptionChart, production has color', () => {
        const caseList = [
            { target: metricTargetsEnum.autoconsumption, color: '#BEECDB' },
            { target: metricTargetsEnum.totalProduction, color: '#C8D210' },
            { target: metricTargetsEnum.injectedProduction, color: '#6E9A8B' },
        ]
        caseList.forEach(({ color, target }) => {
            // Result
            const resultColor = getColorTargetSeriesEchartsProductionChart(target, theme, {
                [metricTargetsEnum.totalProduction]: [100, 200, 300],
            })

            expect(resultColor).toStrictEqual(color)
        })
    })

    test('getColorTargetSeriesEchartsConsumptionChart, production transparent', () => {
        const caseList = [
            { target: metricTargetsEnum.autoconsumption, color: '#BEECDB' },
            { target: metricTargetsEnum.totalProduction, color: TRANSPARENT_COLOR },
            { target: metricTargetsEnum.injectedProduction, color: '#6E9A8B' },
        ]
        caseList.forEach(({ color, target }) => {
            // Result
            const resultColor = getColorTargetSeriesEchartsProductionChart(target, theme, {
                [metricTargetsEnum.autoconsumption]: [100, 200, 300],
            })

            expect(resultColor).toStrictEqual(color)
        })
    })

    describe('getTargetsYAxisValueFormatters', () => {
        describe('Consumption Value Formatter', () => {
            test('Tootlip floating values', async () => {
                // Tooltip value formatter
                const totalProductionTooltipDailyValueFormatter = getTargetsYAxisValueFormatters(
                    {
                        [metricTargetsEnum.totalProduction]: [100, 200, 300],
                    },
                    PeriodEnum.DAILY,
                    false,
                )['0']
                // When tooltip value is 150 Wh, on Period daily the metrics interval is '30m', then we expect the result to be '300.00 W'
                expect(totalProductionTooltipDailyValueFormatter(150)).toBe('300.00 W')
                const totalProductionTooltipWeeklyValueFormatter = getTargetsYAxisValueFormatters(
                    {
                        [metricTargetsEnum.totalProduction]: [1_000, 2_000, 500, 3_000],
                    },
                    PeriodEnum.WEEKLY,
                    false,
                )['0']
                // When tooltip value is 800 Wh, on Period weekly with the unit of max is KWh the result to be '.80 kWh'
                expect(totalProductionTooltipWeeklyValueFormatter(800)).toBe('0.80 kWh')
            })
            test('YAxis Rounded values', async () => {
                // YAxis value formatter, value is rounded and removes duplicates.
                const totalProductionYAxisDailyValueFormatter = getTargetsYAxisValueFormatters(
                    {
                        [metricTargetsEnum.totalProduction]: [100, 200, 300],
                    },
                    PeriodEnum.DAILY,
                    true,
                )['0']
                // When yAxis value is 400 Wh, on Period daily the metrics interval is '30m', then we expect the result to be '800 W'
                expect(totalProductionYAxisDailyValueFormatter(400)).toBe('800 W')

                // When YAxis value is 10 000 Wh, on Period yearly with the unit of max is MWh the result to be '0 MWh' because rounded.
                const productionYAxisWeeklyValueFormatter = getTargetsYAxisValueFormatters(
                    {
                        [metricTargetsEnum.injectedProduction]: [100_000, 600_000, 50_000, 300_000],
                        [metricTargetsEnum.totalProduction]: [500_000, 2_000_000, 550_000, 400_000],
                    },
                    PeriodEnum.YEARLY,
                    true,
                )['0']
                expect(productionYAxisWeeklyValueFormatter(10_000)).toBe('0 MWh')
            })
            test('YAxis duplicates values', async () => {
                // Removing duplicates from yAxisLine because when rounding values it creates duplicates.
                // Echarts handles data two times and the second time the duplicates processing happens
                // REFRENCE: SEE ConsumptionValueFormatter in echartsConsumptionChartOptions function for more documentation.
                const totalProductionYAxisDuplicatesValueFormatter = getTargetsYAxisValueFormatters(
                    {
                        [metricTargetsEnum.totalProduction]: [100, 200, 300],
                    },
                    PeriodEnum.WEEKLY,
                    true,
                )['0']
                // Triggering the echarts first process.
                expect(totalProductionYAxisDuplicatesValueFormatter(1)).toBe('1 Wh')
                // Triggering the duplication handling.
                expect(totalProductionYAxisDuplicatesValueFormatter(0)).toBe('0 Wh')
                expect(totalProductionYAxisDuplicatesValueFormatter(0)).toBe(null)
                expect(totalProductionYAxisDuplicatesValueFormatter(1)).toBe('1 Wh')
                expect(totalProductionYAxisDuplicatesValueFormatter(1)).toBe(null)
            })
        })
    })

    test('getStackTargetSeriesEchartsProductionChart', () => {
        const caseList = [
            {
                target: metricTargetsEnum.injectedProduction,
                stack: 'stackProductionTargetsSeries',
            },
            {
                target: metricTargetsEnum.totalProduction,
                stack: 'stackProductionTargetsSeries',
            },
            {
                target: metricTargetsEnum.autoconsumption,
                stack: 'stackProductionTargetsSeries',
            },
        ]
        caseList.forEach(({ stack }) => {
            // Result
            const resultStack = getStackTargetSeriesEchartsProductionChart()

            expect(resultStack).toStrictEqual(stack)
        })
    })

    test('getNameTargetSeriesEchartsProductionChart', () => {
        const caseList = [
            {
                target: metricTargetsEnum.totalProduction,
                name: 'Production totale',
            },
            {
                target: metricTargetsEnum.injectedProduction,
                name: 'Electricité redistribuée sur le réseau',
            },
            {
                target: metricTargetsEnum.autoconsumption,
                name: 'Autoconsommation',
            },
        ]
        caseList.forEach(({ name, target }) => {
            // Result
            const resultName = getNameTargetSeriesEchartsProductionChart(target)

            expect(resultName).toStrictEqual(name)
        })
    })

    test('getTypeTargetSeriesEchartsProductionChart', () => {
        const areaType = {
            type: 'line',
            areaStyle: {},
        }
        const barType = {
            type: 'bar',
        }
        const caseList = [
            {
                target: metricTargetsEnum.autoconsumption,
                period: PeriodEnum.DAILY,
                type: areaType,
            },
            {
                target: metricTargetsEnum.totalProduction,
                period: PeriodEnum.DAILY,
                type: areaType,
            },

            {
                target: metricTargetsEnum.injectedProduction,
                period: PeriodEnum.DAILY,
                type: areaType,
            },

            // BAR TYPE
            {
                target: metricTargetsEnum.autoconsumption,
                period: PeriodEnum.WEEKLY,
                type: barType,
            },
            {
                target: metricTargetsEnum.totalProduction,
                period: PeriodEnum.WEEKLY,
                type: barType,
            },

            {
                target: metricTargetsEnum.injectedProduction,
                period: PeriodEnum.WEEKLY,
                type: barType,
            },
        ]
        caseList.forEach(({ period, type, target }) => {
            // Result
            const resultType = getTypeTargetSeriesEchartsProductionChart(target, period)

            expect(resultType).toStrictEqual(type)
        })
    })

    test('getTargetYAxisIndexFromTargetName', () => {
        const caseList = [
            {
                target: metricTargetsEnum.autoconsumption,
                YAxisIndex: productionTargetYAxisIndexEnum.PRODUCTION,
            },
            {
                target: metricTargetsEnum.totalProduction,
                YAxisIndex: productionTargetYAxisIndexEnum.PRODUCTION,
            },
            {
                target: metricTargetsEnum.injectedProduction,
                YAxisIndex: productionTargetYAxisIndexEnum.PRODUCTION,
            },
        ]
        caseList.forEach(({ YAxisIndex, target }) => {
            // Result
            const resultYAxisIndex = getTargetYAxisIndexFromTargetName(target)

            expect(resultYAxisIndex).toStrictEqual(YAxisIndex)
        })
    })

    describe('getXAxisOptionEchartsProductionChart different Periods', () => {
        // GMT: Sunday, 1 January 2023 01:00:00
        const FirstJanTimestamp = 1672534800000

        test('Default options', () => {
            const result = getXAxisOptionEchartsProductionChart([FirstJanTimestamp], PeriodEnum.DAILY, theme)
            expect(result).toEqual({
                xAxis: [
                    {
                        type: 'category',
                        data: ['01:00'],
                        axisLabel: {
                            hideOverlap: true,
                            formatter: expect.anything(),
                            interval: 1,
                            rotate: 30,
                        },
                        axisLine: {
                            show: true,
                            // Important to put onZero so that bar charts don't overflow with yAxis.
                            onZero: true,
                            lineStyle: {
                                color: theme.palette.primary.contrastText,
                                type: 'solid',
                                opacity: 1,
                            },
                        },

                        axisTick: {
                            alignWithLabel: true,
                        },
                        // SplitLine represents each vertical line in the grid that show an xAxisLabel value.
                        // show set to true makes visible the vertical grid lines.
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: theme.palette.primary.contrastText,
                                type: 'dashed',
                                opacity: 0.4,
                            },
                        },
                    },
                ],
            } as EChartsOption)
        })
        test('Formatter DAILY', async () => {
            // XAXIS Formatter when Daily
            const xAxisDailyOption = getXAxisOptionEchartsProductionChart([FirstJanTimestamp], PeriodEnum.DAILY, theme)
            const xAxisDaily = (xAxisDailyOption.xAxis as Array<any>)![0]
            const xAxisDailyLabel = xAxisDaily.axisLabel
            expect(xAxisDailyLabel.formatter('01:00')).toBe('01:00')
            expect(xAxisDaily.data).toEqual(['01:00'])
        })
        test('Formatter WEEKLY', async () => {
            // XAXIS Formatter when Weekly
            const xAxisWeeklyOption = getXAxisOptionEchartsProductionChart(
                [FirstJanTimestamp],
                PeriodEnum.WEEKLY,
                theme,
            )
            const xAxisWeekly = (xAxisWeeklyOption.xAxis as Array<any>)![0]
            const xAxisWeeklyLabel = xAxisWeekly.axisLabel
            expect(xAxisWeeklyLabel.formatter('Mercredi 01 Janv.')).toBe('01 janv.')
            expect(xAxisWeekly.data).toEqual(['Dim. 1 janv.'])
        })
        test('Formatter MONTHLY', async () => {
            // XAXIS Formatter when Monthly
            const xAxisMonthlyOption = getXAxisOptionEchartsProductionChart(
                [FirstJanTimestamp],
                PeriodEnum.MONTHLY,
                theme,
            )
            const xAxisMonthly = (xAxisMonthlyOption.xAxis as Array<any>)![0]
            const xAxisMonthlyLabel = xAxisMonthly.axisLabel
            expect(xAxisMonthlyLabel.formatter('Samedi 03 nove.')).toBe('03 nove.')
            expect(xAxisMonthly.data).toEqual(['Dim. 1 janv.'])
        })
        test('Formatter YEARLY', async () => {
            // XAXIS Formatter when Yearly
            const xAxisYearlyOption = getXAxisOptionEchartsProductionChart(
                [FirstJanTimestamp],
                PeriodEnum.YEARLY,
                theme,
            )
            const xAxisYearly = (xAxisYearlyOption.xAxis as Array<any>)![0]
            const xAxisYearlyLabel = xAxisYearly.axisLabel
            expect(xAxisYearlyLabel.formatter('Mars.')).toBe('Mars.')
            expect(xAxisYearly.data).toEqual(['Janv.'])
        })
    })

    test('getYAxisOptionEchartsProductionChart', () => {
        const commonOptions = {
            type: 'value',
            axisLine: {
                onZero: true,
                show: true,
                lineStyle: {
                    color: theme.palette.primary.contrastText,
                    type: 'solid',
                    opacity: 1,
                },
            },

            splitLine: {
                show: true,
                lineStyle: {
                    color: theme.palette.primary.contrastText,
                    type: 'dashed',
                    opacity: 0.4,
                },
            },
        }
        const result = getYAxisOptionEchartsProductionChart(
            { [metricTargetsEnum.totalProduction]: [100, 200, 300] },
            PeriodEnum.DAILY,
            theme,
        )
        expect(result).toEqual({
            yAxis: [
                // PRODUCTION YAXIS
                {
                    ...commonOptions,
                    show: true,
                    position: 'left',
                    axisLabel: {
                        formatter: expect.anything(),
                    },
                },
            ],
        } as EChartsOption)
    })
})
