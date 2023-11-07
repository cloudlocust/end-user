import {
    getColorTargetSeriesEchartsConsumptionChart,
    getNameTargetSeriesEchartsConsumptionChart,
    getStackTargetSeriesEchartsConsumptionChart,
    getTypeTargetSeriesEchartsConsumptionChart,
    getTargetsYAxisValueFormatters,
    getTargetYAxisIndexFromTargetName,
    getXAxisOptionEchartsConsumptionChart,
    getYAxisOptionEchartsConsumptionChart,
} from 'src/modules/MyConsumption/components/MyConsumptionChart/consumptionChartOptions'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { TRANSPARENT_COLOR } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { createTheme } from '@mui/material/styles'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { targetYAxisIndexEnum } from 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChartTypes.d'
import { EChartsOption } from 'echarts-for-react'

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
            { target: metricTargetsEnum.externalTemperature, isSolarProductionConsentOff: false, color: '#FFC200' },
            { target: metricTargetsEnum.internalTemperature, isSolarProductionConsentOff: false, color: '#BA1B1B' },
            { target: metricTargetsEnum.pMax, isSolarProductionConsentOff: false, color: '#FF7A00' },
            {
                target: metricTargetsEnum.eurosConsumption,
                isSolarProductionConsentOff: false,
                color: TRANSPARENT_COLOR,
            },
            {
                target: metricTargetsEnum.totalEurosIdleConsumption,
                isSolarProductionConsentOff: false,
                color: TRANSPARENT_COLOR,
            },
            {
                target: metricTargetsEnum.totalIdleConsumption,
                isSolarProductionConsentOff: false,
                color: TRANSPARENT_COLOR,
            },
            {
                target: metricTargetsEnum.baseEuroConsumption,
                isSolarProductionConsentOff: false,
                color: theme.palette.primary.light,
            },
            {
                target: metricTargetsEnum.totalEurosOffIdleConsumption,
                isSolarProductionConsentOff: false,
                color: theme.palette.primary.light,
            },
            {
                target: metricTargetsEnum.onlyEuroConsumption,
                isSolarProductionConsentOff: false,
                color: theme.palette.primary.light,
            },
            { target: metricTargetsEnum.autoconsumption, isSolarProductionConsentOff: false, color: '#BEECDB' },
            { target: metricTargetsEnum.idleConsumption, isSolarProductionConsentOff: false, color: '#8191B2' },
            { target: metricTargetsEnum.eurosIdleConsumption, isSolarProductionConsentOff: false, color: '#8191B2' },
            { target: metricTargetsEnum.subscriptionPrices, isSolarProductionConsentOff: false, color: '#CCDCDD' },
            { target: metricTargetsEnum.peakHourConsumption, isSolarProductionConsentOff: false, color: '#CC9121' },
            { target: metricTargetsEnum.offPeakHourConsumption, isSolarProductionConsentOff: false, color: '#CCAB1D' },
            {
                target: metricTargetsEnum.totalOffIdleConsumption,
                isSolarProductionConsentOff: false,
                color: theme.palette.secondary.main,
            },
            { target: metricTargetsEnum.consumption, isSolarProductionConsentOff: true, color: TRANSPARENT_COLOR },
            {
                target: metricTargetsEnum.consumption,
                isSolarProductionConsentOff: false,
                color: theme.palette.secondary.main,
            },
            { target: metricTargetsEnum.euroPeakHourConsumption, isSolarProductionConsentOff: false, color: '#6BCBFF' },
            { target: metricTargetsEnum.euroOffPeakConsumption, isSolarProductionConsentOff: false, color: '#BEE8FF' },
            {
                target: metricTargetsEnum.onlyConsumption,
                isSolarProductionConsentOff: false,
                color: theme.palette.secondary.main,
            },
        ]
        caseList.forEach(({ color, isSolarProductionConsentOff, target }) => {
            // Result
            const resultColor = getColorTargetSeriesEchartsConsumptionChart(target, theme, isSolarProductionConsentOff)

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
                    PeriodEnum.DAILY,
                    false,
                )['0']
                // When tooltip value is 150 Wh, on Period daily the metrics interval is '30m', then we expect the result to be '300.00 W'
                expect(consumptionTooltipDailyValueFormatter(150)).toBe('300.00 W')
                const consumptionTooltipWeeklyValueFormatter = getTargetsYAxisValueFormatters(
                    {
                        [metricTargetsEnum.consumption]: [1_000, 2_000, 500, 3_000],
                    },
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
                    PeriodEnum.YEARLY,
                    true,
                )['0']
                expect(consumptionYAxisWeeklyValueFormatter(10_000)).toBe('0 MWh')
            })
            test('YAxis duplicates values', async () => {
                // Removing duplicates from yAxisLine because when rounding values it creates duplicates.
                // Echarts handles data two times and the second time the duplicates processing happens
                // REFRENCE: SEE ConsumptionValueFormatter in echartsConsumptionChartOptions function for more documentation.
                const consumptionYAxisDuplicatesValueFormatter = getTargetsYAxisValueFormatters(
                    {
                        [metricTargetsEnum.consumption]: [100, 200, 300],
                    },
                    PeriodEnum.WEEKLY,
                    true,
                )['0']
                // Triggering the echarts first process.
                expect(consumptionYAxisDuplicatesValueFormatter(1)).toBe('1 Wh')
                // Triggering the duplication handling.
                expect(consumptionYAxisDuplicatesValueFormatter(0)).toBe('0 Wh')
                expect(consumptionYAxisDuplicatesValueFormatter(0)).toBe(null)
                expect(consumptionYAxisDuplicatesValueFormatter(1)).toBe('1 Wh')
                expect(consumptionYAxisDuplicatesValueFormatter(1)).toBe(null)
            })
        })
        test('Temperature value formatter', async () => {
            const temperatureValueFormatter = getTargetsYAxisValueFormatters({}, PeriodEnum.DAILY, false)['1']
            expect(temperatureValueFormatter(12)).toBe(`${12} °C`)
            expect(temperatureValueFormatter(undefined)).toBe(`- °C`)
        })
        test('PMax value formatter', async () => {
            const pMaxValueFormatter = getTargetsYAxisValueFormatters({}, PeriodEnum.DAILY, false)['2']
            expect(pMaxValueFormatter(1_200)).toBe(`1.20 kVA`)
            expect(pMaxValueFormatter(undefined)).toBe(`- kVA`)
        })
        test('Euros value formatter', async () => {
            // Tooltip value formatter
            const eurosValueFormatter = getTargetsYAxisValueFormatters({}, PeriodEnum.DAILY, false)['3']
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
                isSolarProductionConsentOff: false,
                stack: 'stackExternalTemperatureTargetSeries',
            },
            {
                target: metricTargetsEnum.internalTemperature,
                isSolarProductionConsentOff: false,
                stack: 'stackInternalTemperatureTargetSeries',
            },
            {
                target: metricTargetsEnum.pMax,
                isSolarProductionConsentOff: false,
                stack: 'stackPmaxTargetSeries',
            },
            {
                target: metricTargetsEnum.eurosConsumption,
                isSolarProductionConsentOff: false,
                stack: 'stackHiddenTargetsSeries',
            },
            {
                target: metricTargetsEnum.idleConsumption,
                isSolarProductionConsentOff: false,
                stack: 'stackConsumptionTargetsSeries',
            },
        ]
        caseList.forEach(({ stack, isSolarProductionConsentOff, target }) => {
            // Result
            const resultStack = getStackTargetSeriesEchartsConsumptionChart(target, theme, isSolarProductionConsentOff)

            expect(resultStack).toStrictEqual(stack)
        })
    })

    test('getNameTargetSeriesEchartsConsumptionChart', () => {
        const totalConsumptionSeriesLabel = 'Consommation totale'
        const totalEurosConsumptionSeriesLabel = 'Consommation euro totale'

        const caseList = [
            {
                target: metricTargetsEnum.externalTemperature,
                isSolarProductionConsentOff: false,
                name: 'Température Extérieure',
            },
            {
                target: metricTargetsEnum.internalTemperature,
                isSolarProductionConsentOff: false,
                name: 'Température Intérieure',
            },
            { target: metricTargetsEnum.pMax, isSolarProductionConsentOff: false, name: 'Pmax' },
            {
                target: metricTargetsEnum.eurosConsumption,
                isSolarProductionConsentOff: false,
                name: totalEurosConsumptionSeriesLabel,
            },
            {
                target: metricTargetsEnum.totalEurosIdleConsumption,
                isSolarProductionConsentOff: false,
                name: totalEurosConsumptionSeriesLabel,
            },
            {
                target: metricTargetsEnum.totalIdleConsumption,
                isSolarProductionConsentOff: false,
                name: totalConsumptionSeriesLabel,
            },
            {
                target: metricTargetsEnum.baseEuroConsumption,
                isSolarProductionConsentOff: false,
                name: 'Consommation euro de base',
            },
            {
                target: metricTargetsEnum.totalEurosOffIdleConsumption,
                isSolarProductionConsentOff: false,
                name: 'Consommation euro Hors-veille',
            },
            {
                target: metricTargetsEnum.onlyEuroConsumption,
                isSolarProductionConsentOff: false,
                name: totalEurosConsumptionSeriesLabel,
            },
            { target: metricTargetsEnum.autoconsumption, isSolarProductionConsentOff: false, name: 'Autoconsommation' },
            {
                target: metricTargetsEnum.idleConsumption,
                isSolarProductionConsentOff: false,
                name: 'Consommation de veille',
            },
            {
                target: metricTargetsEnum.eurosIdleConsumption,
                isSolarProductionConsentOff: false,
                name: 'Consommation euro de veille',
            },
            { target: metricTargetsEnum.subscriptionPrices, isSolarProductionConsentOff: false, name: 'Abonnement' },
            {
                target: metricTargetsEnum.peakHourConsumption,
                isSolarProductionConsentOff: false,
                name: 'Consommation en HP',
            },
            {
                target: metricTargetsEnum.offPeakHourConsumption,
                isSolarProductionConsentOff: false,
                name: 'Consommation en HC',
            },
            {
                target: metricTargetsEnum.totalOffIdleConsumption,
                isSolarProductionConsentOff: false,
                name: 'Consommation Hors-veille',
            },
            {
                target: metricTargetsEnum.consumption,
                isSolarProductionConsentOff: true,
                name: totalConsumptionSeriesLabel,
            },
            {
                target: metricTargetsEnum.consumption,
                isSolarProductionConsentOff: false,
                name: 'Electricité achetée sur le réseau',
            },
            {
                target: metricTargetsEnum.euroPeakHourConsumption,
                isSolarProductionConsentOff: false,
                name: 'Consommation achetée HP',
            },
            {
                target: metricTargetsEnum.euroOffPeakConsumption,
                isSolarProductionConsentOff: false,
                name: 'Consommation achetée HC',
            },
            {
                target: metricTargetsEnum.baseConsumption,
                isSolarProductionConsentOff: true,
                name: 'Consommation de base',
            },
            {
                target: metricTargetsEnum.baseConsumption,
                isSolarProductionConsentOff: false,
                name: 'Electricité achetée sur le réseau',
            },
        ]
        caseList.forEach(({ name, isSolarProductionConsentOff, target }) => {
            // Result
            const resultName = getNameTargetSeriesEchartsConsumptionChart(target, isSolarProductionConsentOff)

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
        ]
        caseList.forEach(({ YAxisIndex, target }) => {
            // Result
            const resultYAxisIndex = getTargetYAxisIndexFromTargetName(target)

            expect(resultYAxisIndex).toStrictEqual(YAxisIndex)
        })
    })

    describe('getXAxisOptionEchartsConsumptionChart different Periods', () => {
        // GMT: Sunday, 1 January 2023 01:00:00
        const FirstJanTimestamp = 1672534800000

        test('Default options', () => {
            const result = getXAxisOptionEchartsConsumptionChart([FirstJanTimestamp], true, PeriodEnum.DAILY, theme)
            expect(result).toEqual({
                xAxis: [
                    {
                        type: 'category',
                        data: ['01:00'],
                        axisLabel: {
                            hideOverlap: true,
                            formatter: expect.anything(),
                            interval: 59,
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
            const xAxisDailyOption = getXAxisOptionEchartsConsumptionChart(
                [FirstJanTimestamp],
                true,
                PeriodEnum.DAILY,
                theme,
            )
            const xAxisDaily = (xAxisDailyOption.xAxis as Array<any>)![0]
            const xAxisDailyLabel = xAxisDaily.axisLabel
            expect(xAxisDailyLabel.formatter('01:00')).toBe('01:00')
            expect(xAxisDaily.data).toEqual(['01:00'])
        })
        test('Formatter WEEKLY', async () => {
            // XAXIS Formatter when Weekly
            const xAxisWeeklyOption = getXAxisOptionEchartsConsumptionChart(
                [FirstJanTimestamp],
                true,
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
            const xAxisMonthlyOption = getXAxisOptionEchartsConsumptionChart(
                [FirstJanTimestamp],
                true,
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
            const xAxisYearlyOption = getXAxisOptionEchartsConsumptionChart(
                [FirstJanTimestamp],
                true,
                PeriodEnum.YEARLY,
                theme,
            )
            const xAxisYearly = (xAxisYearlyOption.xAxis as Array<any>)![0]
            const xAxisYearlyLabel = xAxisYearly.axisLabel
            expect(xAxisYearlyLabel.formatter('Mars.')).toBe('Mars.')
            expect(xAxisYearly.data).toEqual(['Janv.'])
        })
    })

    test('getYAxisOptionEchartsConsumptionChart', () => {
        const commonLineStyle = {
            color: theme.palette.primary.contrastText,
            type: 'dashed',
        }
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
        }
        const result = getYAxisOptionEchartsConsumptionChart(
            { [metricTargetsEnum.consumption]: [100, 200, 300] },
            PeriodEnum.DAILY,
            theme,
        )
        expect(result).toEqual({
            yAxis: [
                // CONSUMPTION YAXIS
                {
                    ...commonOptions,
                    show: true,
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
                },
                // TEMPERATURE YAXIS
                {
                    ...commonOptions,
                    show: false,
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
                },
                // PMAX YAXIS
                {
                    ...commonOptions,
                    show: false,
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
                },
                // EUROS YAXIS
                {
                    ...commonOptions,
                    show: false,
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
                },
            ],
        } as EChartsOption)
    })
})
