import {
    getColorTargetSeriesEchartsConsumptionChart,
    getColorTargetSeriesEchartsProductionChart,
    getNameTargetSeriesEchartsConsumptionChart,
    getStackTargetSeriesEchartsConsumptionChart,
    getTypeTargetSeriesEchartsConsumptionChart,
    getTargetsYAxisValueFormatters,
    getTargetYAxisIndexFromTargetName,
    getXAxisOptionEchartsConsumptionChart,
    getYAxisOptionEchartsConsumptionChart,
    getXAxisCategoriesData,
    parseXAxisLabelToDate,
} from 'src/modules/MyConsumption/components/MyConsumptionChart/consumptionChartOptions'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { TRANSPARENT_COLOR } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { createTheme } from '@mui/material/styles'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { targetYAxisIndexEnum } from 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChartTypes.d'
import { EChartsOption } from 'echarts-for-react'
import { SwitchConsumptionButtonTypeEnum } from 'src/modules/MyConsumption/components/SwitchConsumptionButton/SwitchConsumptionButton.types'

const productionDataMetrics = {
    [metricTargetsEnum.autoconsumption]: [100, 200, 300],
    [metricTargetsEnum.totalProduction]: [100, 200, 300],
    [metricTargetsEnum.injectedProduction]: [100, 200, 300],
}

describe('Test echartsConsumptionOptions', () => {
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

    test('getColorTargetSeriesEchartsConsumptionChart', () => {
        const caseList = [
            { target: metricTargetsEnum.externalTemperature, color: '#FFC200' },
            { target: metricTargetsEnum.internalTemperature, color: '#BA1B1B' },
            { target: metricTargetsEnum.pMax, color: '#FF7A00' },
            {
                target: metricTargetsEnum.eurosConsumption,

                color: TRANSPARENT_COLOR,
            },
            {
                target: metricTargetsEnum.totalEurosIdleConsumption,

                color: TRANSPARENT_COLOR,
            },
            {
                target: metricTargetsEnum.totalIdleConsumption,

                color: TRANSPARENT_COLOR,
            },
            {
                target: metricTargetsEnum.baseEuroConsumption,

                color: theme.palette.primary.light,
            },
            {
                target: metricTargetsEnum.totalEurosOffIdleConsumption,

                color: theme.palette.primary.light,
            },
            {
                target: metricTargetsEnum.onlyEuroConsumption,

                color: theme.palette.primary.light,
            },
            { target: metricTargetsEnum.autoconsumption, color: '#FFC200' },
            { target: metricTargetsEnum.idleConsumption, color: '#8191B2' },
            { target: metricTargetsEnum.eurosIdleConsumption, color: '#8191B2' },
            { target: metricTargetsEnum.subscriptionPrices, color: '#CCDCDD' },
            { target: metricTargetsEnum.peakHourConsumption, color: '#039DE0' },
            { target: metricTargetsEnum.offPeakHourConsumption, color: '#9BE1FD' },
            {
                target: metricTargetsEnum.totalOffIdleConsumption,

                color: theme.palette.secondary.main,
            },
            { target: metricTargetsEnum.consumption, color: '#19A5AF' },
            { target: metricTargetsEnum.euroPeakHourConsumption, color: '#6BCBFF' },
            { target: metricTargetsEnum.euroOffPeakConsumption, color: '#BEE8FF' },
            {
                target: metricTargetsEnum.onlyConsumption,

                color: theme.palette.secondary.main,
            },
        ]
        caseList.forEach(({ color, target }) => {
            // Result
            const resultColor = getColorTargetSeriesEchartsConsumptionChart(
                target,
                theme,
                SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction,
            )

            expect(resultColor).toStrictEqual(color)
        })
    })

    test('getColorTargetSeriesEchartsConsumptionChart, production has color', () => {
        const caseList = [
            { target: metricTargetsEnum.autoconsumption, color: '#FFC200' },
            { target: metricTargetsEnum.totalProduction, color: '#C8D210' },
            { target: metricTargetsEnum.injectedProduction, color: '#4DD9E4' },
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
            { target: metricTargetsEnum.autoconsumption, color: '#FFC200' },
            { target: metricTargetsEnum.totalProduction, color: TRANSPARENT_COLOR },
            { target: metricTargetsEnum.injectedProduction, color: '#4DD9E4' },
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
                const consumptionTooltipDailyValueFormatter = getTargetsYAxisValueFormatters(
                    {
                        [metricTargetsEnum.consumption]: [100, 200, 300],
                    },
                    {},
                    PeriodEnum.DAILY,
                    false,
                )['0']
                // When tooltip value is 150 Wh, on Period daily the metrics interval is '30m', then we expect the result to be '300.00 W'
                expect(consumptionTooltipDailyValueFormatter(150)).toBe('300.00 W')
                const consumptionTooltipWeeklyValueFormatter = getTargetsYAxisValueFormatters(
                    {
                        [metricTargetsEnum.consumption]: [1_000, 2_000, 500, 3_000],
                    },
                    {},
                    PeriodEnum.WEEKLY,
                    false,
                )['0']
                // When tooltip value is 800 Wh, on Period weekly with the unit of max is KWh the result to be '.80 kWh'
                expect(consumptionTooltipWeeklyValueFormatter(800)).toBe('0.80 kWh')
            })
            test('YAxis Rounded values', async () => {
                // YAxis value formatter, value is rounded and removes duplicates.
                const consumptionYAxisDailyValueFormatter = getTargetsYAxisValueFormatters(
                    {
                        [metricTargetsEnum.consumption]: [100, 200, 300],
                    },
                    {},
                    PeriodEnum.DAILY,
                    true,
                )['0']
                // When yAxis value is 400 Wh, on Period daily the metrics interval is '30m', then we expect the result to be '800 W'
                expect(consumptionYAxisDailyValueFormatter(400)).toBe('800 W')

                // When YAxis value is 10 000 Wh, on Period yearly with the unit of max is MWh the result to be '0 MWh' because rounded.
                const consumptionYAxisWeeklyValueFormatter = getTargetsYAxisValueFormatters(
                    {
                        [metricTargetsEnum.consumption]: [100_000, 600_000, 50_000, 300_000],
                        [metricTargetsEnum.baseConsumption]: [500_000, 2_000_000, 550_000, 400_000],
                    },
                    {},
                    PeriodEnum.YEARLY,
                    true,
                )['0']
                expect(consumptionYAxisWeeklyValueFormatter(10_000)).toBe('0 MWh')
            })

            test('Tootlip floating values of production', async () => {
                // Tooltip value formatter
                const totalProductionTooltipDailyValueFormatter = getTargetsYAxisValueFormatters(
                    {
                        [metricTargetsEnum.autoconsumption]: [100, 200, 300],
                    },
                    {
                        [metricTargetsEnum.totalProduction]: [100, 200, 300],
                    },
                    PeriodEnum.DAILY,
                    false,
                )[targetYAxisIndexEnum.PRODUCTION]
                // When tooltip value is 150 Wh, on Period daily the metrics interval is '30m', then we expect the result to be '300.00 W'
                expect(totalProductionTooltipDailyValueFormatter(150)).toBe('300.00 W')
                const totalProductionTooltipWeeklyValueFormatter = getTargetsYAxisValueFormatters(
                    {
                        [metricTargetsEnum.autoconsumption]: [100, 200, 300],
                    },
                    {
                        [metricTargetsEnum.totalProduction]: [1_000, 2_000, 500, 3_000],
                    },
                    PeriodEnum.WEEKLY,
                    false,
                )[targetYAxisIndexEnum.PRODUCTION]
                // When tooltip value is 800 Wh, on Period weekly with the unit of max is KWh the result to be '.80 kWh'
                expect(totalProductionTooltipWeeklyValueFormatter(800)).toBe('0.80 kWh')
            })
            test('YAxis Rounded values of production', async () => {
                // YAxis value formatter, value is rounded and removes duplicates.
                const totalProductionYAxisDailyValueFormatter = getTargetsYAxisValueFormatters(
                    {
                        [metricTargetsEnum.autoconsumption]: [100, 200, 300],
                    },
                    {
                        [metricTargetsEnum.totalProduction]: [100, 200, 300],
                    },
                    PeriodEnum.DAILY,
                    true,
                )[targetYAxisIndexEnum.PRODUCTION]
                // When yAxis value is 400 Wh, on Period daily the metrics interval is '30m', then we expect the result to be '800 W'
                expect(totalProductionYAxisDailyValueFormatter(400)).toBe('800 W')

                // When YAxis value is 10 000 Wh, on Period yearly with the unit of max is MWh the result to be '0 MWh' because rounded.
                const productionYAxisWeeklyValueFormatter = getTargetsYAxisValueFormatters(
                    {
                        [metricTargetsEnum.autoconsumption]: [100, 200, 300],
                    },
                    {
                        [metricTargetsEnum.injectedProduction]: [100_000, 600_000, 50_000, 300_000],
                        [metricTargetsEnum.totalProduction]: [500_000, 2_000_000, 550_000, 400_000],
                    },
                    PeriodEnum.YEARLY,
                    true,
                )[targetYAxisIndexEnum.PRODUCTION]
                expect(productionYAxisWeeklyValueFormatter(10_000)).toBe('0 MWh')
            })
            test('YAxis duplicates values', async () => {
                // Removing duplicates from yAxisLine because when rounding values it creates duplicates.
                // Echarts handles data two times and the second time the duplicates processing happens
                // REFRENCE: SEE ConsumptionValueFormatter in echartsConsumptionChartOptions function for more documentation.
                const totalProductionYAxisDuplicatesValueFormatter = getTargetsYAxisValueFormatters(
                    {
                        [metricTargetsEnum.autoconsumption]: [100, 200, 300],
                    },
                    {
                        [metricTargetsEnum.totalProduction]: [100, 200, 300],
                    },
                    PeriodEnum.WEEKLY,
                    true,
                )[targetYAxisIndexEnum.PRODUCTION]
                // Triggering the echarts first process.
                expect(totalProductionYAxisDuplicatesValueFormatter(1)).toBe('1 Wh')
                // Triggering the duplication handling.
                expect(totalProductionYAxisDuplicatesValueFormatter(0)).toBe('0 Wh')
                expect(totalProductionYAxisDuplicatesValueFormatter(0)).toBe(null)
                expect(totalProductionYAxisDuplicatesValueFormatter(1)).toBe('1 Wh')
                expect(totalProductionYAxisDuplicatesValueFormatter(1)).toBe(null)
            })

            // This test is related to the commented code in the component.
            // test('YAxis duplicates values', async () => {
            //     // Removing duplicates from yAxisLine because when rounding values it creates duplicates.
            //     // Echarts handles data two times and the second time the duplicates processing happens
            //     // REFRENCE: SEE ConsumptionValueFormatter in echartsConsumptionChartOptions function for more documentation.
            //     const consumptionYAxisDuplicatesValueFormatter = getTargetsYAxisValueFormatters(
            //         {
            //             [metricTargetsEnum.consumption]: [100, 200, 300],
            //         },
            //         PeriodEnum.WEEKLY,
            //         true,
            //     )['0']
            //     // Triggering the echarts first process.
            //     expect(consumptionYAxisDuplicatesValueFormatter(1)).toBe('1 Wh')
            //     // Triggering the duplication handling.
            //     expect(consumptionYAxisDuplicatesValueFormatter(0)).toBe('0 Wh')
            //     expect(consumptionYAxisDuplicatesValueFormatter(0)).toBe(null)
            //     expect(consumptionYAxisDuplicatesValueFormatter(1)).toBe('1 Wh')
            //     expect(consumptionYAxisDuplicatesValueFormatter(1)).toBe(null)
            // })
        })
        test('Temperature value formatter', async () => {
            const temperatureValueFormatter = getTargetsYAxisValueFormatters({}, {}, PeriodEnum.DAILY, false)['1']
            expect(temperatureValueFormatter(12)).toBe(`${12} °C`)
            expect(temperatureValueFormatter(undefined)).toBe(`- °C`)
        })
        test('PMax value formatter', async () => {
            const pMaxValueFormatter = getTargetsYAxisValueFormatters({}, {}, PeriodEnum.DAILY, false)['2']
            expect(pMaxValueFormatter(1_200)).toBe(`1.20 kVA`)
            expect(pMaxValueFormatter(undefined)).toBe(`- kVA`)
        })
        test('Euros value formatter', async () => {
            // Tooltip value formatter
            const eurosValueFormatter = getTargetsYAxisValueFormatters({}, {}, PeriodEnum.DAILY, false)['3']
            /**
             * PMAX TEST.
             */
            // When Internal temperature it'll show the value given in Watt.
            expect(eurosValueFormatter(12.5)).toBe(`12.50 €`)
            expect(eurosValueFormatter(undefined)).toBe(`- €`)
        })
    })

    test('getStackTargetSeriesEchartsConsumptionChart', () => {
        const caseList = [
            {
                target: metricTargetsEnum.externalTemperature,
                stack: 'stackExternalTemperatureTargetSeries',
            },
            {
                target: metricTargetsEnum.internalTemperature,
                stack: 'stackInternalTemperatureTargetSeries',
            },
            {
                target: metricTargetsEnum.pMax,
                stack: 'stackPmaxTargetSeries',
            },
            {
                target: metricTargetsEnum.eurosConsumption,
                stack: 'stackHiddenTargetsSeries',
            },
            {
                target: metricTargetsEnum.idleConsumption,
                stack: 'stackConsumptionTargetsSeries',
            },
        ]
        caseList.forEach(({ stack, target }) => {
            // Result
            const resultStack = getStackTargetSeriesEchartsConsumptionChart(target, theme)

            expect(resultStack).toStrictEqual(stack)
        })
    })

    test('getNameTargetSeriesEchartsConsumptionChart', () => {
        const totalConsumptionSeriesLabel = 'Consommation totale'
        const totalEurosConsumptionSeriesLabel = 'Consommation euro totale'

        const caseList = [
            {
                target: metricTargetsEnum.externalTemperature,
                name: 'Température Extérieure',
            },
            {
                target: metricTargetsEnum.internalTemperature,
                name: 'Température Intérieure',
            },
            { target: metricTargetsEnum.pMax, name: 'Pmax' },
            {
                target: metricTargetsEnum.eurosConsumption,
                name: totalEurosConsumptionSeriesLabel,
            },
            {
                target: metricTargetsEnum.totalEurosIdleConsumption,
                name: totalEurosConsumptionSeriesLabel,
            },
            {
                target: metricTargetsEnum.totalIdleConsumption,
                name: totalConsumptionSeriesLabel,
            },
            {
                target: metricTargetsEnum.baseEuroConsumption,
                switchButtonType: SwitchConsumptionButtonTypeEnum.Consumption,
                name: 'Consommation euro de base',
            },
            {
                target: metricTargetsEnum.totalEurosOffIdleConsumption,
                name: 'Consommation euro Hors-veille',
            },
            {
                target: metricTargetsEnum.onlyEuroConsumption,
                name: totalEurosConsumptionSeriesLabel,
            },
            {
                target: metricTargetsEnum.autoconsumption,
                switchButtonType: SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction,
                name: 'Autoconsommation',
            },
            {
                target: metricTargetsEnum.idleConsumption,
                name: 'Consommation de veille',
            },
            {
                target: metricTargetsEnum.eurosIdleConsumption,
                name: 'Consommation euro de veille',
            },
            {
                target: metricTargetsEnum.subscriptionPrices,
                name: 'Abonnement',
            },
            {
                target: metricTargetsEnum.peakHourConsumption,
                switchButtonType: SwitchConsumptionButtonTypeEnum.Consumption,
                name: 'Consommation en HP',
            },
            {
                target: metricTargetsEnum.offPeakHourConsumption,
                switchButtonType: SwitchConsumptionButtonTypeEnum.Consumption,
                name: 'Consommation en HC',
            },
            {
                target: metricTargetsEnum.totalOffIdleConsumption,
                name: 'Consommation Hors-veille',
            },
            {
                target: metricTargetsEnum.consumption,
                switchButtonType: SwitchConsumptionButtonTypeEnum.Consumption,
                name: totalConsumptionSeriesLabel,
            },
            {
                target: metricTargetsEnum.consumption,
                switchButtonType: SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction,
                name: 'Electricité achetée sur le réseau',
            },
            {
                target: metricTargetsEnum.euroPeakHourConsumption,
                name: 'Consommation achetée HP',
            },
            {
                target: metricTargetsEnum.euroOffPeakConsumption,
                name: 'Consommation achetée HC',
            },
            {
                target: metricTargetsEnum.baseConsumption,
                switchButtonType: SwitchConsumptionButtonTypeEnum.Consumption,
                name: 'Consommation de base',
            },
            {
                target: metricTargetsEnum.baseConsumption,
                switchButtonType: SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction,
                name: 'Electricité achetée sur le réseau',
            },
            {
                target: metricTargetsEnum.totalProduction,
                name: 'Production totale',
            },
            {
                target: metricTargetsEnum.injectedProduction,
                name: 'Electricité redistribuée sur le réseau',
            },
        ]
        caseList.forEach(({ name, switchButtonType, target }) => {
            // Result
            const resultName = getNameTargetSeriesEchartsConsumptionChart(target, switchButtonType)

            expect(resultName).toStrictEqual(name)
        })
    })

    test('getTypeTargetSeriesEchartsConsumptionChart', () => {
        const areaType = {
            type: 'line',
            areaStyle: {},
        }
        const barType = {
            type: 'bar',
        }
        const lineType = {
            type: 'line',
        }
        const caseList = [
            {
                target: metricTargetsEnum.externalTemperature,
                period: PeriodEnum.DAILY,
                type: lineType,
            },
            {
                target: metricTargetsEnum.internalTemperature,
                period: PeriodEnum.DAILY,
                type: lineType,
            },

            {
                target: metricTargetsEnum.pMax,
                period: PeriodEnum.DAILY,
                type: lineType,
            },

            // AREA TYPE
            {
                target: metricTargetsEnum.consumption,
                period: PeriodEnum.DAILY,
                type: areaType,
            },
            {
                target: metricTargetsEnum.baseConsumption,
                period: PeriodEnum.DAILY,
                type: areaType,
            },

            {
                target: metricTargetsEnum.onlyConsumption,
                period: PeriodEnum.DAILY,
                type: areaType,
            },
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
            {
                target: metricTargetsEnum.peakHourConsumption,
                period: PeriodEnum.DAILY,
                type: areaType,
            },
            {
                target: metricTargetsEnum.offPeakHourConsumption,
                period: PeriodEnum.DAILY,
                type: areaType,
            },
            // BAR TYPE
            {
                target: metricTargetsEnum.consumption,
                period: PeriodEnum.YEARLY,
                type: barType,
            },
            {
                target: metricTargetsEnum.baseConsumption,
                period: PeriodEnum.YEARLY,
                type: barType,
            },

            {
                target: metricTargetsEnum.onlyConsumption,
                period: PeriodEnum.YEARLY,
                type: barType,
            },
            {
                target: metricTargetsEnum.autoconsumption,
                period: PeriodEnum.YEARLY,
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
            {
                target: metricTargetsEnum.peakHourConsumption,
                period: PeriodEnum.YEARLY,
                type: barType,
            },
            {
                target: metricTargetsEnum.offPeakHourConsumption,
                period: PeriodEnum.YEARLY,
                type: barType,
            },
            {
                target: metricTargetsEnum.idleConsumption,
                period: PeriodEnum.WEEKLY,
                type: barType,
            },
        ]
        caseList.forEach(({ period, type, target }) => {
            // Result
            const resultType = getTypeTargetSeriesEchartsConsumptionChart(target, period)

            expect(resultType).toStrictEqual(type)
        })
    })

    test('getTargetYAxisIndexFromTargetName', () => {
        const caseList = [
            // TEMPERATURE
            { target: metricTargetsEnum.externalTemperature, YAxisIndex: targetYAxisIndexEnum.TEMPERATURE },
            { target: metricTargetsEnum.internalTemperature, YAxisIndex: targetYAxisIndexEnum.TEMPERATURE },
            // PMAX
            { target: metricTargetsEnum.pMax, YAxisIndex: targetYAxisIndexEnum.PMAX },
            // EUROS
            {
                target: metricTargetsEnum.eurosConsumption,
                YAxisIndex: targetYAxisIndexEnum.EUROS,
            },
            {
                target: metricTargetsEnum.totalEurosIdleConsumption,
                YAxisIndex: targetYAxisIndexEnum.EUROS,
            },
            {
                target: metricTargetsEnum.baseEuroConsumption,
                YAxisIndex: targetYAxisIndexEnum.EUROS,
            },
            {
                target: metricTargetsEnum.totalEurosOffIdleConsumption,
                YAxisIndex: targetYAxisIndexEnum.EUROS,
            },
            {
                target: metricTargetsEnum.onlyEuroConsumption,
                YAxisIndex: targetYAxisIndexEnum.EUROS,
            },
            { target: metricTargetsEnum.eurosIdleConsumption, YAxisIndex: targetYAxisIndexEnum.EUROS },
            { target: metricTargetsEnum.subscriptionPrices, YAxisIndex: targetYAxisIndexEnum.EUROS },
            { target: metricTargetsEnum.euroPeakHourConsumption, YAxisIndex: targetYAxisIndexEnum.EUROS },
            { target: metricTargetsEnum.euroOffPeakConsumption, YAxisIndex: targetYAxisIndexEnum.EUROS },

            // CONSUMPTION
            {
                target: metricTargetsEnum.totalIdleConsumption,
                YAxisIndex: targetYAxisIndexEnum.CONSUMPTION,
            },
            {
                target: metricTargetsEnum.autoconsumption,
                YAxisIndex: targetYAxisIndexEnum.CONSUMPTION,
            },
            { target: metricTargetsEnum.idleConsumption, YAxisIndex: targetYAxisIndexEnum.CONSUMPTION },
            { target: metricTargetsEnum.peakHourConsumption, YAxisIndex: targetYAxisIndexEnum.CONSUMPTION },
            { target: metricTargetsEnum.offPeakHourConsumption, YAxisIndex: targetYAxisIndexEnum.CONSUMPTION },
            {
                target: metricTargetsEnum.totalOffIdleConsumption,
                YAxisIndex: targetYAxisIndexEnum.CONSUMPTION,
            },
            {
                target: metricTargetsEnum.consumption,
                YAxisIndex: targetYAxisIndexEnum.CONSUMPTION,
            },
            {
                target: metricTargetsEnum.onlyConsumption,
                YAxisIndex: targetYAxisIndexEnum.CONSUMPTION,
            },
            // PRODUCTION
            {
                target: metricTargetsEnum.totalProduction,
                YAxisIndex: targetYAxisIndexEnum.PRODUCTION,
            },
            {
                target: metricTargetsEnum.injectedProduction,
                YAxisIndex: targetYAxisIndexEnum.PRODUCTION,
            },
        ]
        caseList.forEach(({ YAxisIndex, target }) => {
            // Result
            const resultYAxisIndex = getTargetYAxisIndexFromTargetName(target)

            expect(resultYAxisIndex).toStrictEqual(YAxisIndex)
        })
    })

    describe('parseXAxisLabelToDate', () => {
        // Define constants for testing
        const mockRange = { from: '2023-01-01T00:00:00Z', to: '2024-01-01T00:00:00Z' }
        const dateFormatPattern = 'DD-MM-YYYY HH:mm'
        // Happy path tests with various realistic test values
        test('should parse daily period with hours and minutes', () => {
            const partialDateString = '14:30'
            const period = PeriodEnum.DAILY
            const result = parseXAxisLabelToDate(partialDateString, period, mockRange)
            expect(result.format(dateFormatPattern)).toBe('01-01-2023 14:30')
        })

        test('should parse yearly period with month string', () => {
            const partialDateString = 'Mars'
            const period = PeriodEnum.YEARLY
            const result = parseXAxisLabelToDate(partialDateString, period, mockRange)
            expect(result.format(dateFormatPattern)).toBe('01-03-2023 00:00')
        })

        test.each(['weekly', 'monthly'])('should parse $period period.', (period) => {
            const partialDateString = 'Mer. 15 mars'
            const result = parseXAxisLabelToDate(partialDateString, period as PeriodEnum, mockRange)
            expect(result.format(dateFormatPattern)).toBe('15-03-2023 00:00')
        })
    })

    describe('getXAxisOptionEchartsConsumptionChart different Periods', () => {
        // GMT: Sunday, 1 January 2023 01:00:00
        const FirstJanTimetamp = 1672534800000
        const FirstJanData = getXAxisCategoriesData([FirstJanTimetamp], PeriodEnum.DAILY)
        let isProductionView = false
        test('should return options consumption curve if the production metrics data does not exist', () => {
            const result = getXAxisOptionEchartsConsumptionChart(
                FirstJanData,
                SwitchConsumptionButtonTypeEnum.Consumption,
                PeriodEnum.DAILY,
                theme.palette.primary.contrastText,
                isProductionView,
                theme,
            )
            expect(result).toEqual({
                xAxis: [
                    {
                        type: 'category',
                        data: ['01:00'],
                        gridIndex: 0,
                        position: 'bottom',
                        show: true,
                        axisLabel: {
                            hideOverlap: true,
                            formatter: expect.anything(),
                            interval: 59,
                            rotate: 30,
                            show: true,
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
                            show: true,
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
        test('should return options for two curve (consumption and production) if the production metrics data exist', () => {
            isProductionView = true
            const result = getXAxisOptionEchartsConsumptionChart(
                FirstJanData,
                SwitchConsumptionButtonTypeEnum.Consumption,
                PeriodEnum.DAILY,
                theme.palette.primary.contrastText,
                isProductionView,
                theme,
            )
            const commonXAxisOptions = {
                type: 'category',
                data: ['01:00'],
                axisLabel: {
                    hideOverlap: true,
                    rotate: 30,
                    formatter: expect.anything(),
                },
                axisLine: {
                    show: true,
                    onZero: true,
                    lineStyle: {
                        type: 'solid',
                        opacity: 1,
                    },
                },
                axisTick: {
                    alignWithLabel: true,
                    show: true,
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        opacity: 0.4,
                    },
                },
            }
            expect(result).toEqual({
                xAxis: [
                    {
                        ...commonXAxisOptions,
                        axisLabel: {
                            ...commonXAxisOptions.axisLabel,
                            interval: 59,
                            show: false,
                        },
                        axisLine: {
                            ...commonXAxisOptions.axisLine,
                            lineStyle: {
                                ...commonXAxisOptions.axisLine.lineStyle,
                                color: theme.palette.primary.contrastText,
                            },
                        },
                        splitLine: {
                            ...commonXAxisOptions.splitLine,
                            lineStyle: {
                                ...commonXAxisOptions.splitLine.lineStyle,
                                color: theme.palette.primary.contrastText,
                            },
                        },
                        show: true,
                        gridIndex: 0,
                        position: 'top',
                    },
                    {
                        ...commonXAxisOptions,
                        axisLabel: {
                            ...commonXAxisOptions.axisLabel,
                            interval: 1,
                        },
                        axisLine: {
                            ...commonXAxisOptions.axisLine,
                            lineStyle: {
                                ...commonXAxisOptions.axisLine.lineStyle,
                                color: theme.palette.common.black,
                            },
                        },
                        splitLine: {
                            ...commonXAxisOptions.splitLine,
                            lineStyle: {
                                ...commonXAxisOptions.splitLine.lineStyle,
                                color: theme.palette.common.black,
                            },
                        },
                        gridIndex: 1,
                        position: 'bottom',
                    },
                ],
            } as EChartsOption)
        })

        test.each`
            period       | data                | labelValue             | formattedLabel
            ${'daily'}   | ${['01:00']}        | ${'01:00'}             | ${'01:00'}
            ${'weekly'}  | ${['Dim. 1 janv.']} | ${'Mercredi 01 Janv.'} | ${'01 janv.'}
            ${'monthly'} | ${['Dim. 1 janv.']} | ${'Samedi 03 nove.'}   | ${'03 nove.'}
            ${'yearly'}  | ${['Janv.']}        | ${'Mars.'}             | ${'Mars.'}
        `(
            'should return the correct $period formatter for consumption and production curves',
            async ({ period, data, labelValue, formattedLabel }) => {
                const FirstJanData = getXAxisCategoriesData([FirstJanTimetamp], period)
                const xAxisOptions = getXAxisOptionEchartsConsumptionChart(
                    FirstJanData,
                    SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction,
                    period,
                    theme.palette.primary.contrastText,
                    isProductionView,
                    theme,
                )
                // 0 is the consumption xAxis and 1 is the production xAxis
                ;[0, 1].forEach((xAxisIndex) => {
                    const xAxis = (xAxisOptions.xAxis as Array<any>)![xAxisIndex]
                    const xAxisYearlyLabel = xAxis.axisLabel
                    expect(xAxisYearlyLabel.formatter(labelValue)).toBe(formattedLabel)
                    expect(xAxis.data).toEqual(data)
                })
            },
        )
    })
    describe('getYAxisOptionEchartsConsumptionChart different Periods', () => {
        let isProductionView = false
        test('should return options consumption curve if the production metrics data does not exist', () => {
            const commonLineStyle = {
                color: theme.palette.primary.contrastText,
                type: 'dashed',
            }
            const commonOptions = {
                type: 'value',
                axisLine: {
                    axisLabel: {
                        show: true,
                    },
                    onZero: true,
                    show: true,
                    lineStyle: {
                        color: theme.palette.primary.contrastText,
                        type: 'solid',
                        opacity: 1,
                    },
                },
            }
            const result = getYAxisOptionEchartsConsumptionChart(
                { [metricTargetsEnum.consumption]: [100, 200, 300] },
                {},
                PeriodEnum.DAILY,
                theme.palette.primary.contrastText, // axis Color
                isProductionView,
                theme,
            )
            expect(result).toEqual({
                yAxis: [
                    // CONSUMPTION YAXIS
                    {
                        ...commonOptions,
                        show: true,
                        onZero: true,
                        scale: true,
                        position: 'left',
                        axisLabel: {
                            formatter: expect.anything(),
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                ...commonLineStyle,
                                opacity: 0.4,
                            },
                        },
                        min: 0,
                    },
                    // TEMPERATURE YAXIS
                    {
                        ...commonOptions,
                        show: false,
                        scale: true,
                        onZero: true,
                        position: 'right',
                        axisLabel: {
                            formatter: expect.anything(),
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                ...commonLineStyle,
                                opacity: 0,
                            },
                        },
                        min: 0,
                    },
                    // PMAX YAXIS
                    {
                        ...commonOptions,
                        show: false,
                        scale: true,
                        onZero: true,
                        position: 'right',
                        axisLabel: {
                            formatter: expect.anything(),
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                ...commonLineStyle,
                                opacity: 0,
                            },
                        },
                        min: 0,
                    },
                    // EUROS YAXIS
                    {
                        ...commonOptions,
                        show: false,
                        scale: true,
                        onZero: true,
                        position: 'left',
                        axisLabel: {
                            formatter: expect.anything(),
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                ...commonLineStyle,
                                opacity: 0.4,
                            },
                        },
                        min: 0,
                    },
                ],
            } as EChartsOption)
        })
        test('should return options for two curve (consumption and production) if the production metrics data exist', () => {
            isProductionView = true
            const result = getYAxisOptionEchartsConsumptionChart(
                { [metricTargetsEnum.consumption]: [100, 200, 300] },
                productionDataMetrics,
                PeriodEnum.DAILY,
                theme.palette.primary.contrastText, // axis Color
                isProductionView,
                theme,
            )

            const commonYAxisOptions = {
                type: 'value',
                onZero: true,
                min: 0,
                max: 900,
                scale: true,
                axisLabel: {
                    formatter: expect.anything(),
                },
                axisLine: {
                    onZero: true,
                    show: true,
                    axisLabel: {
                        show: true,
                    },
                    lineStyle: {
                        color: theme.palette.primary.contrastText,
                        type: 'solid',
                        opacity: 1,
                    },
                },
                show: true,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: theme.palette.common.black,
                        type: 'dashed',
                    },
                },
            }

            expect(result).toEqual({
                yAxis: [
                    // CONSUMPTION YAXIS
                    {
                        ...commonYAxisOptions,
                        position: 'left',
                        axisLabel: {
                            formatter: expect.anything(),
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: theme.palette.primary.contrastText,
                                type: 'dashed',
                                opacity: 0.4,
                            },
                        },
                    },
                    // TEMPERATURE YAXIS
                    {
                        ...commonYAxisOptions,
                        show: false,
                        position: 'right',
                        axisLabel: {
                            formatter: expect.anything(),
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: theme.palette.primary.contrastText,
                                type: 'dashed',
                                opacity: 0,
                            },
                        },
                    },
                    // PMAX YAXIS
                    {
                        ...commonYAxisOptions,
                        show: false,
                        position: 'right',
                        axisLabel: {
                            formatter: expect.anything(),
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: theme.palette.primary.contrastText,
                                type: 'dashed',
                                opacity: 0,
                            },
                        },
                    },
                    // EUROS YAXIS
                    {
                        ...commonYAxisOptions,
                        show: false,
                        position: 'left',
                        axisLabel: {
                            formatter: expect.anything(),
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: theme.palette.primary.contrastText,
                                type: 'dashed',
                                opacity: 0.4,
                            },
                        },
                    },
                    // PRODUCTION YAXIS
                    {
                        ...commonYAxisOptions,
                        axisLine: {
                            ...commonYAxisOptions.axisLine,
                            lineStyle: {
                                ...commonYAxisOptions.axisLine.lineStyle,
                                color: theme.palette.common.black,
                            },
                        },
                        // label position
                        position: 'left',
                        splitLine: {
                            ...commonYAxisOptions.splitLine,
                            lineStyle: {
                                ...commonYAxisOptions.splitLine.lineStyle,
                                color: theme.palette.common.black,
                                opacity: 0.4,
                            },
                        },
                        gridIndex: 1,
                        inverse: true,
                    },
                ],
            } as EChartsOption)
        })
    })
})
