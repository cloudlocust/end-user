import {
    calculateGaugeChartPercent,
    getAlertPeriodText,
    getFormatedAlertThreshold,
} from 'src/modules/Dashboard/AlertWidget/utils'
import { AlertPeriodEnum, AlertTypeEnum } from 'src/modules/Dashboard/AlertWidget/AlertWidget.d'

describe('calculateGaugeChartPercent', () => {
    test('should return 1 when alertThreshold is less than or equal to 0 or when alertThreshold is greater than currentValue', () => {
        expect(calculateGaugeChartPercent(-1, 10)).toBe(1)
        expect(calculateGaugeChartPercent(0, 10)).toBe(1)
        expect(calculateGaugeChartPercent(2, 4)).toBe(1)
        expect(calculateGaugeChartPercent(5, 20)).toBe(1)
    })

    test('should calculate the correct percent prop value', () => {
        expect(calculateGaugeChartPercent(50, 25)).toBe(0.5)
        expect(calculateGaugeChartPercent(100, 75)).toBe(0.75)
        expect(calculateGaugeChartPercent(70, 15)).toBe(0.21)
    })
})

describe('getAlertPeriodText', () => {
    test('should return the correct text for each AlertPeriod', () => {
        expect(getAlertPeriodText(AlertPeriodEnum.DAY)).toBe('journalier')
        expect(getAlertPeriodText(AlertPeriodEnum.WEEK)).toBe('hebdomadaire')
        expect(getAlertPeriodText(AlertPeriodEnum.MONTH)).toBe('mensuel')
        expect(getAlertPeriodText('invalidPeriod' as AlertPeriodEnum)).toBe('')
    })
})

describe('getFormatedAlertThreshold', () => {
    test('should return the correct formatted alertThreshold value for each AlertTypeEnum', () => {
        expect(getFormatedAlertThreshold(50, AlertTypeEnum.PRICE)).toBe('50 €')
        expect(getFormatedAlertThreshold(3.178, AlertTypeEnum.PRICE)).toBe('3.18 €')
        expect(getFormatedAlertThreshold(120, AlertTypeEnum.CONSUMPTION)).toBe('120 Wh')
        expect(getFormatedAlertThreshold(3041, AlertTypeEnum.CONSUMPTION)).toBe('3.04 kWh')
        expect(getFormatedAlertThreshold(10, 'invalidType' as AlertTypeEnum)).toBe('')
    })
})
