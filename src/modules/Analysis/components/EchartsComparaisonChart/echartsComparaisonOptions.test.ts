import {
    getColorTargetSeriesEchartsComparaisonChart,
    getNameTargetSeriesEchartsComparaisonChart,
    getStackTargetSeriesEchartsComparaisonChart,
    getTargetYAxisIndexFromTargetName,
    getValuesWithTargetForComparaison,
    getXAxisOptionEchartsComparaisonChart,
    getYAxisOptionEchartsComparaisonChart,
} from 'src/modules/Analysis/components/EchartsComparaisonChart/echartsComparaisonChartOptions'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { createTheme } from '@mui/material/styles'
import {
    comparaisonTargetYAxisIndexEnum,
    CustomTargetsForComparaisonEnum,
    metricTargetExtendedWithComparaisonType,
} from 'src/modules/Analysis/components/EchartsComparaisonChart/EchartsComparaisonChartTypes.d'
import { EChartsOption } from 'echarts-for-react'
import { round } from 'lodash'

describe('Test echartsComparaisonOptions', () => {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#FFEECD',
            },
            secondary: {
                main: '#6E9A8B',
                light: '#C8D210',
            },
        },
    })

    test('getColorTargetSeriesEchartsComparaisonChart', () => {
        const caseList = [
            { target: metricTargetsEnum.consumption, color: '#6E9A8B' },
            { target: CustomTargetsForComparaisonEnum.averageAdemeConsumption, color: '#C8D210' },
        ]
        caseList.forEach(({ color, target }) => {
            // Result
            const resultColor = getColorTargetSeriesEchartsComparaisonChart(
                target as metricTargetExtendedWithComparaisonType,
                theme,
            )

            expect(resultColor).toStrictEqual(color)
        })
    })

    test('getValuesWithTargetForComparaison', () => {
        // just quick mock of IMetric[] data to test this function
        const data = [
            {
                target: 'my_consumption_metrics',
                datapoints: [[490]],
            },
        ]

        let result = getValuesWithTargetForComparaison(data as IMetric[])

        expect(result).toEqual({
            my_consumption_metrics: [490],
            average_ademe_consumption: [round(4792 / 12) * 1000],
        })
    })

    test('getStackTargetSeriesEchartsComparaisonChart', () => {
        const caseList = [
            {
                target: metricTargetsEnum.consumption,
                stack: 'stackConsumptionTargetsSeries',
            },
            {
                target: CustomTargetsForComparaisonEnum.averageAdemeConsumption,
                stack: 'stackADEMETargetsSeries',
            },
        ]
        caseList.forEach(({ target, stack }) => {
            // Result
            const resultStack = getStackTargetSeriesEchartsComparaisonChart(
                target as metricTargetExtendedWithComparaisonType,
            )

            expect(resultStack).toStrictEqual(stack)
        })
    })

    test('getNameTargetSeriesEchartsComparaisonChart', () => {
        const caseList = [
            {
                target: metricTargetsEnum.consumption,
                name: 'Ma consommation',
            },
            {
                target: CustomTargetsForComparaisonEnum.averageAdemeConsumption,
                name: 'Consommation moyenne ADEME',
            },
        ]
        caseList.forEach(({ name, target }) => {
            // Result
            const resultName = getNameTargetSeriesEchartsComparaisonChart(
                target as metricTargetExtendedWithComparaisonType,
            )

            expect(resultName).toStrictEqual(name)
        })
    })

    test('getTargetYAxisIndexFromTargetName', () => {
        const caseList = [
            {
                target: metricTargetsEnum.consumption,
                YAxisIndex: comparaisonTargetYAxisIndexEnum.COMPARAISON,
            },
            {
                target: CustomTargetsForComparaisonEnum.averageAdemeConsumption,
                YAxisIndex: comparaisonTargetYAxisIndexEnum.COMPARAISON,
            },
        ]
        caseList.forEach(({ YAxisIndex, target }) => {
            // Result
            const resultYAxisIndex = getTargetYAxisIndexFromTargetName(
                target as metricTargetExtendedWithComparaisonType,
            )

            expect(resultYAxisIndex).toStrictEqual(YAxisIndex)
        })
    })

    test('Default options, getXAxisOptionEchartsComparaisonChart', () => {
        const result = getXAxisOptionEchartsComparaisonChart()
        expect(result).toEqual({
            xAxis: [
                {
                    type: 'category',
                    axisLine: {
                        show: true,
                        onZero: true,
                    },
                    axisLabel: {
                        hideOverlap: true,
                        show: false,
                    },
                    axisTick: {
                        alignWithLabel: false,
                    },
                },
            ],
        } as EChartsOption)
    })

    test('getYAxisOptionEchartsComparaisonChart', () => {
        const result = getYAxisOptionEchartsComparaisonChart(theme)
        expect(result).toEqual({
            yAxis: {
                type: 'value',
                axisLine: {
                    onZero: true,
                    show: true,
                    lineStyle: {
                        color: theme.palette.common.black,
                        type: 'solid',
                        opacity: 1,
                    },
                },
                // label position
                position: 'left',
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: theme.palette.common.black,
                        type: 'dashed',
                        opacity: 0.3,
                    },
                },
                axisLabel: {
                    formatter: expect.anything(),
                },
            },
        } as EChartsOption)
    })
})
